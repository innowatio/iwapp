import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Content} from "native-base";


import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    }
});

export default class Notifications extends Component {

    render () {
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <Text>{"Notifications"}</Text>
                </Content>
            </View>
        );
    }

}
