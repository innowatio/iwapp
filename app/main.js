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
        // TODO
        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            console.log(`TOKEN: ${token}`);
            // store fcm token in your server
        });
        this.notificationUnsubscribe = FCM.on("notification", notif => {
            console.log("NOTIFICA");
            console.log(notif);
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
        });
        this.refreshUnsubscribe = FCM.on("refreshToken", (token) => {
            console.log(`TOKEN REFRESH: ${token}`);
            // fcm token may not be available on first load, catch it here
        });
        AppState.addEventListener("change", this.handleAppStateChange);
        syncStoreAndAsteroid(store, asteroid);
        codePush.sync({installMode: codePush.InstallMode.ON_NEXT_RESUME, minimumBackgroundDuration: 60 * 10});
    }

    componentWillUnmount () {
        AppState.removeEventListener("change", this.handleAppStateChange);
        this.refreshUnsubscribe();
        this.notificationUnsubscribe();
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
