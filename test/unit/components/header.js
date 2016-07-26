import {shallow} from "enzyme";
import {TouchableOpacity} from "react-native";

import Header from "components/header";
import Icon from "components/iwapp-icons";

describe("`Header` component", () => {

    const onToggleHamburger = sinon.spy();
    const selectedView = ["view"];
    const getNavigationType = sinon.stub().returns({type: "RESET"});
    const Actions = {
        home: sinon.spy(),
        notifications: sinon.spy(),
        profile: sinon.spy(),
        popTo: sinon.spy()
    };

    before(() => {
        Header.__Rewire__("Actions", Actions);
        Header.__Rewire__("getNavigationType", getNavigationType);
    });

    after(() => {
        Header.__ResetDependency__("Actions");
        Header.__ResetDependency__("getNavigationType");
    });

    beforeEach(() => {
        getNavigationType.reset();
        onToggleHamburger.reset();
        getNavigationType.reset();
        Actions.home.reset();
        Actions.notifications.reset();
        Actions.profile.reset();
        Actions.popTo.reset();
    });

    it("renders 4 buttons", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(TouchableOpacity)).to.have.length(4);
    });

    it("renders the buttons with correct props [CASE: first button]", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(TouchableOpacity).at(0).prop("onPress")).to.equal(onToggleHamburger);
        header.find(TouchableOpacity).at(0).simulate("press");
        expect(onToggleHamburger).to.have.callCount(1);
    });

    it("renders the buttons with correct props [CASE: second button]", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(TouchableOpacity).at(1).prop("onPress")).to.be.a("function");
        header.find(TouchableOpacity).at(1).simulate("press");
        expect(Actions.home).to.have.callCount(1);
    });

    it("renders the buttons with correct props [CASE: third button]", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(TouchableOpacity).at(2).prop("onPress")).to.be.a("function");
        header.find(TouchableOpacity).at(2).simulate("press");
        expect(Actions.notifications).to.have.callCount(1);
        expect(getNavigationType).to.have.callCount(1);
        expect(getNavigationType).to.have.been.calledWithExactly(selectedView);
        expect(Actions.notifications).to.have.been.calledWithExactly({type: "RESET"});
    });

    it("renders the buttons with correct props [CASE: fourth button]", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(TouchableOpacity).at(3).prop("onPress")).to.be.a("function");
        header.find(TouchableOpacity).at(3).simulate("press");
        expect(Actions.profile).to.have.callCount(1);
        expect(getNavigationType).to.have.callCount(1);
        expect(getNavigationType).to.have.been.calledWithExactly(selectedView);
        expect(Actions.profile).to.have.been.calledWithExactly({type: "RESET"});
    });

    it("renders 4 icons", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(Icon)).to.have.length(4);
    });

    it("renders the correct icons", () => {
        const header = shallow(
            <Header
                onToggleHamburger={onToggleHamburger}
                selectedView={selectedView}
            />
        );
        expect(header.find(Icon).at(0).prop("name")).to.equal("iw-menu");
        expect(header.find(Icon).at(1).prop("name")).to.equal("iw-innowatio-logo");
        expect(header.find(Icon).at(2).prop("name")).to.equal("iw-alarm");
        expect(header.find(Icon).at(3).prop("name")).to.equal("iw-user");
    });

});
