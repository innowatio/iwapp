import React, {Component} from "react";
import {AppState} from "react-native";
import codePush from "react-native-code-push";
import {Provider} from "react-redux";
import FCM from "react-native-fcm";

import {postAnalytics} from "./actions/analytics";
import asteroid from "./lib/asteroid";
import {syncStoreAndAsteroid} from "./lib/asteroid-redux";
import scene from "./lib/scene";
import store from "./lib/store";

export default class Main extends Component {

    componentDidMount () {
        FCM.requestPermissions(); // for iOS
        AppState.addEventListener("change", this.handleAppStateChange);
        syncStoreAndAsteroid(store, asteroid);
        codePush.sync({
            installMode: codePush.InstallMode.ON_NEXT_RESTART,
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
            minimumBackgroundDuration: 60 * 10
        });
    }

    componentWillUnmount () {
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange (currentState) {
        if (currentState === "background") {
            const {user, sessionId} = store.getState();
            if (user && user.userId && sessionId) {
                store.dispatch(postAnalytics(user.userId, sessionId));
            }
        }
    }

    render () {
        return (
            <Provider store={store}>
                {scene}
            </Provider>
        );
    }

}
