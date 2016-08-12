import React, {Component, PropTypes} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import * as Progress from "react-native-progress";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    progressQuestionnaire: {
        flexDirection: "column",
        alignItems: "stretch",
        marginTop: 20,
        width: 90,
        marginHorizontal: 5
    },
    circleProgress: {
        width: 90,
        alignItems: "center"
    },
    iconQuestionnaireWrp: {
        position: "absolute",
        width: 90,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.transparent,
        top: 0,
        left: 0
    },
    titQuestionnaire: {
        width: 90,
        fontSize: 14,
        padding: 0,
        textAlign: "center",
        marginTop: 3,
        color: colors.textGrey
    },
    percQuestionnaire: {
        fontSize: 11,
        padding: 0,
        textAlign: "center",
        color: colors.textGrey
    }
});


export default class QuestionnaireProgress extends Component {

    static propTypes = {
        questionnaire: PropTypes.shape({
            key: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
            icon: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            onPress: PropTypes.func
        }).isRequired
    }

    render () {
        const {questionnaire} = this.props;
        return (
            <View style={styles.progressQuestionnaire}>
                <Progress.Circle
                    animating={false}
                    borderWidth={0}
                    color={questionnaire.color}
                    progress={questionnaire.value}
                    size={80}
                    style={styles.circleProgress}
                />
                <TouchableOpacity
                    onPress={questionnaire.onPress}
                    style={styles.iconQuestionnaireWrp}
                    transparent={true}
                >
                    <Icon
                        color={questionnaire.color}
                        name={questionnaire.icon}
                        size={52}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titQuestionnaire}>
                        {questionnaire.name}
                    </Text>
                    <Text style={styles.percQuestionnaire}>
                        {questionnaire.value * 100}
                        {"% completato"}
                    </Text>
                </View>
            </View>
        );
    }

}
