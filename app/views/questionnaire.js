import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import shallowCompare from "react-addons-shallow-compare";

import Icon from "../components/iwapp-icons";
import QuestionnaireProgress from "../components/questionnaire-progress";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import FaIcons from "react-native-vector-icons/FontAwesome";
import {heightWithoutHeader} from "../lib/const";

import demographics from "../assets/json/questionnaire/demographics";

const styles = StyleSheet.create({
    answer: {
        padding: 5,
        flexDirection: "row"
    },
    lastAnswer: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderAccordion
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: colors.background,
        flexDirection: "row"
    },
    header: {
        borderTopWidth: 1,
        borderTopColor: colors.borderAccordion,
        height: 60,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    lastHeader: {
        borderBottomWidth: 1,
        borderBottomColor: colors.borderAccordion
    },
    questionnaireProgressContainer: {
        marginBottom: 10,
        alignItems: "center"
    },
    questionStatus: {
        borderRadius: 100,
        height: 8,
        width: 8,
        marginRight: 10,
        alignSelf: "center"
    },
    answerStatus: {
        borderRadius: 100,
        height: 22,
        width: 22,
        borderWidth: 1,
        borderColor: colors.borderAccordion,
        marginRight: 5,
        marginLeft: 5,
        alignItems: "center"
    },
    answerStatusText: {
        color: colors.questionnaireAnswerStatusText,
        top: 2,
        fontWeight: "bold"
    },
    textAnswer: {
        alignSelf: "center"
    }
});

export default class Questionnaire extends Component {

    static propTypes = {
        selectedQuestionnaire: PropTypes.shape({
            key: PropTypes.string.isRequired
        }).isRequired
    }

    shouldComponentUpdate (nextProps) {
        return shallowCompare(this, nextProps);
    }

    getQuestionnaire () {
        const questionnaires = [
            demographics
        ];
        return questionnaires.find(questionnaire =>
            questionnaire.category === this.props.selectedQuestionnaire.key
        ) || {questions: []};
    }

    isLastSection (index) {
        return index === this.getQuestionnaire().questions.length - 1;
    }

    isAlreadyAnswered () {
        return false;
    }

    isActiveAnswer () {
        return false;
    }

    renderQuestionStatus (section, index) {
        return (
            <View
                style={[styles.questionStatus, {
                    backgroundColor: (
                        this.isAlreadyAnswered(section.id, index) ?
                        colors.greenStatus :
                        colors.redStatus
                    )
                }]}
            />
        );
    }

    renderHeader (section, index, isActive) {
        const {width} = Dimensions.get("window");
        return (
            <View key={index} style={[styles.header, this.isLastSection(index) ? styles.lastHeader : {}]}>
                <View style={{flexDirection: "row"}}>
                    {this.renderQuestionStatus(section, index)}
                    <Text style={{width: width * 0.75}}>{section.text}</Text>
                </View>
                <FaIcons
                    color={colors.iconArrow}
                    name={isActive ? "angle-up" : "angle-down"}
                    size={26}
                    style={{marginRight: 10}}
                />
            </View>
        );
    }

    renderAnswerStatus (index) {
        return this.isActiveAnswer() ? (
            <View style={[styles.answerStatus, {borderColor: colors.greenStatus}]}>
                <Icon
                    color={colors.greenStatus}
                    name="iw-check"
                    size={16}
                    style={{backgroundColor: colors.transparent, top: 2}}
                />
            </View>
        ) : (
            <View style={styles.answerStatus}>
                <Text style={styles.answerStatusText}>{index + 1}</Text>
            </View>
        );
    }

    renderAnswer (option, optionIndex, sectionIndex, optionsLength) {
        const {width} = Dimensions.get("window");
        return (
            <View key={optionIndex} style={[
                optionIndex === optionsLength - 1 && this.isLastSection(sectionIndex) ? styles.lastAnswer : {}
            ]}>
                <TouchableOpacity>
                    <View style={styles.answer}>
                        {this.renderAnswerStatus(optionIndex)}
                        <Text style={[styles.textAnswer, {width: width * 0.85}]}>{option}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderContent (section, sectionIndex) {
        const optionsLength = section.options.length;
        return section.options.map(
            (option, optionIndex) => ::this.renderAnswer(option, optionIndex, sectionIndex, optionsLength)
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        const {selectedQuestionnaire} = this.props;
        return (
            <View style={[styles.container, {height: heightWithoutHeader(height)}]}>
                <Content>
                    <View style={styles.questionnaireProgressContainer}>
                        <QuestionnaireProgress questionnaire={selectedQuestionnaire} />
                    </View>
                    <View>
                        <Accordion
                            renderContent={::this.renderContent}
                            renderHeader={::this.renderHeader}
                            sections={this.getQuestionnaire().questions}
                            underlayColor={colors.transparent}
                        />
                    </View>
                </Content>
            </View>
        );
    }

}
