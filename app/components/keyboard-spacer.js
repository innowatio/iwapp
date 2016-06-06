import React from "react";
import {Platform, View} from "react-native";
import KeyboardSpacerIOS from "react-native-keyboard-spacer";

const KeyboardSpacer = (props) => {
    if (Platform.OS === "android") {
        return <View />;
    }

    return (
        <KeyboardSpacerIOS {...props} />
    );
};

export default KeyboardSpacer;
