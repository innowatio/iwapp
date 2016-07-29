import {shallow} from "enzyme";
import {Modal} from "react-native";
import Button from "react-native-button";

import ConfirmModal from "components/confirm-modal";

describe("`ConfirmModal` component", () => {

    const onRequestClose = sinon.spy();
    const onPressButton = sinon.spy();
    const visible = true;

    beforeEach(() => {
        onRequestClose.reset();
        onPressButton.reset();
    });

    it("renders a `Modal` with correct props", () => {
        const confirmModal = shallow(
            <ConfirmModal
                onPressButton={onPressButton}
                onRequestClose={onRequestClose}
                visible={visible}
            />
        );
        expect(confirmModal.find(Modal)).to.have.length(1);
        expect(confirmModal.prop("onRequestClose")).to.deep.equal(onRequestClose);
        expect(confirmModal.prop("transparent")).to.deep.equal(false);
        expect(confirmModal.prop("visible")).to.deep.equal(visible);
    });

    it("calls `onPressButton` function on `Button` press", () => {
        const confirmModal = shallow(
            <ConfirmModal
                onPressButton={onPressButton}
                onRequestClose={onRequestClose}
                visible={visible}
            />
        );
        expect(confirmModal.find(Button)).to.have.length(1);
        confirmModal.find(Button).simulate("press");
        expect(onPressButton).to.have.callCount(1);
    });

});
