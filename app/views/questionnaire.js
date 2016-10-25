import {Map} from "immutable";
import get from "lodash.get";
import {Content} from "native-base";
import {isEmpty, isNil} from "ramda";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {saveQuestionnaireAnswers} from "../actions/questionnaire";
import Icon from "../components/iwapp-icons";
import QuestionnaireProgress from "../components/questionnaire-progress";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import FaIcons from "react-native-vector-icons/FontAwesome";
import {heightWithoutHeader} from "../lib/const";

const styles = StyleSheet.create({
    answer: {
        padding: 5,
        flexDirection: "row"
    },
    lastAnswer: {
        borderBottomWidth: .5,
        borderBottomColor: colors.borderAccordion,
        paddingBottom: 20
    },
    header: {
        borderTopWidth: .5,
        borderTopColor: colors.borderAccordion,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 18,
        paddingVertical: 5
    },
    lastHeader: {
        borderBottomWidth: .5,
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
    questionTextWrp: {
        justifyContent: "center",
        minHeight: 40
    },
    questionText: {
        fontSize: 13,
        color: colors.textGrey
    },
    answerStatus: {
        borderRadius: 100,
        height: 22,
        width: 22,
        borderWidth: .5,
        borderColor: colors.borderAccordion,
        marginHorizontal: 5,
        alignItems: "center"
    },
    answerStatusText: {
        color: colors.questionnaireAnswerStatusText,
        top: 2,
        fontWeight: "bold"
    },
    answerWrp: {
        marginBottom: 5
    },
    textAnswer: {
        alignSelf: "center",
        fontSize: 13,
        color: colors.questionnaireAnswerStatusText,
    }
});

class Questionnaire extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map,
        saveQuestionnaireAnswers: PropTypes.func.isRequired,
        selectedQuestionnaire: PropTypes.shape({
            key: PropTypes.string.isRequired
        }).isRequired,
        sessionId: PropTypes.string.isRequired,
        site: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired
    }

    static defaultProps: {
        site: {}
    }

    constructor (props) {
        super(props);
        this.state = {
            answers: []
        };
    }

    componentWillMount () {
        this.setAnswersState(this.props);
    }

    componentDidMount () {
        this.subscribeToAnswers();
        this.subscribeToQuestions();
    }

    componentWillReceiveProps (nextProps) {
        this.setAnswersState(nextProps);
    }

    setAnswersState (props) {
        const questionnaire = this.getQuestionnaire(props.collections);
        const answersCollection = this.getAnswersFromCollection(props.collections).toJS();
        const answers = this.setAnswers(answersCollection.answers, questionnaire);
        this.setState({answers});
    }

    subscribeToQuestions () {
        const category = this.getQuestionnaireCategory();
        this.props.asteroid.subscribe("questions", {type: "questionnaire", category});
    }

    subscribeToAnswers () {
        const category = this.getQuestionnaireCategory();
        this.props.asteroid.subscribe("answers", {
            siteId: this.props.site._id,
            category,
            type: "questionnaire"
        });
    }

    getQuestionnaire (collections) {
        if (collections.get("questions")) {
            const questionnaire = collections.get("questions").find(questions =>
                questions.get("type") === "questionnaire" &&
                questions.get("category") === this.getQuestionnaireCategory()
            ) || Map();
            return questionnaire.toJS();
        }
        return {};
    }

    getQuestionnaireCategory () {
        return get(this.props, "selectedQuestionnaire.key");
    }

    getAnswersId (collections) {
        const {type, category} = this.getQuestionnaire(collections);
        return `${type}-${category}-${this.props.site._id}`;
    }

    getAnswersFromCollection (collections) {
        return collections.getIn(["answers", this.getAnswersId(collections)]) || Map();
    }

    getAnswerFromState (questionId) {
        return this.state.answers.find(answer => questionId === answer.id);
    }

    setAnswers (answers = [], questionnaire, selectedAnswer, questionIndex) {
        if (!questionnaire.questions) {
            return [];
        }
        return questionnaire.questions.map((question, index) => {
            const selectedAnswerInCollection = answers.find(answer => question.id === answer.id) || {};
            if (isEmpty(selectedAnswerInCollection) && isNil(selectedAnswer)) {
                return {};
            }
            if (index !== questionIndex) {
                return (
                    this.getAnswerFromState(question.id) ||
                    selectedAnswerInCollection
                );
            }
            return {
                id: question.id,
                timestamp: new Date().toISOString(),
                answer: selectedAnswer,
                question: {
                    text: question.text
                }
            };
        });
    }

    isLastSection (questionIndex) {
        return questionIndex === get(this.getQuestionnaire(this.props.collections), "questions.length") - 1;
    }

    isAlreadyAnswered (questionId) {
        const answer = this.getAnswerFromState(questionId);
        return answer && answer.id === questionId;
    }

    isActiveAnswer (option, optionIndex, questionId) {
        const answer = this.getAnswerFromState(questionId);
        return (
            answer &&
            answer.id === questionId &&
            answer.answer === option
        );
    }

    onSaveQuestionnaireAnswers ({option, questionIndex}) {
        const questionnaire = this.getQuestionnaire(this.props.collections);
        const collectionsAnswer = this.getAnswersFromCollection(this.props.collections).get("answers");
        const answers = this.setAnswers(
            collectionsAnswer ? collectionsAnswer.toJS() : [],
            questionnaire,
            option,
            questionIndex
        );
        this.setState({answers});
        this.props.saveQuestionnaireAnswers(
            [answers[questionIndex]],
            this.props.userId,
            this.props.site._id,
            questionnaire,
            this.props.sessionId
        );
    }

    renderQuestionStatus (question) {
        return (
            <View
                style={[styles.questionStatus, {
                    backgroundColor: (
                        this.isAlreadyAnswered(question.id) ?
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
                    <View style={[styles.questionTextWrp, {width: width * 0.75}]}>
                        <Text style={styles.questionText}>{question.text}</Text>
                    </View>
                </View>
                <FaIcons
                    color={colors.iconArrow}
                    name={isActive ? "angle-up" : "angle-down"}
                    size={26}
                />
            </View>
        );
    }

    renderAnswerStatus (option, optionIndex, questionId) {
        return this.isActiveAnswer(option, optionIndex, questionId) ? (
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
            ]}
            >
                <TouchableOpacity onPress={() => this.onSaveQuestionnaireAnswers(...arguments)} style={styles.answerWrp}>
                    <View style={styles.answer}>
                        {this.renderAnswerStatus(option, optionIndex, question.id)}
                        <Text style={[styles.textAnswer, {width: width * 0.85}]}>{option}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderContent (question, questionIndex) {
        return question.options.map((option, optionIndex) =>
            ::this.renderAnswer({option, optionIndex, question, questionIndex})
        );
    }

    renderAccordion (questionnaire) {
        return !isEmpty(questionnaire) ? (
            <Accordion
                renderContent={::this.renderContent}
                renderHeader={::this.renderHeader}
                sections={questionnaire.questions}
                underlayColor={colors.transparent}
            />
        ) : null;
    }

    render () {
        const {height} = Dimensions.get("window");
        const {selectedQuestionnaire} = this.props;
        const questionnaire = this.getQuestionnaire(this.props.collections);
        return (
            <View style={{height: heightWithoutHeader(height)}}>
                <Content>
                    <View style={styles.questionnaireProgressContainer}>
                        <QuestionnaireProgress questionnaire={selectedQuestionnaire} />
                    </View>
                    <View>
                        {this.renderAccordion(questionnaire)}
                    </View>
                </Content>
            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        sessionId: state.sessionId,
        site: state.site,
        userId: state.userId
    };
}
function mapDispatchToProps (dispatch) {
    return {
        saveQuestionnaireAnswers: bindActionCreators(saveQuestionnaireAnswers, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Questionnaire);
