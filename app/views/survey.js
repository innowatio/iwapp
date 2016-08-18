import moment from "moment";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import Button from "react-native-button";
import {connect} from "react-redux";
import FaIcons from "react-native-vector-icons/FontAwesome";
import {Actions} from "react-native-router-flux";
import {bindActionCreators} from "redux";
import StarRating from "react-native-star-rating";

import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import Stepper from "../components/stepper";
import ConfirmModal from "../components/confirm-modal";
import {saveSurveyAnswers} from "../actions/survey";
import {SURVEY_RATE, SURVEY_SIGLE_CHOICE} from "../actions/survey";
//import Icon from "./iwapp-icons";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    },
    titleBarWrp: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        backgroundColor: colors.secondaryBlue
    },
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        fontWeight: "bold",
        color: colors.white
    },
    // CONTENT
    contentSurveyWrp: {
        paddingVertical: 10,
        alignItems: "center"
    },
    questionSurveyWrp: {
        paddingVertical: 30,
        paddingHorizontal: 25,
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: colors.lightGrey
    },
    questionSurvey: {
        textAlign: "center",
        fontSize: 18,
        color: colors.primaryBlue
    },
    answerSurveyWrp: {
        borderBottomWidth: .5,
        borderBottomColor: colors.lightGrey
    },
    answerSurvey: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    activeAnswerSurvey: {
        backgroundColor: colors.selectedAnswer,
    },
    activeAnswer: {
        color: colors.textGrey
    },
    answer: {
        fontSize: 16,
        color: colors.grey,
        textAlign: "center"
    },

    // BUTTON SAVE
    buttonSaveWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonSave: {
        width: 150,
        height: 30,
        marginHorizontal: 10,
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonBack: {
        marginRight: 20
    },
    textButtonSave: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "normal",
        backgroundColor: colors.transparent
    },

    iconArrow: {
        marginLeft: 6
    },
});

class Survey extends Component {

    static propTypes = {
        saveSurveyAnswers: PropTypes.func.isRequired,
        sessionId: PropTypes.string,
        survey: IPropTypes.map.isRequired,
        userId: PropTypes.string
    }

    constructor (props) {
        super(props);
        this.state = {
            activeStep: 0,
            modalVisible: false,
            answers: [],
            questions: []
        };
    }

    onForwardStep () {
        this.setState({activeStep: this.state.activeStep + 1});
    }

    onBackwardStep () {
        this.setState({activeStep: this.state.activeStep - 1});
    }

    onSaveAnswers () {
        const {survey} = this.props;
        const surveyInfo = {
            questionId: survey.get("_id"),
            type: survey.get("type"),
            category: survey.get("category")
        };
        this.props.saveSurveyAnswers(
            surveyInfo,
            this.state.answers,
            this.props.userId,
            this.props.sessionId
        );
        this.toggleConfirmModal();
    }

    setActiveStep (activeStep) {
        this.setState({activeStep});
    }

    setAnswer (answer, id) {
        // Clone the state
        var answers = this.state.answers.slice(0);
        const question = this.props.survey.get("questions").find(question => question.get("id") === id);
        answers[this.state.activeStep] = {
            answer,
            id,
            timestamp: moment().toISOString(),
            question: {
                text: question.get("text"),
                category: question.get("category")
            }
        };
        if (!this.isLastStep()) {
            this.onForwardStep();
        }
        return this.setState({answers});
    }

    toggleConfirmModal () {
        this.setState({modalVisible: !this.state.modalVisible});
    }

    isLastStep () {
        return this.state.activeStep === this.props.survey.get("questions").size - 1;
    }

    isSelectedAnswer (option) {
        return (
            this.state.answers[this.state.activeStep] ?
            option === this.state.answers[this.state.activeStep].answer :
            false
        );
    }

    onRatingPress (rating, activeStepQuestion) {
        this.setState({
            starCount: rating
        });
        this.setAnswer(activeStepQuestion.get("options").get(rating-1), activeStepQuestion.get("id"));
    }

