import Drawer from "react-native-drawer";
import React, {Component, PropTypes} from "react";
import {Dimensions, Platform, StatusBar, StyleSheet, ScrollView, View} from "react-native";
import {DefaultRenderer} from "react-native-router-flux";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {equals, last} from "ramda";
import {Map} from "immutable";

import asteroid from "../lib/asteroid";
import Login from "./login";
import {selectSite} from "../actions/site";
import {generateSessionId} from "../actions/session-id";
import {onLogin, onLogout} from "../actions/user-id";
import KeyboardSpacer from "../components/keyboard-spacer";
import Header from "../components/header";
import SideMenu from "../components/side-menu";
import {primaryBlue, secondaryBlue, background} from "../lib/colors";
import {statusBarHeight} from "../lib/const";

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    statusBarHeightIOS: {
        height: statusBarHeight,
        backgroundColor: primaryBlue
    }
});


class Root extends Component {

    static propTypes = {
        collections: PropTypes.object.isRequired,
        generateSessionId: PropTypes.func.isRequired,
        navigationScene: PropTypes.arrayOf(PropTypes.string).isRequired,
        navigationState: PropTypes.shape({
            children: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        onLogin: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        onNavigate: PropTypes.func.isRequired,
        selectSite: PropTypes.func.isRequired,
        site: PropTypes.object,
        userId: PropTypes.string
    }

    constructor () {
        super();
        this.state = {
            open: false
        };
    }

    componentDidMount () {
        asteroid.on("loggedIn", this.onLoginActions());
        asteroid.on("loggedOut", this.props.onLogout);
        asteroid.ddp.on("added", ({collection, fields, id}) => {
            if (collection == "sites" && !this.props.site) {
                this.props.selectSite({
                    _id: id,
                    title: fields.name,
                    ...fields
                });
            }
        });
    }

    componentWillUnmount () {
        asteroid.off("loggedIn", this.onLoginActions);
        asteroid.off("loggedOut", this.props.onLogout);
    }

    getNavigationChildrenIndex () {
        const currentScene = last(this.props.navigationScene);
        const scenes = this.props.navigationState.children;
        return scenes.findIndex(scene => equals(scene.sceneKey, currentScene));
    }

    getNavigationState () {
        const sceneIndex = this.getNavigationChildrenIndex();
        return this.props.navigationState.children[sceneIndex];
    }

    onLoginActions () {
        return async (userId) => {
            this.props.onLogin(userId);
            this.props.generateSessionId(userId);
        };
    }

    toggleHamburger () {
        this.setState({
            open: !this.state.open
        });
    }

    closeHamburger () {
        this.setState({
            open: false
        });
    }

    getSites () {
        const {collections} = this.props;
        const sites = collections.get("sites") || new Map();
        return sites.map(value => {
            return {
                title: value.get("name"),
                ...value.toJS()
            };
        }).toArray();
    }

    renderView () {
        const {site, selectSite} = this.props;
        return this.props.userId ? (
            <Drawer
                captureGestures={true}
                content={
                    <SideMenu
                        asteroid={asteroid}
                        onSelectSite={selectSite}
                        onTriggerClose={::this.closeHamburger}
                        optionItems={this.getSites()}
                        site={site}
                    />}
                onClose={::this.closeHamburger}
                open={this.state.open}
                openDrawerOffset={0.35}
                panOpenMask={25}
                tapToClose={true}
                type="displace"
            >
                <View>
                    <Header
                        onToggleHamburger={::this.toggleHamburger}
                        selectedView={this.props.navigationScene}
                    />
                    <DefaultRenderer
                        navigationState={this.getNavigationState()}
                        onNavigate={this.props.onNavigate}
                    />
                </View>
            </Drawer>
        ) : (
            <Login asteroid={asteroid} />
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <ScrollView
                alwaysBounceVertical={false}
                automaticallyAdjustContentInsets={true}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps={true}
                style={{height, backgroundColor: background}}
            >
                <View style={Platform.OS === "ios" ? styles.statusBarHeightIOS : null}/>
                <StatusBar
                    backgroundColor={secondaryBlue}
                    barStyle="light-content"
                />
                {this.renderView()}
                <KeyboardSpacer />
            </ScrollView>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        navigationScene: state.navigation,
        site: state.site,
        userId: state.userId
    };
}
function mapDispatchToProps (dispatch) {
    return {
        generateSessionId: bindActionCreators(generateSessionId, dispatch),
        onLogin: bindActionCreators(onLogin, dispatch),
        onLogout: bindActionCreators(onLogout, dispatch),
        selectSite: bindActionCreators(selectSite, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);
