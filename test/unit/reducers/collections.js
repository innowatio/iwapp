import {fromJS, Map} from "immutable";

import collections from "reducers/collections";

describe("`collections` reducer", () => {

    describe("`COLLECTIONS_CHANGE` type", () => {

        const stateCollections = Object.freeze(
            Map()
        );

        it("returns the correct immutable `Map`", () => {
            const collection = {
                collectionKey: "collectionValue"
            };
            const valuePassedFromAction = {
                type: "COLLECTIONS_CHANGE",
                payload: fromJS(collection)
            };
            const ret = collections(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(Map(collection));
        });

        it("returns the previous state if any correct `type` is checked", () => {
            const valuePassedFromAction = {
                type: "NOT_A_CORRECT_TYPE_CASE"
            };
            const ret = collections(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(stateCollections);
        });

    });

});
