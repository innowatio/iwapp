import {shallow} from "enzyme";
import {fromJS} from "immutable";
import {TouchableOpacity} from "react-native";
import Button from "react-native-button";

import Survey from "views/survey";
import ConfirmModal from "components/confirm-modal";
import Stepper from "components/stepper";

describe("`Survey` view", () => {

    const SurveyView = Survey.__get__("Survey");

    const saveSurveyAnswers = sinon.spy();
    const Actions = {
        home: sinon.spy()
    };
    const questionsSurvey = fromJS({
        _id: "surveyId",
        type: "type",
        category: "category",
        questions: [{
            id: 1,
            category: "category",
            text: "Question 1",
            type: "singleChoice",
            options: ["answer1", "answer2", "answer3", "answer4"]
        }, {
            id: 2,
            category: "category",
            text: "Question 2",
            type: "singleChoice",
            options: ["answer1", "answer2", "answer3", "answer4"]
        }, {
            id: 3,
            category: "category",
            text: "Question 3",
            type: "singleChoice",
            options: ["answer1", "answer2", "answer3", "answer4"]
        }, {
            id: 4,
            category: "category",
            text: "Question 4",
            type: "singleChoice",
            options: ["answer1", "answer2", "answer3", "answer4"]
        }, {
            id: 5,
            category: "category",
            text: "Question 5",
            type: "singleChoice",
            options: ["answer1", "answer2", "answer3", "answer4"]
        }]
    });

    before(() => {
        Survey.__Rewire__("Actions", Actions);
    });

    beforeEach(() => {
        saveSurveyAnswers.reset();
    });

    after(() => {
        Survey.__ResetDependency__("Actions");
    });

    it("renders `ConfirmModal` with correct props", () => {
        const survey = shallow(
            <SurveyView
                saveSurveyAnswers={saveSurveyAnswers}
                survey={questionsSurvey}
            />
        );
        expect(survey.find(ConfirmModal)).to.have.length(1);
        expect(survey.find(ConfirmModal).prop("onPressButton")).to.deep.equal(Actions.home);
        survey.setState({modalVisible: true});
        expect(survey.find(ConfirmModal).prop("visible")).to.deep.equal(true);
        survey.setState({modalVisible: false});
        expect(survey.find(ConfirmModal).prop("visible")).to.deep.equal(false);
    });

    it("renders `Stepper` with correct props", () => {
        const survey = shallow(
            <SurveyView
                saveSurveyAnswers={saveSurveyAnswers}
                survey={questionsSurvey}
            />
        );
        expect(survey.find(Stepper)).to.have.length(1);
        survey.setState({activeStep: 2});
        expect(survey.find(Stepper).prop("activeStep")).to.deep.equal(2);
    });

    it("renders confirm button disabled if answers length is less than activeStep", () => {
        const survey = shallow(
            <SurveyView
                saveSurveyAnswers={saveSurveyAnswers}
                survey={questionsSurvey}
            />
        );
        expect(survey.find(Button)).to.have.length(1);
        survey.setState({answers: [1, 2, 3, 4], activeStep: 3});
        expect(survey.find(Button).prop("disabled")).to.equal(false);
        survey.setState({answers: [1, 2, 3, 4], activeStep: 4});
        expect(survey.find(Button).prop("disabled")).to.equal(true);
    });

    it("renders the correct number of TouchableOpacity", () => {
        const survey = shallow(
            <SurveyView
                saveSurveyAnswers={saveSurveyAnswers}
                survey={questionsSurvey}
            />
        );
        expect(survey.find(TouchableOpacity)).to.have.length(5);
    });

    describe("`onForwardStep` method", () => {

        const onForwardStep = SurveyView.prototype.onForwardStep;

        it("adds 1 to activeStep state", () => {
            const setState = sinon.spy();
            const instance = {
                state: {
                    activeStep: 1
                },
                setState
            };
            onForwardStep.call(instance);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWith({activeStep: 2});
        });

    });

    describe("`onBackwardStep` method", () => {

        const onBackwardStep = SurveyView.prototype.onBackwardStep;

        it("adds 1 to activeStep state", () => {
            const setState = sinon.spy();
            const instance = {
                state: {
                    activeStep: 1
                },
                setState
            };
            onBackwardStep.call(instance);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWith({activeStep: 0});
        });

    });

    describe("`setActiveStep` method", () => {

        const setActiveStep = SurveyView.prototype.setActiveStep;

        it("adds 1 to activeStep state", () => {
            const setState = sinon.spy();
            const instance = {setState};
            setActiveStep.call(instance, 2);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWith({activeStep: 2});
        });

    });

    describe("`onSaveAnswers` method", () => {

        const onSaveAnswers = SurveyView.prototype.onSaveAnswers;

        it("call the action for the post", () => {
            const saveSurveyAnswers = sinon.spy();
            const instance = {
                props: {
                    saveSurveyAnswers,
                    survey: questionsSurvey,
                    userId: "userId",
                    sessionId: "sessionId"
                },
                state: {
                    answers: ["1", "2", "3", "4", "5"]
                }
            };
            onSaveAnswers.call(instance);
            expect(saveSurveyAnswers).to.have.callCount(1);
            expect(saveSurveyAnswers).to.have.been.calledWithExactly({
                questionId: "surveyId",
                type: "type",
                category: "category"
            }, ["1", "2", "3", "4", "5"], "userId", "sessionId");
        });

    });

    describe("`componentWillReceiveProps` method", () => {

        const componentWillReceiveProps = SurveyView.prototype.componentWillReceiveProps;

        it("don't call toggleConfirmModal because fetch is true [CASE: error is true]", () => {
            const toggleConfirmModal = sinon.spy();
            const instance = {toggleConfirmModal};
            const nextProps = {
                error: true,
                fetch: true
            };
            componentWillReceiveProps.call(instance, nextProps);
            expect(toggleConfirmModal).to.have.callCount(0);
        });

        it("don't call toggleConfirmModal because fetch is true [CASE: error is false]", () => {
            const toggleConfirmModal = sinon.spy();
            const instance = {toggleConfirmModal};
            const nextProps = {
                error: false,
                fetch: true
            };
            componentWillReceiveProps.call(instance, nextProps);
            expect(toggleConfirmModal).to.have.callCount(0);
        });

        it("call toggleConfirmModal because fetch is false [CASE: error is false]", () => {
            const toggleConfirmModal = sinon.spy();
            const instance = {toggleConfirmModal};
            const nextProps = {
                error: false,
                fetch: false
            };
            componentWillReceiveProps.call(instance, nextProps);
            expect(toggleConfirmModal).to.have.callCount(1);
        });

        it("don't call toggleConfirmModal because fetch is undefined", () => {
            const toggleConfirmModal = sinon.spy();
            const instance = {toggleConfirmModal};
            const nextProps = {};
            componentWillReceiveProps.call(instance, nextProps);
            expect(toggleConfirmModal).to.have.callCount(0);
        });
    });

    describe("`setAnswer` method", () => {

        var clock;

        before(() => {
            clock = sinon.useFakeTimers();
        });

        after(() => {
            clock.restore();
        });

        const setAnswer = SurveyView.prototype.setAnswer;

        const answer = "3";

        const expectedAnswers = [{
            answer: "1"
        }, {
            answer: "2"
        }, {
            answer: "3",
            id: 3,
            timestamp: "1970-01-01T00:00:00.000Z",
            question: {
                text: "Question 3",
                category: "category"
            }
        }];

        it("set the answer correctly in the state [CASE: last step]", () => {
            const setState = sinon.spy();
            const isLastStep = sinon.stub().returns(true);
            const instance = {
                setState,
                isLastStep,
                props: {
                    survey: questionsSurvey
                },
                state: {
                    answers: [{
                        answer: "1"
                    }, {
                        answer: "2"
                    }],
                    activeStep: 2
                }
            };
            setAnswer.call(instance, answer, 3);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWithExactly({answers: expectedAnswers});
        });

        it("set the answer correctly in the state [CASE: not the last step]", () => {
            const setState = sinon.spy();
            const isLastStep = sinon.stub().returns(false);
            const onForwardStep = sinon.spy();
            const instance = {
                setState,
                isLastStep,
                props: {
                    survey: questionsSurvey
                },
                onForwardStep,
                state: {
                    answers: [{
                        answer: "1"
                    }, {
                        answer: "2"
                    }],
                    activeStep: 2
                }
            };
            setAnswer.call(instance, answer, 3);
            expect(setState).to.have.callCount(1);
            expect(onForwardStep).to.have.callCount(1);
            expect(setState).to.have.been.calledWithExactly({answers: expectedAnswers});
        });

    });

    describe("`isLastStep` method", () => {

        const isLastStep = SurveyView.prototype.isLastStep;

        it("return true if current step is the last", () => {
            const instance = {
                props: {
                    survey: questionsSurvey
                },
                state: {
                    activeStep: 4
                }
            };
            const ret = isLastStep.call(instance);
            expect(ret).to.equal(true);
        });

        it("return true if current step is the last", () => {
            const instance = {
                props: {
                    survey: questionsSurvey
                },
                state: {
                    activeStep: 2
                }
            };
            const ret = isLastStep.call(instance);
            expect(ret).to.equal(false);
        });

    });

    describe("`toggleConfirmModal` method", () => {

        const toggleConfirmModal = SurveyView.prototype.toggleConfirmModal;

        it("toggle the confirmation modal [CASE: {modalVisible: true}]", () => {
            const setState = sinon.spy();
            const instance = {
                setState,
                state: {
                    modalVisible: true
                }
            };
            toggleConfirmModal.call(instance);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWithExactly({
                modalVisible: false
            });
        });

        it("toggle the confirmation modal [CASE: {modalVisible: false}]", () => {
            const setState = sinon.spy();
            const instance = {
                setState,
                state: {
                    modalVisible: false
                }
            };
            toggleConfirmModal.call(instance);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.been.calledWithExactly({
                modalVisible: true
            });
        });

    });

    describe("`isSelectedAnswer` method", () => {

        const isSelectedAnswer = SurveyView.prototype.isSelectedAnswer;

        it("return false if the answers in activeStep is undefined", () => {
            const instance = {
                state: {
                    activeStep: 2,
                    answers: [{
                        id: 1
                    }, {
                        id: 2,
                        answer: "second answer"
                    }]
                }
            };
            const ret = isSelectedAnswer.call(instance);
            expect(ret).to.equal(false);
        });

        it("return false if the answer is different from passed option", () => {
            const instance = {
                state: {
                    activeStep: 1,
                    answers: [{
                        id: 1
                    }, {
                        id: 2,
                        answer: "second answer"
                    }]
                }
            };
            const ret = isSelectedAnswer.call(instance, "not answer");
            expect(ret).to.equal(false);
        });

        it("return true if the answer is equal to passed option", () => {
            const instance = {
                state: {
                    activeStep: 1,
                    answers: [{
                        id: 1
                    }, {
                        id: 2,
                        answer: "second answer"
                    }]
                }
            };
            const ret = isSelectedAnswer.call(instance, "second answer");
            expect(ret).to.equal(true);
        });

    });

});
