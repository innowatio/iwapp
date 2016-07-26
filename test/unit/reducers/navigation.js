import navigation from "reducers/navigation";

describe("`navigation` reducer", () => {

    describe("`PUSH_SCENE` type", () => {

        const stateCollections = Object.freeze(
            ["home"]
        );

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
            const stateCollections = Object.freeze(["home", "new-view"]);
            const valuePassedFromAction = {
                type: "POP_SCENE"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home"]);
        });

        it("returns the same state [CASE: 1 scene in state]", () => {
            const stateCollections = Object.freeze(["home"]);
            const valuePassedFromAction = {
                type: "POP_SCENE"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home"]);
        });

    });

    describe("`REPLACE_SCENE` type", () => {

        const stateCollections = Object.freeze(
            ["home", "view1"]
        );

        it("returns the new array of navigation history", () => {
            const valuePassedFromAction = {
                type: "REPLACE_SCENE",
                payload: "new-view"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home", "new-view"]);
        });

    });

    describe("`RESET_SCENE` type", () => {

        const stateCollections = Object.freeze(
            ["home", "view1", "view2", "view3"]
        );

        it("returns the new array of navigation history", () => {
            const valuePassedFromAction = {
                type: "RESET_SCENE"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home"]);
        });

    });

    describe("`POP_TO_SCENE` type", () => {

        const stateCollections = Object.freeze(
            ["home", "view1", "view2", "view3", "view4"]
        );

        it("returns the new array of navigation history", () => {
            const valuePassedFromAction = {
                type: "POP_TO_SCENE",
                payload: "view2"
            };
            const ret = navigation(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["home", "view1", "view2"]);
        });

    });

    it("returns the previous state if any correct `type` is checked", () => {
        const stateCollections = Object.freeze(
            ["home"]
        );
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = navigation(stateCollections, valuePassedFromAction);
        expect(ret).to.deep.equal(stateCollections);
    });

});
