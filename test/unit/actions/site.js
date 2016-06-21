import {SELECT_SITE, selectSite} from "actions/site";

describe("`site` actions", () => {
    it("returns the correct object", () => {
        const obj = {
            some_obj: "some"
        };
        const ret = selectSite(obj);
        expect(ret).to.deep.equal({
            type: SELECT_SITE,
            payload: obj
        });
    });
});