import {ActionConst} from "react-native-router-flux";

import scene, {getNavigationType, __RewireAPI__ as sceneRewire} from "lib/scene";

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
        const resetNavigator = sinon.stub().returns({
            type: "RESET"
        });
        const replaceNavigator = sinon.stub().returns({
            type: "REPLACE"
        });
        const popToNavigator = sinon.stub().returns({
            type: "POP_TO"
        });
        const dispatchAction = sceneRewire.__get__("dispatchAction");

        before(() => {
            sceneRewire.__Rewire__("store", store);
            sceneRewire.__Rewire__("pushNavigator", pushNavigator);
            sceneRewire.__Rewire__("popNavigator", popNavigator);
            sceneRewire.__Rewire__("popToNavigator", popToNavigator);
            sceneRewire.__Rewire__("replaceNavigator", replaceNavigator);
            sceneRewire.__Rewire__("resetNavigator", resetNavigator);
        });

        afterEach(() => {
            pushNavigator.reset();
            popNavigator.reset();
            popToNavigator.reset();
            replaceNavigator.reset();
            resetNavigator.reset();
            store.dispatch.reset();
        });

        after(() => {
            sceneRewire.__ResetDependency__("store");
            sceneRewire.__ResetDependency__("pushNavigator");
            sceneRewire.__ResetDependency__("popNavigator");
            sceneRewire.__ResetDependency__("popToNavigator");
            sceneRewire.__ResetDependency__("replaceNavigator");
            sceneRewire.__ResetDependency__("resetNavigator");
        });

        describe("`action.type` [CASE: `PUSH`]", () => {

            const action = {
                type: ActionConst.PUSH,
                key: "home"
            };

            it("dispatch the `pushNavigator` action with `action.key` as parameter", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(2);
                expect(store.dispatch).to.have.been.calledWithExactly({
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

            it("dispatch the `resetNavigator` action", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(1);
                expect(store.dispatch).to.have.been.calledWithExactly({
                    type: "RESET"
                });
                expect(resetNavigator).to.have.callCount(1);
            });

        });

        describe("`action.type` [CASE: `REPLACE`]", () => {

            const action = {
                type: ActionConst.REPLACE
            };

            it("dispatch the `popToHome` action", () => {
                dispatchAction(action);
                expect(store.dispatch).to.have.callCount(1);
                expect(store.dispatch).to.have.been.calledWith({
                    type: "REPLACE"
                });
                expect(replaceNavigator).to.have.callCount(1);
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
                    type: "POP_TO"
                });
                expect(popToNavigator).to.have.callCount(1);
            });

        });

    });

    describe("`getNavigationType` function", () => {

        const Actions = {
            popTo: sinon.spy()
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

        it("calls `Actions.popTo` with correct argument if views in array are more than 2", () => {
            getNavigationType(["home", "view1", "view2"]);
            expect(Actions.popTo).to.have.callCount(1);
            expect(Actions.popTo).to.have.been.calledWithExactly("view1");
        });

        it("not calls `Actions.popTo` if views in array are less or equal to 2", () => {
            getNavigationType(["home", "view1"]);
            expect(Actions.popTo).to.have.callCount(0);
        });

        it("returns an object with correct type [CASE: selectedView has length 1]", () => {
            const ret = getNavigationType(["home"]);
            expect(ret).to.deep.equal({type: ActionConst.PUSH});
        });

        it("returns an object with correct type [CASE: selectedView has length > 1]", () => {
            const ret = getNavigationType(["home", "view1", "view2"]);
            expect(ret).to.deep.equal({type: ActionConst.REPLACE});
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
