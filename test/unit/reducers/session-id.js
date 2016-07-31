import {GENERATE_SESSION_ID} from "actions/session-id";
import sessionId from "reducers/session-id";

describe("`session-id` reducer", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers(new Date("2016-06-06T01:02:03Z").getTime());
    });

    after(() => {
        clock.restore();
    });

    describe(`\`${GENERATE_SESSION_ID}\` type`, () => {

        it("skips wrong action type", () => {
            const action = {
                type: "WRONG_TYPE"
            };
            const ret = sessionId({}, action);
            expect(ret).to.deep.equal({});
        });

        it("creates a sessionId into state", () => {
            const action = {
                type: GENERATE_SESSION_ID,
                payload: {
                    sessionId: "userId-2016-06-06T01:02:03Z"
                }
            };
            const ret = sessionId({}, action);
            expect(ret).to.deep.equal({
                sessionId: "userId-2016-06-06T01:02:03Z"
            });
        });

        it("if set, returns the stored sessionId", () => {
            const action = {
                type: GENERATE_SESSION_ID,
                payload: {}
            };
            const ret = sessionId({sessionId: "userId-2016-06-06T01:02:03Z"}, action);
            expect(ret).to.deep.equal({
                sessionId: "userId-2016-06-06T01:02:03Z"
            });
        });

    });
});
