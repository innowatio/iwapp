import {resolve} from "bluebird";
import {shallow} from "enzyme";
import {ScrollView, StatusBar} from "react-native";
import Drawer from "react-native-drawer";
import {DefaultRenderer} from "react-native-router-flux";
import {Map} from "immutable";

import Login from "views/login";
import Root from "views/root";
import Header from "components/header";

describe("`Root` view", () => {

    const asteroid = {};
    const onNavigate = sinon.spy();
    const secondaryBlue = "secondaryBlue";

    before(() => {
        Root.__Rewire__("asteroid", asteroid);
        Root.__Rewire__("secondaryBlue", secondaryBlue);
    });

    after(() => {
        Root.__ResetDependency__("asteroid");
        Root.__ResetDependency__("secondaryBlue");
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

    it("renders a `ScrollView` with correct props", () => {
        const rootView = shallow(
            <RootView
                collections={Map()}
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(ScrollView).length).to.equal(1);
        expect(rootView.find(ScrollView).prop("alwaysBounceVertical")).to.equal(false);
        expect(rootView.find(ScrollView).prop("automaticallyAdjustContentInsets")).to.equal(true);
        expect(rootView.find(ScrollView).prop("keyboardShouldPersistTaps")).to.equal(true);
    });

    it("renders a `StatusBar` with correct props", () => {
        const rootView = shallow(
            <RootView
                collections={Map()}
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(StatusBar).length).to.equal(1);
        expect(rootView.find(StatusBar).props()).to.deep.equal({
            backgroundColor: "secondaryBlue",
            barStyle: "light-content"
        });
    });

    it("renders `Login` view if `userId` is not specified with the correct props", () => {
        const rootView = shallow(
            <RootView
                collections={Map()}
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
                collections={Map()}
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

    it("renders `Drawer` disabled [CASE: `isDrawerDisabled` returns true]", () => {
        RootView.prototype.isDrawerDisabled = sinon.stub().returns(true);
        const rootView = shallow(
            <RootView
                collections={Map()}
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(Drawer).prop("disabled")).to.equal(true);
    });

    it("renders `Drawer` not disabled [CASE: `isDrawerDisabled` returns undefined]", () => {
        RootView.prototype.isDrawerDisabled = sinon.stub().returns();
        const rootView = shallow(
            <RootView
                collections={Map()}
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(Drawer).prop("disabled")).to.equal(false);
    });

    it("renders `Drawer` not disabled [CASE: `isDrawerDisabled` returns false]", () => {
        RootView.prototype.isDrawerDisabled = sinon.stub().returns(false);
        const rootView = shallow(
            <RootView
                collections={Map()}
                navigationScene={["home"]}
                navigationState={navigationState}
                onLogin={sinon.spy()}
                onLogout={sinon.spy()}
                onNavigate={onNavigate}
                userId={"userId"}
            />
        );
        expect(rootView.find(Drawer).prop("disabled")).to.equal(false);
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
            on: sinon.spy(),
            subscribe: sinon.spy(),
            ddp: {
                on: sinon.spy()
            }
        };

        before(() => {
            Root.__Rewire__("asteroid", asteroid);
        });

        beforeEach(() => {
            asteroid.subscribe.reset();
            asteroid.on.reset();
            asteroid.ddp.on.reset();
        });

        after(() => {
            Root.__ResetDependency__("asteroid");
        });

        it("call `asteroid.on` with correct parameter", () => {
            const instance = {
                postLogin: sinon.spy(),
                props: {
                    onLogout: sinon.spy()
                },
                onLoginActions: sinon.spy()
            };
            componentDidMount.call(instance);
            expect(asteroid.on).to.have.callCount(2);
            expect(asteroid.on.firstCall).to.have.been.calledWith("loggedIn", instance.props.onLoginActions);
            expect(asteroid.on.secondCall).to.have.been.calledWith("loggedOut", instance.props.onLogout);
        });

        it("call `asteroid.subscribe` with correct parameter", () => {
            const instance = {
                props: {
                    onLogout: sinon.spy()
                },
                onLoginActions: sinon.spy()
            };
            componentDidMount.call(instance);
            expect(asteroid.subscribe).to.have.callCount(1);
            expect(asteroid.subscribe).to.have.been.calledWith("questions", {type: "survey"});
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
                postLogin: sinon.spy(),
                props: {
                    onLogout: sinon.spy()
                },
                onLoginActions: sinon.spy()
            };
            componentWillUnmount.call(instance);
            expect(asteroid.off).to.have.callCount(2);
            expect(asteroid.off.firstCall).to.have.been.calledWith("loggedIn", instance.onLoginActions);
            expect(asteroid.off.secondCall).to.have.been.calledWith("loggedOut", instance.props.onLogout);
        });

    });

    describe("`onLoginActions` function", () => {

        const setState = sinon.spy();
        const instance = {
            props: {
                onLogin: sinon.spy(),
                generateSessionId: sinon.spy()
            },
            setState
        };
        const FCM = {
            getFCMToken: sinon.stub().returns(resolve("token"))
        };
        const getDeviceInfo = sinon.stub().returns({
            device: {}
        });
        const asteroid = {
            call: sinon.stub().returns(resolve({
                username: "username",
                mail: ["mail"],
                givenName: ["name"]
            }))
        };

        before(() => {
            Root.__Rewire__("asteroid", asteroid);
            Root.__Rewire__("FCM", FCM);
            Root.__Rewire__("getDeviceInfo", getDeviceInfo);
        });

        after(() => {
            Root.__ResetDependency__("asteroid");
            Root.__ResetDependency__("FCM");
            Root.__ResetDependency__("getDeviceInfo");
        });

        beforeEach(() => {
            FCM.getFCMToken.reset();
            getDeviceInfo.reset();
            asteroid.call.reset();
            setState.reset();
        });

        const onLoginActions = RootView.prototype.onLoginActions.call(instance);

        it("call `onLogin` with correct parameter", () => {
            onLoginActions("userId");
            expect(instance.props.onLogin).to.have.been.calledWith("userId");
        });

        it("call `generateSessionId` with correct parameter", () => {
            onLoginActions("userId");
            expect(instance.props.generateSessionId).to.have.been.calledWith("userId");
        });

        it("call `generateSessionId` with correct parameter", () => {
            onLoginActions("userId");
            expect(asteroid.call).to.have.callCount(1);
            return asteroid.call().then(() => {
                expect(setState).to.have.callCount(1);
                expect(setState).to.have.been.calledWith({
                    username: "username",
                    email: "mail",
                    name: "name"
                });
            });
        });

        it("call `FCM.getFCMToken` function", () => {
            onLoginActions("userId");
            expect(FCM.getFCMToken).to.have.callCount(1);
            return FCM.getFCMToken().then(() => {
                expect(getDeviceInfo).to.have.callCount(1);
                expect(asteroid.call).to.have.callCount(2);
                expect(asteroid.call.secondCall).to.have.been.calledWith("saveFCMToken", "token", {device: {}});
            });
        });

    });

});
