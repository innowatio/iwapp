import {Map} from "immutable";
import Drawer from "react-native-drawer";
import React, {Component, PropTypes} from "react";
import {Platform, StatusBar, StyleSheet, ScrollView, View} from "react-native";
import {DefaultRenderer} from "react-native-router-flux";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {equals, last} from "ramda";

import {selectSite} from "../actions/site";
import {generateSessionId} from "../actions/session-id";
import {onLogin, onLogout} from "../actions/user-id";
import Header from "../components/header";
import KeyboardSpacer from "../components/keyboard-spacer";
import SideMenu from "../components/side-menu";
import SurveyModal from "../components/survey-modal";
import asteroid from "../lib/asteroid";
import {statusBarHeight} from "../lib/const";
import {primaryBlue, secondaryBlue} from "../lib/colors";
import Login from "./login";

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
        survey: PropTypes.arrayOf(PropTypes.object),
        userId: PropTypes.string
    }

    constructor () {
        super();
        this.state = {
            email: " ",
            open: false,
            surveyModalVisible: false,
            username: " ",
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
        asteroid.subscribe("questions", {type: "survey"});
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.collections) {
            const survey = this.getSurvey(nextProps.collections);
            return this.setState({
                surveyModalVisible: (
                    !survey.isEmpty() &&
                    !nextProps.survey.find(objectSurvey => {
                        return objectSurvey.id === survey.get("_id");
                    }) &&
                    last(nextProps.navigationScene) !== "survey"
                )
            });
        }
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

    getHeaderViews () {
        return [
            {view: "survey", header: "empty", disableDrawer: true},
            {view: "questionnaire", header: "back-arrow"},
            {view: "alarmsSettings", header: "back-arrow"},
            {view: "modifyProfile", header: "back-arrow"}
        ];
    }

    isDrawerDisabled () {
        const views = this.getHeaderViews();
        const selectedView = views.find(({view}) => view === last(this.props.navigationScene));
        return selectedView ? selectedView.disableDrawer : false;
    }

    onLoginActions () {
        return async (userId) => {
            this.props.onLogin(userId);
            this.props.generateSessionId(userId);
            asteroid.call("getUserInfo").then(userInfo => {
                this.setState({
                    username: userInfo.username,
                    email: userInfo.mail[0],
                    name: userInfo.givenName[0]
                });
            });
        };
    }

    onCloseModal () {
        this.setState({surveyModalVisible: false});
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

    getSurvey (collections) {
        const questions = collections.get("questions") || Map();
        return questions.find(question => question.get("type") === "survey") || Map();
    }

    renderHeader () {
        const {username, email} = this.state;
        return (
            <Header
                headerViews={this.getHeaderViews()}
                onToggleHamburger={::this.toggleHamburger}
                selectedView={this.props.navigationScene}
                userName={(username[0] || email[0] || "").toUpperCase()}
            />
        );
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
                disabled={this.isDrawerDisabled()}
                onClose={::this.closeHamburger}
                open={this.state.open}
                openDrawerOffset={0.35}
                panOpenMask={25}
                tapToClose={true}
                type="displace"
            >
                <View>
                    {this.renderHeader()}
                    <SurveyModal
                        onCloseModal={::this.onCloseModal}
                        survey={this.getSurvey(this.props.collections)}
                        visible={this.state.surveyModalVisible}
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
        return (
            <ScrollView
                alwaysBounceVertical={false}
                automaticallyAdjustContentInsets={true}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps={true}
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
        survey: state.survey,
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
