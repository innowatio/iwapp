import {fromJS} from "immutable";

import logger from "lib/redux-logger";

describe("`redux-logger`", () => {

    describe("`immutableTransformer` function", () => {

        const immutableTransformer = logger.__get__("immutableTransformer");

        it("returns an object if is passed an immutable", () => {
            const immutableObject = {
                type: "TYPE",
                name: "name",
                key: fromJS({
                    id: "id",
                    key: {
                        key1: "value1"
                    }
                })
            };
            const ret = immutableTransformer(immutableObject);
            expect(ret).to.be.an("object");
            expect(ret).to.deep.equal({
                type: "TYPE",
                name: "name",
                key: {
                    id: "id",
                    key: {
                        key1: "value1"
                    }
                }
            });
        });

        it("returns the same object passed if it is a plain object", () => {
            const immutableObject = {
                type: "TYPE",
                name: "name",
                key: {
                    id: "id",
                    key: {
                        key1: "value1"
                    }
                }
            };
            const ret = immutableTransformer(immutableObject);
            expect(ret).to.be.an("object");
            expect(ret).to.deep.equal({
                type: "TYPE",
                name: "name",
                key: {
                    id: "id",
                    key: {
                        key1: "value1"
                    }
                }
            });
        });

    });

});
