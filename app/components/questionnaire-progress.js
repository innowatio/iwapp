import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";

import * as colors from "../lib/colors";
import CircleProgress from "../components/circle-progress";
import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    progressQuestionnaire: {
        flexDirection: "column",
        alignItems: "stretch"
    },
    iconQuestionnaireWrp: {
        position: "absolute",
        left: 0,
        alignItems: "center",
        justifyContent: "center",
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
            <View style={[styles.progressQuestionnaire, {marginHorizontal: width * .02, marginVertical: height * .015}]}>
                <CircleProgress
                    percentage={questionnaire.value}
                    size={90}
                    strokeColor={questionnaire.color}
                    strokeWidth={2}
                />
                <TouchableOpacity
                    onPress={questionnaire.onPress}
                    style={[styles.iconQuestionnaireWrp, {top: height * .01, width: width * .25, height: height * .12}]}
                    transparent={true}
                >
                    <Icon
                        color={questionnaire.color}
                        name={questionnaire.icon}
                        size={width * .14}
                    />
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