    renderRate (activeStepQuestion) {
        const {width} = Dimensions.get("window");
        return (
            <View style={{width, paddingHorizontal: 80}}>
                <StarRating
                    disabled={false}
                    emptyStar={"ios-bulb"}
                    fullStar={"ios-bulb"}
                    iconSet={"Ionicons"}
                    maxStars={activeStepQuestion.get("options").length}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onRatingPress(rating, activeStepQuestion)}
                    starColor={"#ffcc00"}
                    starSize={60}
                />
            </View>
        );
    }

    renderAnswer (option, index, activeStepQuestion) {
        const {width} = Dimensions.get("window");
        return (
            <View key={index} style={styles.answerSurveyWrp}>
                <TouchableOpacity
                    onPress={() => this.setAnswer(option, activeStepQuestion.get("id"))}
                    style={[
                        styles.answerSurvey,
                        {width},
                        this.isSelectedAnswer(option) ? styles.activeAnswerSurvey : {}
                    ]}
                >
                    <Text style={[
                        styles.answer,
                        this.isSelectedAnswer(option) ? styles.activeAnswer : null
                    ]}>{option}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderQuestion (question) {
        const {width} = Dimensions.get("window");
        return (
            <Text style={[styles.questionSurvey, {width}]}>
                {question}
            </Text>
        );
    }

    renderConfirmButton () {
        return (
            <Button
                containerStyle={styles.buttonSave}
                disabled={this.state.answers.length - 1 < this.state.activeStep}
                onPress={this.isLastStep() ? ::this.onSaveAnswers : ::this.onForwardStep}
                style={styles.textButtonSave}
            >
                {this.isLastStep() ?  "SALVA" : "AVANTI"}
                <FaIcons color={colors.iconWhite} name={"angle-right"} size={18} style={styles.iconArrow} />
            </Button>
        );
    }

    renderSwitchAnswer (activeStepQuestion) {
        switch (activeStepQuestion.get("type")) {
            case SURVEY_RATE:
                return this.renderRate(activeStepQuestion);
            case SURVEY_SIGLE_CHOICE:
                return activeStepQuestion.get("options").map((option, index) =>
                    this.renderAnswer(option, index, activeStepQuestion)
                );
        }
    }

    renderContentSurvey () {
        const {height} = Dimensions.get("window");
        const activeStepQuestion = this.props.survey.getIn(["questions", this.state.activeStep]);
        return (
            <View style={styles.contentSurveyWrp}>
                <Stepper
                    activeStep={this.state.activeStep}
                    onPressDot={::this.setActiveStep}
                    steps={this.props.survey.get("questions").size || 0}
                />
                <View style={styles.questionSurveyWrp}>
                    {this.renderQuestion(activeStepQuestion.get("text"))}
                </View>
                <View style={styles.answerSurveyWrp}>
                {this.renderSwitchAnswer(activeStepQuestion)}
                </View>
                <View style={[styles.buttonSaveWrp, {height: height * 0.3}]}>
                    <TouchableOpacity
                        disabled={this.state.activeStep === 0}
                        onPress={::this.onBackwardStep}
                        style={styles.buttonBack}
                    >
                        <FaIcons color={colors.primaryBlue} name={"angle-left"} size={26} />
                    </TouchableOpacity>
                    {this.renderConfirmButton()}
                </View>
            </View>
        );
    }

    render () {
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"SURVEY"}</Text>
                        </View>
                    </View>
                    {this.renderContentSurvey()}
                </View>
                <ConfirmModal
                    onPressButton={Actions.home}
                    onRequestClose={::this.toggleConfirmModal}
                    textButton={"VAI ALL'APP"}
                    titleModal={"Grazie per aver compilato il questionario!"}
                    visible={this.state.modalVisible}
                />
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        userId: state.userId,
        sessionId: state.sessionId
    };
}

function mapDispatchToProps (dispatch) {
    return {
        saveSurveyAnswers: bindActionCreators(saveSurveyAnswers, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
