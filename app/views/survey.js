import moment from "moment";
import {last, isNil} from "ramda";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, View, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import {connect} from "react-redux";
import {Actions} from "react-native-router-flux";
import {bindActionCreators} from "redux";
import StarRating from "react-native-star-rating";

import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import {heightWithoutHeader} from "../lib/const";
import ConfirmModal from "../components/confirm-modal";
import ErrorModal from "../components/error-modal";
import StepCounter from "../components/step-counter";
import {saveSurveyAnswers} from "../actions/survey";
import {SURVEY_RATE, SURVEY_SIGLE_CHOICE} from "../actions/survey";
import Scroll from "../components/scroll";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: colors.white,
        flexDirection: "row"
    },
    titleBarWrp: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.secondaryBlue
    },
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        fontWeight: "bold",
        fontSize: 12,
        color: colors.white
    },
    // CONTENT
    contentSurveyWrp: {
        alignItems: "center"
    },
    questionSurveyWrp: {
        alignItems: "center",
        borderBottomWidth: .5,
        borderBottomColor: colors.lightGrey
    },
    questionSurvey: {
        textAlign: "center",
        fontSize: 14,
        color: colors.primaryBlue
    },
    answerSurveyWrp: {
        borderBottomWidth: .5,
        borderBottomColor: colors.lightGrey
    },
    answerSurvey: {
        alignItems: "center",
        justifyContent: "center"
    },
    activeAnswerSurvey: {
        backgroundColor: colors.selectedAnswer,
    },
    activeAnswer: {
        color: colors.textDarkGrey
    },
    answer: {
        fontSize: 14,
        color: colors.textLightGrey,
        textAlign: "center"
    },

    ratingWrp: {
        alignItems: "stretch"
    },
    buttonsWrp: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryBlue,
        position: "absolute",
        bottom: 0
    },

    //SAVE spinner
    errorPageWrp: {
        alignItems: "center",
        justifyContent: "center"
    },
    spinner: {
        width: 88,
        height: 88,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
    },
    messageWrp: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        justifyContent: "center",
        alignItems: "center"
    }
});

class Survey extends Component {

    static propTypes = {
        error: PropTypes.bool,
        errorMessage: PropTypes.object,
        fetch: PropTypes.bool,
        saveSurveyAnswers: PropTypes.func.isRequired,
        sessionId: PropTypes.string,
        survey: IPropTypes.map.isRequired,
        userId: PropTypes.string
    }

    static defaultProps = {
        error: false
    }

    constructor (props) {
        super(props);
        this.state = {
            beforeScroll: true,
            activeStep: 0,
            modalVisible: false,
            toScroll: false,
            answers: [],
            questions: []
        };
    }

    componentWillReceiveProps (nextProps) {
        if (!nextProps.error) {
            if (!nextProps.fetch && !isNil(nextProps.fetch)) {
                this.toggleConfirmModal();
            }
        }
    }

    getTotalSteps () {
        return this.props.survey.get("questions").size || 0;
    }

    disabledBackward () {
        return this.state.activeStep < 1;
    }

    disabledForward () {
        return this.state.answers.length <= this.state.activeStep;
    }

    onForwardStep () {
        this.setState({
            activeStep: this.state.activeStep + 1,
            beforeScroll: true
        });
    }

    onBackwardStep () {
        this.setState({
            activeStep: this.state.activeStep - 1,
            beforeScroll: true
        });
    }

