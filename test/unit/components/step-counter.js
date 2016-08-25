import {shallow} from "enzyme";
import {View} from "react-native";

import Button from "react-native-button";
import Text from "components/text-lato";
import StepCounter from "components/step-counter";
import FaIcons from "react-native-vector-icons/FontAwesome";

describe("`StepCounter` component", () => {

    it("renders the correct number of steps", () => {
        const steps = 2;
        const stepCounter = shallow(
            <StepCounter totalSteps={steps}/>
        );
        expect(stepCounter.find(Button)).to.have.length(steps);
        expect(stepCounter.find(View)).to.have.length(steps * 1);
    });

    it("renders the correct props if `disabledBackward` and `disabledForward` are not setted", () => {
        const steps = 2;
        const stepCounter = shallow(
            <StepCounter
                currentStep={2}
                totalSteps={steps}
            />
        );
        expect(stepCounter.find(Button)).to.have.length(2);
        expect(stepCounter.find(Button).filter({disabled: true})).to.have.length(0);
        expect(stepCounter.find(Button).filter({disabled: false})).to.have.length(0);
    });

    it("renders the correct props", () => {
        const steps = 1;
        const stepCounter = shallow(
            <StepCounter
                currentStep={2}
                disabledBackward={true}
                disabledForward={false}
                totalSteps={steps}
            />
        );
        expect(stepCounter.find(Button)).to.have.length(2);
        expect(stepCounter.find(Button).filter({disabled: true})).to.have.length(1);
        expect(stepCounter.find(Button).filter({disabled: true}).find(FaIcons).prop("name")).to.deep.equal("angle-left");
        expect(stepCounter.find(Button).filter({disabled: false})).to.have.length(1);
        expect(stepCounter.find(Button).filter({disabled: false}).find(FaIcons).prop("name")).to.deep.equal("angle-right");
    });
});

describe("`Buttons` render the correct icon", () => {
    it("button backward render icon `angle-left`", () => {
        const steps = 1;
        const stepCounter = shallow(
            <StepCounter
                currentStep={2}
                totalSteps={steps}
            />
        );
        expect(stepCounter.find(FaIcons)).to.have.length(2);
        expect(stepCounter.find(FaIcons).at(0).prop("name")).to.equal("angle-left");
    });

    it("button forward render icon `angle-right`", () => {
        const steps = 1;
        const stepCounter = shallow(
            <StepCounter
                currentStep={2}
                totalSteps={steps}
            />
        );
        expect(stepCounter.find(FaIcons)).to.have.length(2);
        expect(stepCounter.find(FaIcons).at(1).prop("name")).to.equal("angle-right");
    });

    it("button forward at last step render text `SALVA`", () => {
        const steps = 2;
        const stepCounter = shallow(
            <StepCounter
                currentStep={2}
                totalSteps={steps}
            />
        );
        expect(stepCounter.find(FaIcons)).to.have.length(1);
        expect(stepCounter.find(Text)).to.have.length(1);
    });

});
