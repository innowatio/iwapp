import moment from "moment";
import React, {Component, PropTypes} from "react";
import {Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import Button from "react-native-button";
import {connect} from "react-redux";
import FaIcons from "react-native-vector-icons/FontAwesome";
import initialSurvey from "../assets/json/survey/initial";
import {Actions} from "react-native-router-flux";
import {bindActionCreators} from "redux";

import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import Stepper from "../components/stepper";
import ConfirmModal from "../components/confirm-modal";
import {saveSurveyAnswers} from "../actions/survey";

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
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey
    },
    questionSurvey: {
        textAlign: "center",
        fontSize: 18,
        color: colors.textGrey
    },
    answerSurveyWrp: {
        borderBottomWidth: 1,
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
    }
});

class Survey extends Component {

    static propTypes = {
        saveSurveyAnswers: PropTypes.func.isRequired,
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

    getSurvey () {
        return initialSurvey;
    }

    onForwardStep () {
        this.setState({activeStep: this.state.activeStep + 1});
    }

    onBackwardStep () {
        this.setState({activeStep: this.state.activeStep - 1});
    }

    onSaveAnswers () {
        const survey = this.getSurvey();
        const surveyInfo = {
            type: survey.type,
            category: survey.category
        };
        const questions = this.getSurvey().questions.map(question => ({
            id: question.id,
            text: question.text
        }));
        this.props.saveSurveyAnswers(surveyInfo, this.state.answers, questions, this.props.userId);
        // TODO add open modal when post succeeded
        this.toggleConfirmModal();
    }

    setActiveStep (activeStep) {
        this.setState({activeStep});
    }

    setAnswer (answer, id) {
        // Clone the state
        var answers = this.state.answers.slice(0);
        answers[this.state.activeStep] = {
            answer,
            id,
            timestamp: moment().toISOString()
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
        return this.state.activeStep === this.getSurvey().questions.length - 1;
    }

    isSelectedAnswer (option) {
        return (
            this.state.answers[this.state.activeStep] ?
            option === this.state.answers[this.state.activeStep].answer :
            false
        );
    }

    renderAnswer (option, index, activeStepQuestion) {
        const {width} = Dimensions.get("window");
        return (
            <View key={index} style={styles.answerSurveyWrp}>
                <TouchableOpacity
                    onPress={() => this.setAnswer(option, activeStepQuestion.id)}
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
                containerStyle={[styles.buttonSave]}
                disabled={this.state.answers.length - 1 < this.state.activeStep}
                onPress={this.isLastStep() ? ::this.onSaveAnswers : ::this.onForwardStep}
                style={styles.textButtonSave}
            >
                {this.isLastStep() ?  "SALVA" : "AVANTI"}
                <FaIcons color={colors.iconWhite} name={"angle-right"} size={18} style={styles.iconArrow} />
            </Button>
        );
    }

    renderContentSurvey () {
        const {height} = Dimensions.get("window");
        const activeStepQuestion = this.getSurvey().questions[this.state.activeStep];
        return (
            <View style={styles.contentSurveyWrp}>
                <Stepper
                    activeStep={this.state.activeStep}
                    onPressDot={::this.setActiveStep}
                    steps={this.getSurvey().questions.length || 0}
                />
                <View style={styles.questionSurveyWrp}>
                    {this.renderQuestion(activeStepQuestion.text)}
                </View>
                <View style={styles.answerSurveyWrp}>
                    {
                        activeStepQuestion.options.map((option, index) =>
                            this.renderAnswer(option, index, activeStepQuestion)
                        )
                    }
                </View>
                <View style={[styles.buttonSaveWrp, {height: height * 0.3}]}>
                    <TouchableOpacity
                        disabled={this.state.activeStep === 0}
                        onPress={::this.onBackwardStep}
                        style={[styles.buttonBack]}
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
                            <Text style={styles.title}>{"QUESTIONARIO"}</Text>
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
        userId: state.userId
    };
}
function mapDispatchToProps (dispatch) {
    return {
        saveSurveyAnswers: bindActionCreators(saveSurveyAnswers, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Survey);
