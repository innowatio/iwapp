import moment from "moment";
import {map, range, pipe, fromPairs} from "ramda";
import {fromJS} from "immutable";

import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

describe("`readingsDailyAggregatesToHighchartsData` function", () => {

    const values = {
        reading: [12, 15, 16, 12, 1, 0, 6, 87, 332, 234, 3],
        forecast: [16, 0, 3, 1, 4, 12, 122, 1, 334]
    };

    const times = {
        reading: [1465477616813, 1465478616813, 1465478900000, 1465479000000, 1465479520000, 1465479620000, 1465479840000, 1465479940000, 1465490120000, 1465497120000, 1465497720000],
        forecast: [1465477616813, 1465478516813, 1465478700000, 1465478900000, 1465479000000, 1465479520000, 14654798660000, 1465479731000, 1465495120000, 1465499320000, 146550020000]
    };
    const source = ["reading", "forecast"];

    const readingsDailyAggregates = pipe(
        map(idx => {
            const sensorId = "sensor_1";
            const day = moment.utc().format("YYYY-MM-DD");
            const _id = `${sensorId}-${day}-${source[idx]}-activeEnergy`;
            return [_id, {
                _id,
                sensorId,
                day,
                source: source[idx],
                measurementType: "activeEnergy",
                measurementValues: values[source[idx]].join(","),
                measurementTimes: times[source[idx]].join(",")
            }];
        }),
        fromPairs,
        fromJS
    )(range(0, 2));

    it("readings-daily-aggregates -> highcharts data structure [CASE: single line]", () => {
        const chartState = [{
            sensorId: "sensor_1",
            day: moment.utc().format("YYYY-MM-DD"),
            measurementType: "activeEnergy",
            source: "reading"
        }];
        const ret = readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, chartState);
        expect(ret).to.be.an("array");
        expect(ret[0]).to.be.an("object");
        expect(ret[0]).to.have.all.keys(["data"]);
        expect(ret[0].data).to.be.an("array");
        expect(ret[0].data.length).to.equal(11);
    });

    it("readings-daily-aggregates -> highcharts data structure [CASE: multiple line]", () => {
        const chartState = [{
            sensorId: "sensor_1",
            day: moment.utc().format("YYYY-MM-DD"),
            measurementType: "activeEnergy",
            source: "reading"
        }, {
            sensorId: "sensor_1",
            day: moment.utc().format("YYYY-MM-DD"),
            measurementType: "activeEnergy",
            source: "forecast"
        }];
        const ret = readingsDailyAggregatesToHighchartsData(readingsDailyAggregates, chartState);
        expect(ret).to.be.an("array");
        expect(ret[0]).to.be.an("object");
        ret.map((objectResult, index) => {
            expect(ret[index]).to.be.an("object");
            expect(ret[index]).to.have.all.keys(["data"]);
            expect(objectResult.data).to.be.an("array");
        });
        expect(ret[0].data.length).to.equal(11);
        expect(ret[1].data.length).to.equal(9);
    });

    describe("`data` array", () => {

        it("should be an array of correct values", () => {
            const chartState = [{
                sensorId: "sensor_1",
                day: moment.utc().format("YYYY-MM-DD"),
                measurementType: "activeEnergy",
                source: "reading"
            }];
            const ret = readingsDailyAggregatesToHighchartsData(
                readingsDailyAggregates,
                chartState
            );
            
            ret.forEach((res, idx) => {
                res.data.forEach((data, dataIndex) => {
                    expect(data[0]).to.be.a("string");
                    expect(data[1]).to.be.a("number");
                    expect(data[0]).to.deep.equal(moment.utc(times[source[idx]][dataIndex]).format("HH"));
                    expect(data[1]).to.deep.equal(values[source[idx]][dataIndex]);
                });
            });
        });
    });

});
