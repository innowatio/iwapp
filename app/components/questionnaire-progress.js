import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";

import * as colors from "../lib/colors";
import CircleProgress from "../components/circle-progress";
import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    progressQuestionnaireWrp: {
        flexDirection: "column",
        alignItems: "stretch"
    },
    progressQuestionnaire: {
        alignItems: "center",
        justifyContent: "center"
    },
    iconQuestionnaireWrp: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    iconQuestionnaire: {
        textAlign: "center",
        backgroundColor: colors.transparent
    },
    titQuestionnaire: {
        fontSize: 11,
        textAlign: "center",
        color: colors.textGrey
    },
    percQuestionnaire: {
        fontSize: 9,
        textAlign: "center",
        color: colors.textGrey
    }
});


export default class QuestionnaireProgress extends Component {

    static propTypes = {
        questionnaire: PropTypes.shape({
            key: PropTypes.string,
            color: PropTypes.string,
            value: PropTypes.number,
            icon: PropTypes.string,
            name: PropTypes.string,
            onPress: PropTypes.func
        }).isRequired
    }

    render () {
        const {questionnaire} = this.props;
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.progressQuestionnaireWrp, {
                height: width * .35,
                marginHorizontal: width * .02,
                marginVertical: height * .015
            }]}
            >
                <TouchableOpacity
                    onPress={questionnaire.onPress}
                    style={[styles.progressQuestionnaire, {width: width * .25, height: width * .25}]}
                    transparent={true}
                >
                    <CircleProgress
                        percentage={questionnaire.value}
                        size={height * .128}
                        strokeColor={questionnaire.color}
                        strokeWidth={2}
                    />
                    <View style={[styles.iconQuestionnaireWrp, {height: width * .25, width: width * .25}]}>
                        <Icon
                            color={questionnaire.color}
                            name={questionnaire.icon}
                            size={height * .08}
                            style={styles.iconQuestionnaire}
                        />
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={{width: width * .25}}>
                        <Text style={styles.titQuestionnaire}>
                            {questionnaire.name}
                        </Text>
                    </View>
                    <View style={{width: width * .25}}>
                        <Text style={styles.percQuestionnaire}>
                            {questionnaire.text}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
