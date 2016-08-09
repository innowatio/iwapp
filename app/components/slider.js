import React, {Component} from "react";
import {Dimensions, Slider, StyleSheet, View} from "react-native";

import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    sliderWrp: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default class RangeSlider extends Component {

    render () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.sliderWrp}>
                <Slider
                    {...this.props}
                    maximumTrackTintColor={colors.textGrey}
                    minimumTrackTintColor={colors.secondaryBlue}
                    style={{width: width * 0.80}}
                />
            </View>
        );
    }
}
