import React, {Component, PropTypes} from "react";
import {Dimensions, Image, StyleSheet} from "react-native";

import * as colors from "../lib/colors";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    background: {
        justifyContent: "center",
        alignItems: "center"
    },
    powerValue: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        color: colors.powerValue
    },
    unitOfMeasurement: {
        color: colors.powerValue,
        textAlign: "center",
        fontSize: 8,
    }
});

export default class RealTimeSpinner extends Component {
    static propTypes = {
        powerValue: PropTypes.number.isRequired
    }
    render () {
        const {height} = Dimensions.get("window");
        return (
            <Image
                resizeMode={"contain"}
                source={require("../assets/img/spinner.gif")}
                style={[styles.background, {width: height * .14, height: height * .14}]}
            >
                <Text style={styles.powerValue}>
                    {this.props.powerValue >= 99 ? this.props.powerValue.toFixed() : this.props.powerValue.toFixed(1)}
                </Text>
                <Text style={styles.unitOfMeasurement}>{"kW"}</Text>
            </Image>
        );
    }

}
