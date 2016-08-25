import survey from "reducers/survey";

describe("`survey` reducers", () => {

    const stateCollections = Object.freeze([]);

    describe("`SAVE_SURVEY_START` type", () => {

        it("returns the `survey` [CASE: empty array]", () => {
            const valuePassedFromAction = {
                type: "SAVE_SURVEY_START",
                payload: "surveyId"
            };
            const ret = survey(stateCollections, valuePassedFromAction);
            expect(ret).to.deep.equal([{
                id: "surveyId",
                fetch: true
            }]);
        });

        it("returns the `survey` [CASE: array with field]", () => {
            const valuePassedFromAction = {
                type: "SAVE_SURVEY_START",
                payload: "surveyId"
            };
            const ret = survey([{
                id: "surveyId1",
                fetch: false
            }, {
                id: "surveyId2",
                fetch: false
            }], valuePassedFromAction);
            expect(ret).to.deep.equal([
                {
                    id: "surveyId1",
                    fetch: false
                },
                {
                    id: "surveyId2",
                    fetch: false
                },
                {
                    id: "surveyId",
                    fetch: true
                }

            ]);
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
