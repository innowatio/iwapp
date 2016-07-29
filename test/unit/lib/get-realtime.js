import {fromJS, Map} from "immutable";
import getRealTimeValue from "lib/get-realtime";

describe("`getRealTimeValue` method", () => {
    var clock;

    before(() => {
        clock = sinon.useFakeTimers();
    });

    after(() => {
        clock.restore();
    });

    it("returns the correct number [CASE: is present a valid number]", () => {
        const aggregate = fromJS({
            "sensorId-1970-01-01-reading-maxPower": {
                _id: "sensorId-1970-01-01-reading-maxPower",
                measurementValues: "1,2,3,4,5,6"
            }
        });
        const ret = getRealTimeValue("sensorId", aggregate);
        expect(ret).to.equal(6);
    });

    it("returns the correct number [CASE: is not present a measurementValues field]", () => {
        const aggregate = fromJS({
            "sensorId-1970-01-01-reading-maxPower": {
                _id: "sensorId-1970-01-01-reading-maxPower"
            }
        });
        const ret = getRealTimeValue("sensorId", aggregate);
        expect(ret).to.equal(0);
    });

    it("returns the correct number [CASE: is not present the selected collection]", () => {
        const aggregate = Map();
        const ret = getRealTimeValue("sensorId", aggregate);
        expect(ret).to.equal(0);
    });

});