    onSaveAnswers () {
        const {survey} = this.props;

        const surveyInfo = {
            questionId: survey.get("_id"),
            type: survey.get("type"),
            category: survey.get("category"),
        };

        this.props.saveSurveyAnswers(
            surveyInfo,
            this.state.answers,
            this.props.userId,
            this.props.sessionId
        );

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
        this.setState({
            answers,
            beforeScroll: true
        });
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

    indexSelectedAnswer (activeStepQuestion) {
        return (this.state.answers[this.state.activeStep] ?
            activeStepQuestion.get("options").indexOf(this.state.answers[this.state.activeStep].answer)+1 :
            0
        );
    }

    onContentSizeChange (contentWidth, contentHeight) {
        const {height} = Dimensions.get("window");
        // FIXME: to search the exact height when to scroll
        this.setState({toScroll: (heightWithoutHeader(height) * 80 / 100) < contentHeight});
    }

    onScroll () {
        if (this.state.beforeScroll) {
            this.setState({beforeScroll: false});
        }
    }

    onRatingPress (rating, activeStepQuestion) {
        this.setState({
            starCount: rating
        });
        this.setAnswer(activeStepQuestion.get("options").get(rating-1), activeStepQuestion.get("id"));
    }

    renderRate (activeStepQuestion) {
        const numberOfStart = activeStepQuestion.get("options").size;
        const {width, height} = Dimensions.get("window");
        return (
            <View
                key={activeStepQuestion.get("id")}
                style={[styles.ratingWrp, {width, paddingHorizontal: width * .15, paddingVertical: height * .02}]}
            >
                <StarRating
                    disabled={false}
                    emptyStar={"ios-bulb-outline"}
                    emptyStarColor={colors.rateStarColor}
                    fullStar={"ios-bulb"}
                    iconSet={"Ionicons"}
                    maxStars={numberOfStart}
                    rating={this.indexSelectedAnswer(activeStepQuestion)}
                    selectedStar={(rating) => this.onRatingPress(rating, activeStepQuestion)}
                    starColor={colors.rateStarColor}
                    starSize={height * .06}
                />
            </View>
        );
    }

    renderAnswer (option, index, activeStepQuestion) {
        const {width, height} = Dimensions.get("window");
        return (
            <View key={index} style={styles.answerSurveyWrp}>
                <TouchableOpacity
                    onPress={() => this.setAnswer(option, activeStepQuestion.get("id"))}
                    style={[
                        styles.answerSurvey,
                        {width, paddingVertical: height * .035},
                        this.isSelectedAnswer(option) ? styles.activeAnswerSurvey : {}
                    ]}
                >
                    <View>
                        <Text style={[styles.answer, this.isSelectedAnswer(option) ? styles.activeAnswer : null]}>
                            {option}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    renderQuestion (question) {
        return (
            <Text style={styles.questionSurvey}>
                {question}
            </Text>
        );
    }

    renderQuestionCounter () {
        return (
            <StepCounter
                currentStep={this.state.activeStep + 1}
                disabledBackward={this.disabledBackward()}
                disabledForward={this.disabledForward()}
                onBackwardStep={::this.onBackwardStep}
                onForwardStep={::this.onForwardStep}
                onSaveAnswers={::this.onSaveAnswers}
                totalSteps={this.getTotalSteps()}
            />
        );
    }

    renderSwitchAnswer (activeStepQuestion) {
        switch (activeStepQuestion.get("type")) {
            case SURVEY_RATE:
                return this.renderRate(activeStepQuestion);
            case SURVEY_SIGLE_CHOICE:
            default:
                return activeStepQuestion.get("options").map((option, index) =>
                    this.renderAnswer(option, index, activeStepQuestion)
                );
        }
    }

    renderContentSurvey (activeStepQuestion) {
        const {height, width} = Dimensions.get("window");
        if (this.props.fetch) {
            return (
                <View style={[styles.errorPageWrp, {height: height * .6}]}>
                    <Image
                        source={require("../assets/img/spinner.gif")}
                        style={[styles.spinner, {marginTop: height * .15}]}
                    />
                    <View style={styles.messageWrp}>
                        {this.renderQuestion("Salvataggio in corso, attendere prego.")}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.contentSurveyWrp, {height: heightWithoutHeader(height)}]}>
                    <View style={{height: height * .73}}>
                        <ScrollView
                            onContentSizeChange={::this.onContentSizeChange}
                            onScroll={::this.onScroll}
                            scrollEventThrottle={1000}
                        >
                            <View style={[styles.questionSurveyWrp, {width, padding: height * .04}]}>
                                {this.renderQuestion(activeStepQuestion.get("text"))}
                            </View>
                            <View style={styles.answerSurveyWrp}>
                                {this.renderSwitchAnswer(activeStepQuestion)}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={[styles.buttonsWrp, {width, height: height * .1}]}>
                        {this.renderQuestionCounter()}
                    </View>
                </View>
            );
        }
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const activeStepQuestion = this.props.survey.getIn(["questions", this.state.activeStep]);
        return (
            <View style={[styles.container]}>
                <View style={{width}}>
                    <View style={[styles.titleBarWrp, {height: height * .045}]}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"SURVEY"}</Text>
                        </View>
                    </View>
                    {this.renderContentSurvey(activeStepQuestion)}
                    <Scroll
                        style={{margin: height * .02, top: height * .67, alignItems: "flex-end"}}
                        visible={this.state.toScroll && this.state.beforeScroll}
                    />
                </View>
                <ConfirmModal
                    onPressButton={Actions.home}
                    onRequestClose={::this.toggleConfirmModal}
                    textButton={"VAI ALL'APP"}
                    titleModal={"Grazie per aver compilato il survey!"}
                    visible={this.state.modalVisible}
                />
                <ErrorModal
                    onPressButton={::this.onSaveAnswers}
                    textButton={"RIPROVA"}
                    titleModal={"Ops! Si è verificato un errore nel salvataggio"}
                    visible={this.props.error}
                />
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        error: last(state.survey).error,
        errorMessage: last(state.survey).errorMessage,
        fetch: last(state.survey).fetch,
        sessionId: state.sessionId,
        userId: state.user.userId
    };
}

function mapDispatchToProps (dispatch) {
    return {
        saveSurveyAnswers: bindActionCreators(saveSurveyAnswers, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
