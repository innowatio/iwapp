import {Map} from "immutable";

import {syncStoreAndAsteroid, __RewireAPI__ as asteroidReduxRewireAPI} from "lib/asteroid-redux";

describe("`asteroid-redux`", () => {

    const asteroid = {
        on: sinon.spy(),
        off: sinon.spy(),
        collections: {
            collectionKey: "collectionValue"
        }
    };

    const store = {
        dispatch: sinon.spy()
    };

    const changeCollections = sinon.stub().returns({
        type: "COLLECTIONS_CHANGE"
    });

    const debouncedFunction = () => sinon.spy();
    const debounce = sinon.stub().returns(debouncedFunction);

    const partialFunction = () => sinon.spy();
    const partial = sinon.stub().returns(partialFunction);

    before(() => {
        asteroidReduxRewireAPI.__Rewire__("changeCollections", changeCollections);
        asteroidReduxRewireAPI.__Rewire__("debounce", debounce);
        asteroidReduxRewireAPI.__Rewire__("partial", partial);
    });

    afterEach(() => {
        asteroid.on.reset();
        asteroid.off.reset();
        store.dispatch.reset();
        changeCollections.reset();
        debounce.reset();
        partial.reset();
    });

    after(() => {
        asteroidReduxRewireAPI.__ResetDependency__("changeCollections", changeCollections);
        asteroidReduxRewireAPI.__ResetDependency__("debounce");
    });

    describe("`syncStoreAndAsteroid` function", () => {

        const dispatchChangeCollections = sinon.spy();

        before(() => {
            asteroidReduxRewireAPI.__Rewire__("dispatchChangeCollections", dispatchChangeCollections);
        });

        afterEach(() => {
            dispatchChangeCollections.reset();
        });

        after(() => {
            asteroidReduxRewireAPI.__ResetDependency__("dispatchChangeCollections");
        });

        it("`asteroid.on` function is called with correct parameter", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(asteroid.on).to.have.callCount(1);
            expect(asteroid.on).to.have.been.calledWith("collections:change", debouncedFunction);
            expect(debounce).to.have.been.calledWith(partialFunction, 150);
            expect(partial.firstCall).to.have.been.calledWithExactly(dispatchChangeCollections, [store, asteroid.collections]);
        });

        it("`asteroid.off` function is called with correct parameter", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(asteroid.off).to.have.callCount(1);
            expect(asteroid.off).to.have.been.calledWith("collections:change", debouncedFunction);
            expect(debounce).to.have.been.calledWith(partialFunction, 150);
            expect(partial.secondCall).to.have.been.calledWithExactly(dispatchChangeCollections, [store, Map()]);
        });

    });

    describe("`dispatchChangeCollections` function", () => {

        var dispatchChangeCollections;

        before(() => {
            dispatchChangeCollections = asteroidReduxRewireAPI.__get__("dispatchChangeCollections");
        });

        it("call the `store.dispatch` method once", () => {
            dispatchChangeCollections(store, asteroid.collections);
            expect(store.dispatch).to.have.callCount(1);
        });

        it("call the `store.dispatch` method with `changeCollections` function as parameter", () => {
            dispatchChangeCollections(store, asteroid.collections);
            expect(store.dispatch).to.have.been.calledWith({
                type: "COLLECTIONS_CHANGE"
            });
        });

        it("call `changeCollections` function with `asteroid.collections` parameter", () => {
            dispatchChangeCollections(store, asteroid.collections);
            expect(changeCollections).to.have.callCount(1);
            expect(changeCollections).to.have.been.calledWith({
                collectionKey: "collectionValue"
            });
        });

        it("call `changeCollections` function with `Map`", () => {
            dispatchChangeCollections(store, Map());
            expect(changeCollections).to.have.callCount(1);
            expect(changeCollections).to.have.been.calledWith(Map());
        });

    });

});
