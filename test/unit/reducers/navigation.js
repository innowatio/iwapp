import navigation from "reducers/navigation";

describe("`navigation` reducer", () => {

    const stateCollections = Object.freeze(
        ["home"]
    );

    describe("`PUSH_SCENE` type", () => {

        it("returns the new array of navigation history", () => {
            const valuePassedFromAction = {
                type: "PUSH_SCENE",
                payload: "new-view"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home", "new-view"]);
        });

    });

    describe("`POP_SCENE` type", () => {

        it("returns the new array of navigation history without the last view [CASE: > 1 scene in state]", () => {
            const oldState = ["home", "new-view"];
            const valuePassedFromAction = {
                type: "POP_SCENE"
            };
            const ret = navigation(oldState, valuePassedFromAction);
            expect(ret).to.deep.equal(["home"]);
        });

        it("returns the same state [CASE: 1 scene in state]", () => {
            const oldState = ["home"];
            const valuePassedFromAction = {
                type: "POP_SCENE"
            };
            const ret = navigation(oldState, valuePassedFromAction);
            expect(ret).to.deep.equal(["home"]);
        });

    });

    it("returns the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = navigation(stateCollections, valuePassedFromAction);
        expect(ret).to.deep.equal(stateCollections);
    });

});
