import {shallow} from "enzyme";
import {TouchableOpacity, View} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome";

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
        popTo: sinon.spy(),
        pop: sinon.spy()
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

    describe("default header", () => {

        it("renders 4 buttons", () => {
            const header = shallow(
                <Header
                    headerViews={[]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(TouchableOpacity)).to.have.length(4);
        });

        it("renders the buttons with correct props [CASE: first button]", () => {
            const header = shallow(
                <Header
                    headerViews={[]}
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
                    headerViews={[]}
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
                    headerViews={[]}
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
                    headerViews={[]}
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

        it("renders 3 icons", () => {
            const header = shallow(
                <Header
                    headerViews={[]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(Icon)).to.have.length(3);
        });

        it("renders the correct icons", () => {
            const header = shallow(
                <Header
                    headerViews={[]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(Icon).at(0).prop("name")).to.equal("iw-menu");
            expect(header.find(Icon).at(1).prop("name")).to.equal("iw-innowatio-logo");
            expect(header.find(Icon).at(2).prop("name")).to.equal("iw-alarm");
        });

    });

    describe("backArrow header", () => {

        it("renders 1 icon back button", () => {
            const header = shallow(
                <Header
                    headerViews={[{view: "view", header: "back-arrow"}]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(FaIcons)).to.have.length(1);
            expect(header.find(TouchableOpacity)).to.have.length(1);
        });

        it("on button press call navigator pop", () => {
            const header = shallow(
                <Header
                    headerViews={[{view: "view", header: "back-arrow"}]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(TouchableOpacity).at(0).prop("onPress")).to.be.a("function");
            header.find(TouchableOpacity).at(0).simulate("press");
            expect(Actions.pop).to.have.callCount(1);
        });

    });

    describe("empty header", () => {

        it("render no icons", () => {
            const header = shallow(
                <Header
                    headerViews={[{view: "view", header: "empty"}]}
                    onToggleHamburger={onToggleHamburger}
                    selectedView={selectedView}
                />
            );
            expect(header.find(View)).to.have.length(2);
            expect(header.find(Icon)).to.have.length(0);
        });

    });


});
