import React from "react";
import {Router, Scene, Reducer} from "react-native-router-flux";

import asteroid from "./asteroid";
import Home from "../views/home";
import Stats from "../views/stats";
import AlarmsSettings from "../views/alarms-settings";
import Profile from "../views/profile";
import Notifications from "../views/notifications";
import ModifyProfile from "../views/modify-profile";
import {pushNavigator, popNavigator} from "../actions/navigation";
import Root from "../views/root";
import store from "./store";

function dispatchAction (action) {
    switch (action.type) {
        case "push": {
            store.dispatch(pushNavigator(action.key));
            break;
        }
        case "BackAction":
            store.dispatch(popNavigator());
            break;
        default:
            break;
    }
}

function reducerCreate (params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
        dispatchAction(action);
        return defaultReducer(state, action);
    };
}

const scene = (
    <Router asteroid={asteroid} createReducer={reducerCreate}>
        <Scene component={Root} key="root">
            <Scene component={Home} key="home" />
            <Scene component={Stats} key="stats" />
            <Scene component={Stats} key="smart" />
            <Scene component={Stats} key="badgeboard" />
            <Scene component={Stats} key="energy" />
            <Scene component={Stats} key="report" />
            <Scene component={Profile} key="profile" />
            <Scene component={Notifications} key="notifications" />
            <Scene component={ModifyProfile} key="modifyProfile" />
            <Scene component={AlarmsSettings} key="alarmsSettings" />
        </Scene>
    </Router>
);

export default scene;
