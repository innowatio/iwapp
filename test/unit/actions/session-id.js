import {generateSessionId} from "actions/session-id";

describe("`sessionId` actions", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers(new Date("2016-06-06T01:02:03Z").getTime());
    });

    after(() => {
        clock.restore();
    });


    it("`generateSessionId` function", () => {

        it("returns the correct sessionId", () => {
            const result = generateSessionId("userId");
            expect(result).to.equal("userId-2016-06-06T01:02:03Z");
        });

    });

});
