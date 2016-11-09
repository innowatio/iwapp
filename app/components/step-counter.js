import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import FaIcons from "react-native-vector-icons/FontAwesome";

import * as colors from "../lib/colors";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    buttonsWrp: {
        flexDirection: "row",
        justifyContent: "center"
    },
    button: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    textButtonSave: {
        color: colors.white,
        fontSize: 12,
        fontWeight: "normal",
        backgroundColor: colors.transparent
    },
    questionCounter: {
        backgroundColor: colors.secondaryBlue,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    questionCounterText: {
        color: colors.white,
        fontSize: 12
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
        const {height} = Dimensions.get("window");
        return !this.isLastStep() ? (
            <View style={[styles.questionCounter, {height: height * .05, paddingHorizontal: height * .06}]}>
                <Text style={styles.questionCounterText}>
                    {" Step "}
                    {this.props.currentStep}
                    {" di "}
                    {this.props.totalSteps}
                </Text>
            </View>
        ) : null;
    }

    render () {
        const {height} = Dimensions.get("window");
        const btnWidth = (
            this.isLastStep() ? height * .25 : height * .05
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
                    containerStyle={[
                        styles.button, {
                            backgroundColor: btnColorBackward,
                            height: height * .05,
                            width: height * .05,
                            marginHorizontal: height * .02
                        }
                    ]}
                    disabled={this.props.disabledBackward}
                    onPress={this.props.onBackwardStep}
                >
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-left"}
                        size={height * .04}
                        style={{backgroundColor: colors.transparent}}
                    />
                </Button>
                {this.renderCounter()}
                <Button
                    containerStyle={[styles.button, {
                        width: btnWidth,
                        backgroundColor: btnColorForward,
                        marginHorizontal: height * .02
                    }]}
                    disabled={this.props.disabledForward}
                    onPress={this.isLastStep() ? this.props.onSaveAnswers : this.props.onForwardStep}
                    style={styles.textButtonSave}
                >
                    {this.isLastStep() ? (
                        <Text style={styles.questionCounterText}>{"SALVA"}</Text>
                    ) : (
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-right"}
                        size={height * .04}
                        style={{backgroundColor: colors.transparent}}
                    />
                    )}
                </Button>
            </View>
        );
    }

}
