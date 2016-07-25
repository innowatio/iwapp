import {ActionConst} from "react-native-router-flux";

import scene, {onSelectView, __RewireAPI__ as sceneRewire} from "lib/scene";

describe("`scene`", () => {

    it("is a React element", () => {
        expect(TestUtils.isElement(scene)).to.equal(true);
    });

    describe("`dispatchAction` function", () => {

        const store = {
            dispatch: sinon.spy()
        };
        const pushNavigator = sinon.stub().returns({
            type: "PUSH"
        });
        const popNavigator = sinon.stub().returns({
            type: "POP"
        });
        const popToHome = sinon.stub().returns({
            type: "POP_TO_HOME"
        });
        const dispatchAction = sceneRewire.__get__("dispatchAction");

        before(() => {
            sceneRewire.__Rewire__("store", store);
            sceneRewire.__Rewire__("pushNavigator", pushNavigator);
            sceneRewire.__Rewire__("popNavigator", popNavigator);
            sceneRewire.__Rewire__("popToHome", popToHome);
        });

        afterEach(() => {
            pushNavigator.reset();
            popNavigator.reset();
            popToHome.reset();
            store.dispatch.reset();
        });

        after(() => {
            sceneRewire.__ResetDependency__("store");
            sceneRewire.__ResetDependency__("pushNavigator");
            sceneRewire.__ResetDependency__("popNavigator");
            sceneRewire.__ResetDependency__("popToHome");
        });

        describe("`action.type` [CASE: `PUSH`]", () => {

            const action = {
                type: ActionConst.PUSH,
                key: "home"
            };

            it("dispatch the `pushNavigator` action with `action.key` as parameter", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(2);
                expect(store.dispatch).to.have.been.calledWith({
                    type: "PUSH"
                });
                expect(pushNavigator).to.have.callCount(1);
                expect(pushNavigator).to.have.been.calledWith("home");
            });

        });

        describe("`action.type` [CASE: `BACK_ACTION`]", () => {

            const action = {
                type: ActionConst.BACK_ACTION
            };

            it("dispatch the `popNavigator` action", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(2);
                expect(store.dispatch).to.have.been.calledWith({
                    type: "POP"
                });
                expect(popNavigator).to.have.callCount(1);
            });

        });

        describe("`action.type` [CASE: `RESET`]", () => {

            const action = {
                type: ActionConst.RESET
            };

            it("dispatch the `popToHome` action", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(1);
                expect(store.dispatch).to.have.been.calledWith({
                    type: "POP_TO_HOME"
                });
                expect(popToHome).to.have.callCount(1);
            });

        });

        describe("`action.type` [CASE: `POP_TO`]", () => {

            const action = {
                type: ActionConst.POP_TO
            };

            it("dispatch the `popToHome` action", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(1);
                expect(store.dispatch).to.have.been.calledWith({
                    type: "POP_TO_HOME"
                });
                expect(popToHome).to.have.callCount(1);
            });

        });

    });

    describe("`onSelectView` function", () => {

        const Actions = {
            popTo: sinon.spy(),
            nextView: sinon.spy(),
            view: sinon.spy()
        };

        before(() => {
            sceneRewire.__Rewire__("Actions", Actions);
        });

        beforeEach(() => {
            Actions.popTo.reset();
        });

        after(() => {
            sceneRewire.__ResetDependency__("Actions");
        });

        it("call `onPop` and push on next view if arguments are different", () => {
            onSelectView("view", "nextView");
            expect(Actions.popTo).to.have.callCount(1);
            expect(Actions.popTo).to.have.been.calledWithExactly("home");
            expect(Actions.nextView).to.have.callCount(1);
        });

        it("skip if arguments are equals", () => {
            onSelectView("view", "view");
            expect(Actions.popTo).to.have.callCount(0);
            expect(Actions.view).to.have.callCount(0);
        });

    });

    describe("`reducerCreate` function", () => {

        const reducerCreate = sceneRewire.__get__("reducerCreate");

        const defaultReducer = sinon.stub().returns({
            name: "defaultReducer"
        });
        const Reducer = sinon.stub().returns(defaultReducer);
        const dispatchAction = sinon.spy();

        before(() => {
            sceneRewire.__Rewire__("Reducer", Reducer);
            sceneRewire.__Rewire__("dispatchAction", dispatchAction);
        });

        afterEach(() => {
            Reducer.reset();
            defaultReducer.reset();
            dispatchAction.reset();
        });

        after(() => {
            sceneRewire.__ResetDependency__("Reducer");
            sceneRewire.__ResetDependency__("dispatchAction");
        });

        it("returns a function", () => {
            const ret = reducerCreate();
            expect(ret).to.be.a("function");
        });

        it("the returned function calls `dispatchAction` function", () => {
            const state = {};
            const action = {
                type: "push",
                key: "home"
            };
            const reducer = reducerCreate();
            reducer(state, action);
            expect(dispatchAction).to.have.callCount(1);
            expect(dispatchAction).to.have.been.calledWithExactly(action);
        });

        it("the returned function returns `defaultReducer` function with correct parameters", () => {
            const state = {};
            const action = {
                type: "push",
                key: "home"
            };
            const reducer = reducerCreate();
            const ret = reducer(state, action);
            expect(defaultReducer).to.have.callCount(1);
            expect(defaultReducer).to.have.been.calledWithExactly(state, action);
            expect(ret).to.deep.equal({
                name: "defaultReducer"
            });
        });

    });

});
