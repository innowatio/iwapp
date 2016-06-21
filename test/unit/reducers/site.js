import {SELECT_SITE} from "actions/site";
import site from "reducers/site";

describe("`site` reducer", () => {

    describe(`\`${SELECT_SITE}\` type`, () => {

        it("skip wrong action type", () => {
            const action = {
                type: "WRONG_TYPE"
            };
            const ret = site({}, action);
            expect(ret).to.deep.equal({});
        });
        
        it("save site into state", () => {
            const action = {
                type: SELECT_SITE,
                payload: {
                    title: "site.title"
                }
            };
            const ret = site({}, action);
            expect(ret).to.deep.equal({
                title: "site.title"
            });
        });
    });
});
