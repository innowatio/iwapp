import {Map, fromJS} from "immutable";

import {getUsername, getEmail, __RewireAPI__ as getUserRewireAPI} from "lib/get-user-info";

describe("`getUser` methods", () => {

    const _id = "userId";
    const user = {
        emails: [{
            address: "test@email.com"
        }],
        profile: {
            username: "test user"
        }
    };

    const collections = fromJS({["users"]: {[_id]: user}});

    describe("`getUser` function", () => {

        const getUser = getUserRewireAPI.__get__("getUser");

        it("returns a `Map` if collections is empty", () => {
            const emptyCollections = Map();
            const ret = getUser("userId", emptyCollections);
            expect(ret).to.deep.equal(Map());
        });

        it("returns a `Map` if in the collections is not present the `userId`", () => {
            const ret = getUser("notUserId", collections);
            expect(ret).to.deep.equal(Map());
        });

        it("returns the correct Map", () => {
            const ret = getUser("userId", collections);
            expect(ret).to.deep.equal(fromJS(user));
        });

    });

    describe("`getUsername` function", () => {

        it("returns an empty string if `getUser` function returns a `Map`", () => {
            const emptyCollections = Map();
            const ret = getUsername("userId", emptyCollections);
            expect(ret).to.equal("");
        });

        it("returns the `username`", () => {
            const ret = getUsername("userId", collections);
            expect(ret).to.deep.equal("test user");
        });

    });

    describe("`getEmail` function", () => {

        it("returns an empty string if `getUser` function returns a `Map`", () => {
            const emptyCollections = Map();
            const ret = getEmail("userId", emptyCollections);
            expect(ret).to.equal("");
        });

        it("returns the `email`", () => {
            const ret = getEmail("userId", collections);
            expect(ret).to.deep.equal("test@email.com");
        });

    });

});
