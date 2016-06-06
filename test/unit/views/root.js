import {shallow} from "enzyme";
import {View} from "react-native";
import {DefaultRenderer} from "react-native-router-flux";

import Login from "views/login";
import Root from "views/root";
import Header from "components/header";

describe("`Root` view", () => {

    const asteroid = {};
    const onNavigate = sinon.spy();

    before(() => {
        Root.__Rewire__("asteroid", asteroid);
    });

    after(() => {
        Root.__ResetDependency__("asteroid");
    });

    afterEach(() => {
        onNavigate.reset();
    });

    const RootView = Root.__get__("Root");

    const navigationState = {
        children: [{
            sceneKey: "home"
        }]
    };

    it("renders a `View`", () => {
        const rootView = shallow(
            <RootView
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(View).length).to.be.at.least(1);
    });

    it("renders `Login` view if `userId` is not specified with the correct props", () => {
        const rootView = shallow(
            <RootView
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={null}
            />
        );
        expect(rootView.find(Login)).to.have.length(1);
        expect(rootView.find(Login).prop("asteroid")).to.equal(asteroid);
    });

    it("renders `Header` and `DefaultRenderer` view with the correct props if `userId` is specified", () => {
        const scene = {};
        RootView.prototype.getNavigationState = sinon.stub().returns(scene);
        const rootView = shallow(
            <RootView
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(DefaultRenderer)).to.have.length(1);
        expect(rootView.find(Header)).to.have.length(1);
        expect(rootView.find(DefaultRenderer).prop("navigationState")).to.equal(scene);
        expect(rootView.find(DefaultRenderer).prop("onNavigate")).to.equal(onNavigate);
    });

    describe("`getNavigationState` function", () => {

        const getNavigationState = RootView.prototype.getNavigationState;

        it("returns the selected scene", () => {
            const instance = {
                props: {
                    navigationState
                },
                getNavigationChildrenIndex: sinon.stub().returns(0)
            };
            const ret = getNavigationState.call(instance);
            expect(ret).to.deep.equal({
                sceneKey: "home"
            });
        });

    });

    describe("`getNavigationChildrenIndex` function", () => {

        const getNavigationChildrenIndex = RootView.prototype.getNavigationChildrenIndex;

        it("returns the index of the selected scene", () => {
            const instance = {
                props: {
                    navigationScene: ["view", "home"],
                    navigationState
                }
            };
            const ret = getNavigationChildrenIndex.call(instance);
            expect(ret).to.equal(0);
        });

    });

    describe("`componentDidMount` function", () => {

        const componentDidMount = RootView.prototype.componentDidMount;

        const asteroid = {
            on: sinon.spy()
        };

        before(() => {
            Root.__Rewire__("asteroid", asteroid);
        });

        after(() => {
            Root.__ResetDependency__("asteroid");
        });

        it("call `asteroid.on` with correct parameter", () => {
            const instance = {
                props: {
                    onLogin: sinon.spy(),
                    onLogout: sinon.spy()
                }
            };
            componentDidMount.call(instance);
            expect(asteroid.on).to.have.callCount(2);
            expect(asteroid.on.firstCall).to.have.been.calledWith("loggedIn", instance.props.onLogin);
            expect(asteroid.on.secondCall).to.have.been.calledWith("loggedOut", instance.props.onLogout);
        });

    });

    describe("`componentWillUnmount` function", () => {

        const componentWillUnmount = RootView.prototype.componentWillUnmount;

        const asteroid = {
            off: sinon.spy()
        };

        before(() => {
            Root.__Rewire__("asteroid", asteroid);
        });

        after(() => {
            Root.__ResetDependency__("asteroid");
        });

        it("call `asteroid.off` with correct parameter", () => {
            const instance = {
                props: {
                    onLogin: sinon.spy(),
                    onLogout: sinon.spy()
                }
            };
            componentWillUnmount.call(instance);
            expect(asteroid.off).to.have.callCount(2);
            expect(asteroid.off.firstCall).to.have.been.calledWith("loggedIn", instance.props.onLogin);
            expect(asteroid.off.secondCall).to.have.been.calledWith("loggedOut", instance.props.onLogout);
        });

    });

});
