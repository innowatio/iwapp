import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import FaIcons from "react-native-vector-icons/FontAwesome";

import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    buttonScrollWrp: {
        position: "absolute",
        height: 30,
        zIndex: 100,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 10,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    buttonScroll: {
        borderRadius: 100,
        height: 30,
        width: 30,
        backgroundColor: colors.primaryBlue,
        justifyContent: "center",
        alignItems: "center"

    }
});

export default class Scroll extends Component {

    static propTypes = {
        visible: PropTypes.bool.isRequired
    }

    render () {
        const {height} = Dimensions.get("window");
        return this.props.visible ? (
            <View style={[styles.buttonScrollWrp, {top: height * .65}]}>
                <Button
                    containerStyle={[styles.buttonScroll]}
                    disabled={true}

                >
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-down"}
                        size={20}
                    />
                </Button>
            </View>
        ) : null;
    }

}
