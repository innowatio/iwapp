import {shallow} from "enzyme";
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
            />
        );
        expect(survey.find(TouchableOpacity)).to.have.length(4);
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

    // TODO: finish with method tests

});
