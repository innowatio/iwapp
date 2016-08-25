import {shallow} from "enzyme";
import {fromJS} from "immutable";

import Survey from "views/survey";
import ConfirmModal from "components/confirm-modal";
import StepCounter from "components/step-counter";

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

    it("renders `StepCounter` with correct props", () => {
        const survey = shallow(
            <SurveyView
                saveSurveyAnswers={saveSurveyAnswers}
                survey={questionsSurvey}
            />
        );
        expect(survey.find(StepCounter)).to.have.length(1);
        survey.setState({activeStep: 1});
        expect(survey.find(StepCounter).prop("currentStep")).to.deep.equal(2);
        expect(survey.find(StepCounter).prop("disabledBackward")).to.deep.equal(false);
        expect(survey.find(StepCounter).prop("disabledForward")).to.deep.equal(true);
        expect(survey.find(StepCounter).prop("totalSteps")).to.deep.equal(5);
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

    // describe("`setActiveStep` method", () => {
    //
    //     const setActiveStep = SurveyView.prototype.setActiveStep;
    //
    //     it("adds 1 to activeStep state", () => {
    //         const setState = sinon.spy();
    //         const instance = {setState};
    //         setActiveStep.call(instance, 2);
    //         expect(setState).to.have.callCount(1);
    //         expect(setState).to.have.been.calledWith({activeStep: 2});
    //     });
    //
    // });

    describe("`disabledForward` method", () => {

        const disabledForward = SurveyView.prototype.disabledForward;

        it("returns true if the actual answer is not set", () => {
            const instance = {
                state: {
                    answers: [],
                    activeStep: 0
                }
            };
            disabledForward.call(instance);
            expect(disabledForward.call(instance)).to.equal(true);
        });

        it("returns false if the actual answer is set", () => {
            const instance = {
                state: {
                    answers: ["answer number 0"],
                    activeStep: 0
                }
            };
            disabledForward.call(instance);
            expect(disabledForward.call(instance)).to.equal(false);
        });

        it("returns false if the actual answer is set", () => {
            const instance = {
                state: {
                    answers: ["answer0", "answer1", "answer2", "answer3"],
                    activeStep: 1
                }
            };
            disabledForward.call(instance);
            expect(disabledForward.call(instance)).to.equal(false);
        });

        it("returns true if `activeStep` is grater than number of answers", () => {
            const instance = {
                state: {
                    answers: ["answer0", "answer1", "answer2", "answer3"],
                    activeStep: 9
                }
            };
            disabledForward.call(instance);
            expect(disabledForward.call(instance)).to.equal(true);
        });
    });

    describe("`onSaveAnswers` method", () => {

        const onSaveAnswers = SurveyView.prototype.onSaveAnswers;

        it("call the action for the post", () => {
            const toggleConfirmModal = sinon.spy();
            const saveSurveyAnswers = sinon.spy();
            const instance = {
                toggleConfirmModal,
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
            expect(toggleConfirmModal).to.have.callCount(1);
            expect(saveSurveyAnswers).to.have.been.calledWithExactly({
                questionId: "surveyId",
                type: "type",
                category: "category"
            }, ["1", "2", "3", "4", "5"], "userId", "sessionId");
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
