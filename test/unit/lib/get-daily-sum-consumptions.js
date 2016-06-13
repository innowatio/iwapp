import {Map, fromJS} from "immutable";

import getDailySumConsumption from "lib/get-daily-sum-consumption";

describe("`getDailySumConsumption` function", () => {

    const _id = "SitoDiTest1-2016-reading-activeEnergy";
    const aggregate = fromJS({[_id]: {
        _id,
        year : "2016",
        sensorId : "SitoDiTest1",
        source : "reading",
        measurementType : "activeEnergy",
        measurementValues : "1007.84,964.31,955.31,976.52,197.16,201.88,1014.55,910.23,1032.39,906.49,1041.88,210.05",
        unitOfMeasurement : "kWh"
    }});

    const aggregateWithoutValues = fromJS({[_id]: {
        _id,
        year : "2016",
        sensorId : "SitoDiTest1",
        source : "reading",
        measurementType : "activeEnergy",
        measurementValues : "",
        unitOfMeasurement : "kWh"
    }});

    const state = {
        sensorId: "SitoDiTest1",
        year: "2016",
        source: "reading",
        measurementType: "activeEnergy"
    };

    it("returns `0` if `consumptionAggregate` is empty", () => {
        const ret = getDailySumConsumption(Map());
        expect(ret).to.equal(0);
    });

    it("returns `0` if `measurementValues` is undefined", () => {
        const ret = getDailySumConsumption(aggregateWithoutValues, state, 10);
        expect(ret).to.be.a("number");
        expect(ret).to.equal(0);
    });

    it("returns `0` if there isn't the selected aggregate", () => {
        const ret = getDailySumConsumption(aggregateWithoutValues, {
            sensorId: "SiteNotFound",
            year: "2016",
            source: "reading",
            measurementType: "activeEnergy"
        }, 10);
        expect(ret).to.be.a("number");
        expect(ret).to.equal(0);
    });

    it("returns the correct number", () => {
        const ret = getDailySumConsumption(aggregate, state, 10);
        expect(ret).to.be.a("number");
        expect(ret).to.equal(906.49);
    });

});
