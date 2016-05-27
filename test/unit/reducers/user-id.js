import userId from "reducers/user-id";

describe("`userId` reducers", () => {

    const stateCollections = Object.freeze(null);

    describe("`ON_LOGIN` type", () => {

        it("returns the `userId`", () => {
            const valuePassedFromAction = {
                type: "ON_LOGIN",
                payload: "userId"
            };
            const ret = userId(stateCollections, valuePassedFromAction);
            expect(ret).to.equal("userId");
        });

    });

    describe("`ON_LOGOUT` type", () => {

        const newState = Object.freeze("userId");

        it("removes the `userId` and returns `null`", () => {
            const valuePassedFromAction = {
                type: "ON_LOGOUT"
            };
            const ret = userId(newState, valuePassedFromAction);
            expect(ret).to.equal(null);
        });

    });

    it("returns the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = userId(stateCollections, valuePassedFromAction);
        expect(ret).to.deep.equal(stateCollections);
    });

});
