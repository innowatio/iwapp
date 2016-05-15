import {AppRegistry, BackAndroid} from "react-native";
import {Actions} from "react-native-router-flux";
import get from "lodash.get";

import Main from "./app/main";
import store from "./app/lib/store";

BackAndroid.addEventListener("hardwareBackPress", () => {
    if (get(store.getState(), "navigation.length") === 1) {
        return;
    }
    Actions.pop();
    return true;
});

AppRegistry.registerComponent("iwapp", () => Main);
