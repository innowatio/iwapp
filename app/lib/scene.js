import React from "react";
import {Actions, ActionConst, Router, Scene, Reducer} from "react-native-router-flux";

import {
    pushNavigator,
    popNavigator,
    resetNavigator,
    replaceNavigator,
    popToNavigator
} from "../actions/navigation";
import asteroid from "./asteroid";
import store from "./store";
import AlarmsSettings from "../views/alarms-settings";
import Home from "../views/home";
import ModifyProfile from "../views/modify-profile";
import Questionnaire from "../views/questionnaire";
import Notifications from "../views/notifications";
import Profile from "../views/profile";
import Root from "../views/root";
import Stats from "../views/stats";

export function getNavigationType (selectedView) {
    if (selectedView.length > 2) {
        Actions.popTo(selectedView[1]);
    }
    return {
        type: selectedView.length > 1 ?
        ActionConst.REPLACE :
        ActionConst.PUSH
    };
}

function dispatchAction (action) {
    switch (action.type) {
        case ActionConst.PUSH: {
            store.dispatch(pushNavigator(action.key));
            break;
        }
        case ActionConst.BACK_ACTION: {
            store.dispatch(popNavigator());
            break;
        }
        case ActionConst.RESET: {
            store.dispatch(resetNavigator());
            break;
        }
        case ActionConst.REPLACE: {
            store.dispatch(replaceNavigator(action.key));
            break;
        }
        case ActionConst.POP_TO: {
            store.dispatch(popToNavigator(action.data));
            break;
        }
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
            <Scene component={Home} key="home" type={ActionConst.RESET} />
            <Scene component={Stats} key="stats" />
            <Scene component={Stats} key="smart" />
            <Scene component={Stats} key="badgeboard" />
            <Scene component={Stats} key="energy" />
            <Scene component={Stats} key="report" />
            <Scene component={Notifications} key="notifications" />
            <Scene component={AlarmsSettings} key="alarmsSettings" />
            {/*Profile Views */}
            <Scene component={Profile} key="profile" />
            <Scene component={Questionnaire} key="questionnaire" />
            <Scene component={ModifyProfile} key="modifyProfile" />
        </Scene>
    </Router>
);

export default scene;
