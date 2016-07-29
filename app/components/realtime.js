import React, {Component, PropTypes} from "react";
import {Image, StyleSheet} from "react-native";

import * as colors from "../lib/colors";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    background: {
        width: 88,
        height: 88,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
    },
    powerValue: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        color: colors.powerValue
    },
    unitOfMeasurement: {
        color: colors.powerValue,
        textAlign: "center",
        fontSize: 12,
    }
});

export default class RealTimeSpinner extends Component {
    static propTypes = {
        powerValue: PropTypes.number.isRequired
    }

    render () {
        return (
            <Image source={require("../assets/img/spinner.gif")} style={styles.background}>
                <Text style={styles.powerValue}>
                    {this.props.powerValue >= 99 ? this.props.powerValue.toFixed() : this.props.powerValue.toFixed(1)}
                </Text>
                <Text style={styles.unitOfMeasurement}>{"kW"}</Text>
            </Image>
        );
    }

}
