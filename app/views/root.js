import React, {Component, PropTypes} from "react";
import {StatusBar, StyleSheet, ScrollView, View} from "react-native";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {equals, last} from "ramda";
import {DefaultRenderer} from "react-native-router-flux";

import asteroid from "../lib/asteroid";
import Login from "./login";
import KeyboardSpacer from "../components/keyboard-spacer";
import {onLogin, onLogout} from "../actions/user-id";
import Header from "../components/header";
import {primaryBlue} from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

class Root extends Component {

    static propTypes = {
        navigationScene: PropTypes.arrayOf(PropTypes.string).isRequired,
        navigationState: PropTypes.shape({
            children: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        onLogin: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        onNavigate: PropTypes.func.isRequired,
        userId: PropTypes.string
    }

    componentDidMount () {
        asteroid.on("loggedIn", this.props.onLogin);
        asteroid.on("loggedOut", this.props.onLogout);
    }

    componentWillUnmount () {
        asteroid.off("loggedIn", this.props.onLogin);
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

    renderView () {
        return this.props.userId ? (
            <View>
                <Header />
                <DefaultRenderer
                    navigationState={this.getNavigationState()}
                    onNavigate={this.props.onNavigate}
                />
            </View>
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
                <StatusBar
                    backgroundColor={primaryBlue}
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
        navigationScene: state.navigation,
        userId: state.userId
    };
}
function mapDispatchToProps (dispatch) {
    return {
        onLogin: bindActionCreators(onLogin, dispatch),
        onLogout: bindActionCreators(onLogout, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Root);
