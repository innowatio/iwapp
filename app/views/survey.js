import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, Modal, View, StyleSheet, TouchableOpacity} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import {connect} from "react-redux";
import FaIcons from "react-native-vector-icons/FontAwesome";
import initialSurvey from "../assets/json/survey/initial";

// import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import Stepper from "../components/stepper";

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
        padding: 25,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey
    },
    questionSurvey: {
        textAlign: "center"
    },
    answerSurvey: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey
    },
    answer: {
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
        marginLeft: 10
    }
});

class Survey extends Component {

    constructor (props) {
        super(props);
        this.state = {
            activeStep: 0,
            modalVisible: false
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

    setActiveStep (activeStep) {
        this.setState({activeStep});
    }

    toggleConfirmModal () {
        this.setState({modalVisible: !this.state.modalVisible});
    }

    isLastStep () {
        console.log(this.getSurvey().questions.length - 1);
        console.log(this.state.activeStep);
        return this.state.activeStep === this.getSurvey().questions.length - 1;
    }

    renderConfirmModal () {
        return (
            <Modal
                animationType={this.state.animationType}
                onRequestClose={() => this.toggleConfirmModal()}
                transparent={false}
                visible={this.state.modalVisible}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalTitleWrp}>
                        <Text style={styles.titleModal}>{" "}</Text>
                    </View>
                    <View>
                        <Button
                            containerStyle={styles.modalButton}
                            onPress={Actions.home}
                            style={styles.modalButtonText}
                        >
                            {"VAI ALL'APP"}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

    renderAnswer (option, index) {
        const {width} = Dimensions.get("window");
        return (
            <View key={index}>
                <View style={[styles.answerSurvey, {width}]}>
                    <TouchableOpacity>
                        <Text style={styles.answer}>{option}</Text>
                    </TouchableOpacity>
                </View>
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

    renderContentSurvey () {
        console.log(this.isLastStep());
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
                {activeStepQuestion.options.map(this.renderAnswer)}
                <View style={[styles.buttonSaveWrp, {height: height * 0.3}]}>
                    <TouchableOpacity
                        disabled={this.state.activeStep === 0}
                        onPress={::this.onBackwardStep}
                        style={[styles.buttonBack]}
                    >
                        <FaIcons color={colors.primaryBlue} name={"angle-left"} size={26} />
                    </TouchableOpacity>
                    <Button
                        containerStyle={[styles.buttonSave]}
                        onPress={this.isLastStep() ? ::this.toggleConfirmModal : ::this.onForwardStep}
                        style={styles.textButtonSave}
                    >
                        {this.isLastStep() ?  "SALVA" : "AVANTI"}
                        <FaIcons color={colors.iconWhite} name={"angle-right"} size={18} style={styles.iconArrow} />
                    </Button>
                </View>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height, paddingTop: 54}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"QUESTIONARIO"}</Text>
                        </View>
                    </View>
                    {this.renderContentSurvey()}
                </Content>
                {this.renderConfirmModal()}
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        home: state.home,
        site: state.site
    };
}
export default connect(mapStateToProps)(Survey);
