import {Map} from "immutable";
import get from "lodash.get";
import {Content} from "native-base";
import {isEmpty} from "ramda";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import shallowCompare from "react-addons-shallow-compare";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {initializeAnswers, saveQuestionnaireAnswers, setAnswers} from "../actions/questionnaire";
import Icon from "../components/iwapp-icons";
import QuestionnaireProgress from "../components/questionnaire-progress";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import FaIcons from "react-native-vector-icons/FontAwesome";
import {heightWithoutHeader} from "../lib/const";

import demographics from "../assets/json/questionnaire/demographics";
import building from "../assets/json/questionnaire/building";

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
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: colors.borderAccordion,
        flexDirection: "row",
        height: 60,
        justifyContent: "space-between",
        paddingHorizontal: 15
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
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map,
        initializeAnswers: PropTypes.func.isRequired,
        questionnaire: PropTypes.object,
        saveQuestionnaireAnswers: PropTypes.func.isRequired,
        selectedQuestionnaire: PropTypes.shape({
            key: PropTypes.string.isRequired
        }).isRequired,
        setAnswers: PropTypes.func.isRequired,
        site: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired
    }

    static defaultProps: {
        site: {}
    }

    componentDidMount () {
        const questionnaire = this.getQuestionnaire();
        this.props.initializeAnswers(questionnaire);
        this.subscribeToAnswers(this.props);
    }

    componentWillReceiveProps (nextProps) {
        if (!shallowCompare(this.props, nextProps)) {
            this.props.setAnswers(this.getAnswers(nextProps.collections).toJS(), this.getQuestionnaire());
        }
    }

    shouldComponentUpdate (nextProps) {
        return shallowCompare(this, nextProps);
    }

    subscribeToAnswers () {
        const questionnaire = this.getQuestionnaire();
        this.props.asteroid.subscribe("answers", {
            siteId: this.props.site._id,
            category: questionnaire.category,
            type: questionnaire.type
        });
    }

    getQuestionnaire () {
        const questionnaires = [
            demographics,
            building
        ];
        return questionnaires.find(questionnaire =>
            questionnaire.category === this.props.selectedQuestionnaire.key
        );
    }

    getQuestionnaireId () {
        const {type, category} = this.getQuestionnaire();
        return `${type}-${category}-${this.props.site._id}`;
    }

    getAnswers (collections) {
        return collections.getIn(["answers", this.getQuestionnaireId()]) || Map();
    }

    getAnswer (questionNumber) {
        return  get(this.props.questionnaire, `answers[${questionNumber}]`) || {};
    }

    isLastSection (questionIndex) {
        return questionIndex === this.getQuestionnaire().questions.length - 1;
    }

    isAlreadyAnswered (questionId, questionIndex) {
        const answer = this.getAnswer(questionIndex);
        return !isEmpty(answer) && answer.id === questionId;
    }

    isActiveAnswer (option, optionIndex, questionId, questionIndex) {
        const answer = this.getAnswer(questionIndex);
        return (
            !isEmpty(answer) &&
            answer.id === questionId &&
            answer.answer === option
        );
    }

    onSaveQuestionnaireAnswers ({option, questionIndex}) {
        console.log(...arguments);
        this.props.setAnswers(
            this.getAnswers(this.props.collections).toJS(),
            this.getQuestionnaire(),
            option,
            questionIndex
        );
        // this.props.saveQuestionnaireAnswers(
        //     this.getAnswersBodyPost(option, sectionIndex),
        //     this.props.userId,
        //     this.props.site._id
        // );
    }

    renderQuestionStatus (question, questionIndex) {
        return (
            <View
                style={[styles.questionStatus, {
                    backgroundColor: (
                        this.isAlreadyAnswered(question.id, questionIndex) ?
                        colors.greenStatus :
                        colors.redStatus
                    )
                }]}
            />
        );
    }

    renderHeader (question, questionIndex, isActive) {
        const {width} = Dimensions.get("window");
        return (
            <View
                key={questionIndex}
                style={[styles.header, this.isLastSection(questionIndex) ? styles.lastHeader : {}]}
            >
                <View style={{flexDirection: "row"}}>
                    {this.renderQuestionStatus(question, questionIndex)}
                    <Text style={{width: width * 0.75}}>{question.text}</Text>
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

    renderAnswerStatus (option, optionIndex, questionId, questionIndex) {
        return this.isActiveAnswer(option, optionIndex, questionId, questionIndex) ? (
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
                <Text style={styles.answerStatusText}>{optionIndex + 1}</Text>
            </View>
        );
    }

    renderAnswer ({option, optionIndex, questionIndex, question}) {
        const {width} = Dimensions.get("window");
        const optionsLength = question.options.length;
        return (
            <View key={optionIndex} style={[
                (optionIndex === optionsLength - 1 && this.isLastSection(questionIndex)) ? styles.lastAnswer : {}
            ]}>
                <TouchableOpacity onPress={() => this.onSaveQuestionnaireAnswers(...arguments)}>
                    <View style={styles.answer}>
                        {this.renderAnswerStatus(option, optionIndex, question.id, questionIndex)}
                        <Text style={[styles.textAnswer, {width: width * 0.85}]}>{option}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderContent (question, questionIndex) {
        return question.options.map((option, optionIndex) =>
            ::this.renderAnswer({option, optionIndex, questionIndex, question})
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        const {selectedQuestionnaire} = this.props;
        const questionnaire = this.getQuestionnaire();
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
                            sections={questionnaire ? questionnaire.questions : []}
                            underlayColor={colors.transparent}
                        />
                    </View>
                </Content>
            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        questionnaire: state.questionnaire,
        site: state.site,
        userId: state.userId
    };
}
function mapDispatchToProps (dispatch) {
    return {
        initializeAnswers: bindActionCreators(initializeAnswers, dispatch),
        saveQuestionnaireAnswers: bindActionCreators(saveQuestionnaireAnswers, dispatch),
        setAnswers: bindActionCreators(setAnswers, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire);
