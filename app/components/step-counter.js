import React, {Component, PropTypes} from "react";
import {StyleSheet, View} from "react-native";
import Button from "react-native-button";
import FaIcons from "react-native-vector-icons/FontAwesome";

import * as colors from "../lib/colors";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    buttonsWrp: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 20
    },
    button: {
        width: 30,
        height: 30,
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15
    },
    textButtonSave: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "normal",
        backgroundColor: colors.transparent
    },

    questionCounter: {
        backgroundColor: colors.secondaryBlue,
        paddingHorizontal: 30,
        borderRadius: 100,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    questionCounterText: {
        color: colors.white,
        fontSize: 14
    },
});

export default class StepCounter extends Component {

    static propTypes = {
        currentStep: PropTypes.number,
        disabledBackward: PropTypes.bool,
        disabledForward: PropTypes.bool,
        onBackwardStep: PropTypes.func.isRequired,
        onForwardStep: PropTypes.func.isRequired,
        onSaveAnswers: PropTypes.func.isRequired,
        saveSurveyAnswers: PropTypes.func,
        totalSteps: PropTypes.number.isRequired
    }

    static defaultProps = {
        currentStep: 1
    }

    isLastStep () {
        return this.props.currentStep === this.props.totalSteps;
    }

    renderCounter () {
        return this.isLastStep() ? null : (
            <View style={styles.questionCounter}>
                <Text style={styles.questionCounterText}>
                    {" Step "}
                    {this.props.currentStep}
                    {" di "}
                    {this.props.totalSteps}
                </Text>
            </View>
        );
    }

    render () {
        const btnWidth = (
            this.isLastStep() ? 150 : 30
        );
        const btnColorForward = (
            this.props.disabledForward ? colors.buttonsDisabled  : colors.buttonPrimary
        );
        const btnColorBackward = (
            this.props.disabledBackward ? colors.buttonsDisabled : colors.buttonPrimary
        );
        return (
            <View style={styles.buttonsWrp}>
                <Button
                    containerStyle={[styles.button, {backgroundColor: btnColorBackward}]}
                    disabled={this.props.disabledBackward}
                    onPress={this.props.onBackwardStep}
                >
                    <FaIcons color={colors.iconWhite} name={"angle-left"} size={22} />
                </Button>
                {this.renderCounter()}
                <Button
                    containerStyle={[styles.button, {width: btnWidth, backgroundColor: btnColorForward}]}
                    disabled={this.props.disabledForward}
                    onPress={this.isLastStep() ? this.props.onSaveAnswers : this.props.onForwardStep}
                    style={styles.textButtonSave}
                >
                    {this.isLastStep() ?
                        <Text style={styles.questionCounterText}>{"SALVA"}</Text> : <FaIcons color={colors.iconWhite} name={"angle-right"} size={22} />
                    }
                </Button>
            </View>
        );
    }

}
