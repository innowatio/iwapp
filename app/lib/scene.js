import React from "react";
import {Router, Scene, Reducer} from "react-native-router-flux";

import Root from "../views/root";
import Home from "../views/home";
import store from "./store";
import {pushNavigator, popNavigator} from "../actions/navigation";
import asteroid from "./asteroid";

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
        <Scene key="root" component={Root}>
            <Scene key="home" component={Home} />
        </Scene>
    </Router>
);

export default scene;
