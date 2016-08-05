import get from "lodash.get";
import {last} from "ramda";
import {AppRegistry, BackAndroid} from "react-native";
import {Actions} from "react-native-router-flux";

import Main from "./app/main";
import store from "./app/lib/store";

BackAndroid.addEventListener("hardwareBackPress", () => {
    if (get(store.getState(), "navigation.length") === 1) {
        return;
    }
    if (!last(store.getState().navigation)) {
        Actions.pop();
    }
    return true;
});

AppRegistry.registerComponent("iwapp", () => Main);
