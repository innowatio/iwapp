import {syncStoreAndAsteroid, __RewireAPI__ as asteroidReduxRewireAPI} from "lib/asteroid-redux";

describe("`asteroid-redux`", () => {

    const asteroid = {
        on: sinon.spy(),
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

    before(() => {
        asteroidReduxRewireAPI.__Rewire__("debounce", debounce);
        asteroidReduxRewireAPI.__Rewire__("changeCollections", changeCollections);
    });

    afterEach(() => {
        asteroid.on.reset();
        store.dispatch.reset();
        changeCollections.reset();
    });

    after(() => {
        asteroidReduxRewireAPI.__ResetDependency__("debounce");
        asteroidReduxRewireAPI.__ResetDependency__("changeCollections");
    });

    describe("`syncStoreAndAsteroid` function", () => {

        it("call the `store.dispatch` method once", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(store.dispatch).to.have.callCount(1);
        });

        it("call the `store.dispatch` method with `changeCollections` function as parameter", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(store.dispatch).to.have.been.calledWith({
                type: "COLLECTIONS_CHANGE"
            });
        });

        it("call `changeCollections` function with `asteroid.collections` parameter", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(changeCollections).to.have.callCount(1);
            expect(changeCollections).to.have.been.calledWith({
                collectionKey: "collectionValue"
            });
        });

        it("`asteroid.on` function is called with correct parameter", () => {
            syncStoreAndAsteroid(store, asteroid);
            expect(asteroid.on).to.have.callCount(1);
            expect(asteroid.on).to.have.been.calledWith("collections:change", debouncedFunction);
        });


    });

});
