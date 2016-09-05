import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import FaIcons from "react-native-vector-icons/FontAwesome";

import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    buttonScrollWrp: {
        position: "absolute",
        zIndex: 100,
        bottom: 0,
        top:0,
        left: 0,
        right: 0
    },
    buttonScroll: {
        borderRadius: 100,
        backgroundColor: colors.primaryBlue,
        justifyContent: "center",
        alignItems: "center"

    }
});

export default class Scroll extends Component {

    static propTypes = {
        style: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired
    }

    render () {
        const {height} = Dimensions.get("window");
        return this.props.visible ? (
            <View style={[styles.buttonScrollWrp, this.props.style]}>
                <Button
                    containerStyle={[styles.buttonScroll, {height: height * .05, width: height * .05}]}
                    disabled={true}
                >
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-down"}
                        size={height * .035}
                    />
                </Button>
            </View>
        ) : null;
    }

}
