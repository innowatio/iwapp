import {Map} from "immutable";
import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import shallowCompare from "react-addons-shallow-compare";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {saveQuestionnaireAnswers} from "../actions/questionnaire";
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
        saveQuestionnaireAnswers: PropTypes.func.isRequired,
        selectedQuestionnaire: PropTypes.shape({
            key: PropTypes.string.isRequired
        }).isRequired,
        site: PropTypes.object.isRequired,
        userId: PropTypes.string.isRequired
    }

    componentDidMount () {
        this.subscribeToAnswers(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.subscribeToAnswers(nextProps);
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

    getAnswers () {
        return this.props.collections.getIn(["answers", this.getQuestionnaireId()]) || Map();
    }

    getAnswer (questionNumber) {
        return  this.getAnswers().getIn(["answers", questionNumber]) || Map();
    }

    isLastSection (index) {
        return index === this.getQuestionnaire().questions.length - 1;
    }

    isAlreadyAnswered (id, index) {
        const answer = this.getAnswer(index);
        return !answer.isEmpty() && answer.get("id") === id;
    }

    isActiveAnswer (index, option, id) {
        const answer = this.getAnswer(index);
        return (
            !answer.isEmpty() &&
            answer.get("id") === id &&
            answer.get("answer") === option
        );
    }

    onSaveQuestionnaireAnswers () {
        // this.props.saveQuestionnaireAnswers(
        //     this.props.userId,
        //     this.props.site
        // );
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

    renderAnswerStatus (index, option, sectionId) {
        return this.isActiveAnswer(index, option, sectionId) ? (
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

    renderAnswer (option, optionIndex, sectionIndex, optionsLength, section) {
        const {width} = Dimensions.get("window");
        return (
            <View key={optionIndex} style={[
                optionIndex === optionsLength - 1 && this.isLastSection(sectionIndex) ? styles.lastAnswer : {}
            ]}>
                <TouchableOpacity onPress={() => this.onSaveQuestionnaireAnswers(option, sectionIndex)}>
                    <View style={styles.answer}>
                        {this.renderAnswerStatus(optionIndex, option, section.id)}
                        <Text style={[styles.textAnswer, {width: width * 0.85}]}>{option}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderContent (section, sectionIndex) {
        const optionsLength = section.options.length;
        return section.options.map(
            (option, optionIndex) => ::this.renderAnswer(option, optionIndex, sectionIndex, optionsLength, section)
        );
    }

    render () {
        console.log(this.props.collections);
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
