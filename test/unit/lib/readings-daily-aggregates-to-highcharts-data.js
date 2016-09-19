import moment from "moment";
import {map, range, pipe, fromPairs, unnest} from "ramda";
import {fromJS} from "immutable";

import readingsDailyAggregatesToHighchartsData from "lib/readings-daily-aggregates-to-highcharts-data";

describe("`readingsDailyAggregatesToHighchartsData` function", () => {

    var clock;

    before(() => {
        clock = sinon.useFakeTimers(1473984000000);
    });

    after(() => {
        clock.restore();
    });

    const values = {
        reading: [12, 15, 16, 12, 6, 87, 332, 234, 3],
        forecast: [16, 0, 3, 1, 4, 12, 122, 1, 334]
    };

    const times = {
        reading: [
            [1473897600000, 1473904800000, 1473944400000, 1473944450000, 1473944470000, 1473944488000, 1473944492000, 1473958800000, 1473982140000],
            [1473984000000, 1474002000000, 1474002110000, 1474030800000, 1474031000000, 1474031750000, 1474031800000, 1474046100000, 1474065000000],
            [1474070400000, 1474070600000, 1474088400000, 1474089600000, 1474110300000, 1474117500000, 1474118500000, 1474131900000, 1474132900000]
        ],
        forecast: [
            [1473897600000, 1473904800000, 1473944400000, 1473944470000, 1473944488000, 1473944492000, 1473958800000, 1473982140000],
            [1473984000000, 1474002000000, 1474002110000, 1474030800000, 1474031700000, 1474031750000, 1474031800000, 1474046100000],
            [1474070400000, 1474070600000, 1474088400000, 1474110300000, 1474117500000, 1474118500000, 1474131900000, 1474132900000]
        ]
    };
    const source = ["reading", "forecast"];

    const dates = [
        "2016-09-15",
        "2016-09-16",
        "2016-09-17"
    ];

    const readingsDailyAggregates = pipe(
        map(idx =>
            dates.map((day, index) => {
                const sensorId = "sensor_1";
                const _id = `${sensorId}-${day}-${source[idx]}-activeEnergy`;
                return [_id, {
                    _id,
                    sensorId,
                    day,
                    source: source[idx],
                    measurementType: "activeEnergy",
                    measurementValues: values[source[idx]].join(","),
                    measurementTimes: times[source[idx]][index].join(",")
                }];
            }),
        ),
        unnest,
        fromPairs,
        fromJS
    )(range(0, 2));

    const standByReadingsDailyAggregates = pipe(
        map(idx =>
            dates.map((day, index) => {
                const sensorId = "sensor_1-standby";
                const _id = `${sensorId}-${day}-${source[idx]}-activeEnergy`;
                return [_id, {
                    _id,
                    sensorId,
                    day,
                    source: source[idx],
                    measurementType: "activeEnergy",
                    measurementValues: values[source[idx]].join(","),
                    measurementTimes: times[source[idx]][index].join(",")
                }];
            }),
        ),
        unnest,
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
        expect(ret[0].data.length).to.equal(24);
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
        expect(ret[0].data.length).to.equal(24);
        expect(ret[1].data.length).to.equal(24);
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
            expect(ret).to.deep.equal([{
                data: [
                    ["0", 0],
                    ["1", 3],
                    ["2", 12],
                    ["3", 0],
                    ["4", 0],
                    ["5", 0],
                    ["6", 0],
                    ["7", 31],
                    ["8", 0],
                    ["9", 0],
                    ["10", 0],
                    ["11", 0],
                    ["12", 0],
                    ["13", 0],
                    ["14", 0],
                    ["15", 437],
                    ["16", 0],
                    ["17", 0],
                    ["18", 0],
                    ["19", 234],
                    ["20", 0],
                    ["21", 0],
                    ["22", 0],
                    ["23", 0]
                ]
            }]);
        });

        it("should be an array of correct filled values", () => {
            const chartState = [{
                sensorId: "sensor_1-standby",
                day: moment.utc().format("YYYY-MM-DD"),
                measurementType: "activeEnergy",
                source: "reading"
            }];
            const ret = readingsDailyAggregatesToHighchartsData(
                standByReadingsDailyAggregates,
                chartState
            );
            expect(ret).to.deep.equal([{
                data: [
                    ["0", 0],
                    ["1", 3],
                    ["2", 12],
                    ["3", 12],
                    ["4", 12],
                    ["5", 12],
                    ["6", 12],
                    ["7", 31],
                    ["8", 31],
                    ["9", 31],
                    ["10", 31],
                    ["11", 31],
                    ["12", 31],
                    ["13", 31],
                    ["14", 31],
                    ["15", 437],
                    ["16", 437],
                    ["17", 437],
                    ["18", 437],
                    ["19", 234],
                    ["20", 234],
                    ["21", 234],
                    ["22", 234],
                    ["23", 234]
                ]
            }]);
        });

        it("should be an empty array", () => {
            const chartState = [{
                sensorId: "sensor_1-standby",
                day: moment.utc().format("YYYY-MM-DD"),
                measurementType: "activeEnergy",
                source: "reading"
            }];
            const ret = readingsDailyAggregatesToHighchartsData(
                readingsDailyAggregates,
                chartState
            );

            expect(ret).to.deep.equal([{
                data: []
            }]);
        });

        it("should be an empty filled array", () => {
            const chartState = [{
                sensorId: "sensor_2-standby",
                day: moment.utc().format("YYYY-MM-DD"),
                measurementType: "activeEnergy",
                source: "reading"
            }];
            const ret = readingsDailyAggregatesToHighchartsData(
                standByReadingsDailyAggregates,
                chartState
            );

            expect(ret).to.deep.equal([{
                data: []
            }]);
        });

    });

});
