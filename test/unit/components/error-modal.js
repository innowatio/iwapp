import {shallow} from "enzyme";
import {Modal} from "react-native";
import Button from "react-native-button";

import ErrorModal from "components/error-modal";

describe("`ErrorModal` component", () => {

    const onRequestClose = sinon.spy();
    const onPressButton = sinon.spy();
    const visible = true;

    beforeEach(() => {
        onRequestClose.reset();
        onPressButton.reset();
    });

    it("renders a `Modal` with correct props", () => {
        const errorModal = shallow(
            <ErrorModal
                onPressButton={onPressButton}
                onRequestClose={onRequestClose}
                visible={visible}
            />
        );
        expect(errorModal.find(Modal)).to.have.length(1);
        expect(errorModal.prop("onRequestClose")).to.deep.equal(onRequestClose);
        expect(errorModal.prop("transparent")).to.deep.equal(false);
        expect(errorModal.prop("visible")).to.deep.equal(visible);
    });

    it("calls `onPressButton` function on `Button` press", () => {
        const errorModal = shallow(
            <ErrorModal
                onPressButton={onPressButton}
                onRequestClose={onRequestClose}
                visible={visible}
            />
        );
        expect(errorModal.find(Button)).to.have.length(1);
        errorModal.find(Button).simulate("press");
        expect(onPressButton).to.have.callCount(1);
    });

});
