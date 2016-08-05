import survey from "reducers/survey";

describe("`userId` reducers", () => {

    const stateCollections = Object.freeze([]);

    describe("`SAVE_SURVEY_START` type", () => {

        it("returns the `survey` [CASE: empty array]", () => {
            const valuePassedFromAction = {
                type: "SAVE_SURVEY_START",
                payload: "surveyId"
            };
            const ret = survey(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal(["surveyId"]);
        });

        it("returns the `survey` [CASE: array with field]", () => {
            const valuePassedFromAction = {
                type: "SAVE_SURVEY_START",
                payload: "surveyId"
            };
            const ret = survey(["surveyId1", "surveyId2"], valuePassedFromAction);
            expect(ret).to.deep.equal(["surveyId1", "surveyId2", "surveyId"]);
        });

    });

    it("returns the previous state if any correct `type` is checked", () => {
        const valuePassedFromAction = {
            type: "NOT_A_CORRECT_TYPE_CASE"
        };
        const ret = survey(stateCollections, valuePassedFromAction);
        expect(ret).to.deep.equal(stateCollections);
    });

});
