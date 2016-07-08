import {range} from "ramda";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";

import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    dot: {
        // FIXME when RN0.29 add zIndex
        position: "absolute",
        top: 10,
        left: 17,
        width: 14,
        height: 14,
        borderRadius: 100
    },
    line: {
        width: 18,
        height: 6,
        top: 14
    },
    stepsContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        flexDirection: "row",
        height: 20
    },
    step: {
        width: 30,
        height: 20
    }
});

export default class Stepper extends Component {

    static propTypes = {
        backgroundDotColor: PropTypes.string,
        backgroundDotColorActive: PropTypes.string,
        backgroundLineColor: PropTypes.string,
        backgroundLineColorActive: PropTypes.string,
        lastActiveStepIndex: PropTypes.number,
        onPressDot: PropTypes.func,
        steps: PropTypes.number.isRequired
    }

    static defaultProps = {
        backgroundDotColor: colors.stepperDot,
        backgroundLineColor: colors.stepperLine,
        backgroundDotColorActive: colors.stepperDotActive,
        backgroundLineColorActive: colors.stepperLineActive,
        lastActiveStepIndex: 0
    }

    isActive (stepNumber) {
        return stepNumber <= this.props.lastActiveStepIndex;
    }

    renderLine (stepNumber) {
        const backgroundColor = (
            this.isActive(stepNumber) ?
            this.props.backgroundLineColorActive :
            this.props.backgroundLineColor
        );
        return (
            <View style={[styles.line, {backgroundColor}]} />
        );
    }

    renderStep (stepNumber) {
        const backgroundColor = (
            this.isActive(stepNumber) ?
            this.props.backgroundDotColorActive :
            this.props.backgroundDotColor
        );
        return (
            <View key={stepNumber} style={styles.step}>
                <TouchableOpacity
                    disabled={!this.props.onPressDot || !this.isActive(stepNumber)}
                    onPress={() => this.props.onPressDot(stepNumber)}
                    style={[styles.dot, {backgroundColor}]}
                />
                {stepNumber > 0 ? this.renderLine(stepNumber) : null}
            </View>
        );
    }

    render () {
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.stepsContainer, {width}]}>
                {range(0, this.props.steps).map(::this.renderStep)}
            </View>
        );
    }

}
