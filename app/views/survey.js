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
        fontSize: 16,
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
        color: colors.textDarkGrey
    },
    answer: {
        fontSize: 14,
        color: colors.textLightGrey,
        textAlign: "center"
    },

    ratingWrp: {
        alignItems: "stretch",
        paddingVertical: 10,
        paddingHorizontal: 45
    },
    buttonsWrp: {
        backgroundColor: colors.primaryBlue
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
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.ratingWrp, {width}]}>
                <StarRating
                    disabled={false}
                    emptyStar={"ios-bulb-outline"}
                    emptyStarColor={colors.rateStarColor}
                    fullStar={"ios-bulb"}
                    iconSet={"Ionicons"}
                    maxStars={activeStepQuestion.get("options").length}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onRatingPress(rating, activeStepQuestion)}
                    starColor={colors.rateStarColor}
                    starSize={40}
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
                    <Image source={require("../assets/img/spinner.gif")} style={[styles.spinner, {marginTop: height * .15}]}/>
                    <View style={styles.messageWrp}>
                        {this.renderQuestion("Salvataggio in corso, attendere prego.")}
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.contentSurveyWrp, {height: height * .85}]}>
                    <ScrollView
                        onContentSizeChange={::this.onContentSizeChange}
                        onScroll={::this.onScroll}
                        scrollEventThrottle={1000}
                    >
                        <View style={styles.questionSurveyWrp}>
                            {this.renderQuestion(activeStepQuestion.get("text"))}
                        </View>
                        <View style={styles.answerSurveyWrp}>
                        {this.renderSwitchAnswer(activeStepQuestion)}
                        </View>
                    </ScrollView>
                    <View style={[styles.buttonsWrp, {width, height: height * .15}]}>
                        {this.renderQuestionCounter()}
                    </View>
                </View>
                );
        }
    }

    render () {
        const activeStepQuestion = this.props.survey.getIn(["questions", this.state.activeStep]);
        return (
            <View style={styles.container}>
                <View style={{flex: 1}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"SURVEY"}</Text>
                        </View>
                    </View>
                    {this.renderContentSurvey(activeStepQuestion)}
                    <Scroll
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
        userId: state.userId
    };
}

function mapDispatchToProps (dispatch) {
    return {
        saveSurveyAnswers: bindActionCreators(saveSurveyAnswers, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
