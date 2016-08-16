import React, {Component} from "react";
import {AppState} from "react-native";
import codePush from "react-native-code-push";
import {Provider} from "react-redux";

import {postAnalytics} from "./actions/analytics";
import asteroid from "./lib/asteroid";
import {syncStoreAndAsteroid} from "./lib/asteroid-redux";
import scene from "./lib/scene";
import store from "./lib/store";

export default class Main extends Component {

    componentDidMount () {
        AppState.addEventListener("change", this.handleAppStateChange);
        syncStoreAndAsteroid(store, asteroid);
        codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 10});
    }

    componentWillUnmount () {
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange (currentState) {
        if (currentState === "background") {
            const {userId, sessionId} = store.getState();
            if (userId && sessionId) {
                store.dispatch(postAnalytics(userId, sessionId));
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
