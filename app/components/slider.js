import React, {Component} from "react";
import {Dimensions, Platform, Slider, StyleSheet, View} from "react-native";

import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    sliderWrp: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});

let sliderStyles;
if (Platform.OS === "ios") {
    sliderStyles = StyleSheet.create({
        slider: {
            height: 40,
            marginVertical: 10
        },
    });
} else {
    sliderStyles = StyleSheet.create({
        slider: {
            height: 30,
            marginVertical: 10
        },
    });
}

export default class RangeSlider extends Component {

    render () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.sliderWrp}>
                <Slider
                    {...this.props}
                    maximumTrackTintColor={colors.textGrey}
                    minimumTrackTintColor={colors.secondaryBlue}
                    style={[sliderStyles.slider, {width: width * 0.80}]}
                />
            </View>
        );
    }
}
