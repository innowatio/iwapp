import {shallow} from "enzyme";
import {TouchableOpacity, View} from "react-native";

import Stepper from "components/stepper";

describe("`Stepper` component", () => {

    it("renders the correct number of steps", () => {
        const steps = 5;
        const stepper = shallow(
            <Stepper steps={steps}/>
        );
        expect(stepper.find(TouchableOpacity)).to.have.length(steps);
        expect(stepper.find(View)).to.have.length(steps * 2);
    });

    it("renders the inactive button disabled", () => {
        const isActive = Stepper.prototype.isActive;
        const activeStep = 2;
        const instance = {
            props: {
                activeStep
            }
        };
        const steps = 5;
        const stepper = shallow(
            <Stepper
                activeStep={activeStep}
                onPressDot={() => null}
                steps={steps}
            />
        );
        stepper.find(TouchableOpacity).map((step, index) => {
            expect(step).prop("disabled").to.equal(!isActive.call(instance, index));
        });
    });

    it("renders the button disabled if `onPressDot` is not specified", () => {
        const activeStep = 2;
        const steps = 5;
        const stepper = shallow(
            <Stepper
                activeStep={activeStep}
                steps={steps}
            />
        );
        stepper.find(TouchableOpacity).map(step => {
            expect(step).prop("disabled").to.equal(true);
        });
    });

    it("calls the `onPressDot` function on press on dot with correct parameter", () => {
        const onPressDot = sinon.spy();
        const activeStep = 2;
        const steps = 5;
        const stepper = shallow(
            <Stepper
                activeStep={activeStep}
                onPressDot={onPressDot}
                steps={steps}
            />
        );
        stepper.find(TouchableOpacity).at(1).simulate("press");
        expect(onPressDot).to.have.callCount(1);
        expect(onPressDot).to.have.been.calledWith(1);
    });

    describe("`isActive` method", () => {

        const isActive = Stepper.prototype.isActive;

        it("returns `true` if step is active", () => {
            const activeStep = 3;
            const instance = {
                props: {
                    activeStep
                }
            };
            const active = isActive.call(instance, 2);
            expect(active).to.equal(true);
        });

        it("returns `false` if step is not active", () => {
            const activeStep = 3;
            const instance = {
                props: {
                    activeStep
                }
            };
            const active = isActive.call(instance, 4);
            expect(active).to.equal(false);
        });

    });

});
