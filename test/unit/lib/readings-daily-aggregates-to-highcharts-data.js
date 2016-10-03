import moment from "moment";
import {map, range, pipe, findIndex, findLastIndex, fromPairs, update, unnest} from "ramda";
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
    const defaultChartArray = [
        ["0", 0],
        ["1", 0],
        ["2", 0],
        ["3", 0],
        ["4", 0],
        ["5", 0],
        ["6", 0],
        ["7", 0],
        ["8", 0],
        ["9", 0],
        ["10", 0],
        ["11", 0],
        ["12", 0],
        ["13", 0],
        ["14", 0],
        ["15", 0],
        ["16", 0],
        ["17", 0],
        ["18", 0],
        ["19", 0],
        ["20", 0],
        ["21", 0],
        ["22", 0],
        ["23", 0]
    ];

    const dates = [
        "2016-09-15",
        "2016-09-16",
        "2016-09-17"
    ];

    function getDataArray (times, values) {
        return times.reduce((acc, time, index) => {
            const hour = moment.utc(parseInt(time)).add({minutes: moment().utcOffset()}).format("H");
            const indexHour = findIndex(a => a[0] == hour)(acc);
            return update(indexHour, [hour, values[index] + acc[indexHour][1]], acc);
        }, defaultChartArray);
    }

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
            const totalTimes = unnest(times.reading);
            const firstIndex = findIndex(time => parseInt(time) >= moment("2016-09-16").valueOf())(totalTimes);
            const lastIndex = findLastIndex(time => parseInt(time) <= moment("2016-09-16").endOf("day").valueOf())(totalTimes);
            const timesArray = totalTimes.slice(firstIndex, lastIndex + 1);
            const valuesArray = [
                12, 15, 16, 12, 6, 87, 332, 234, 3, 12, 15, 16, 12, 6, 87, 332, 234, 3, 12, 15, 16, 12, 6, 87, 332, 234, 3
            ].slice(firstIndex, lastIndex + 1);
            const data = getDataArray(timesArray, valuesArray);
            expect(ret).to.deep.equal([{data}]);
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
            const totalTimes = unnest(times.reading);
            const firstIndex = findIndex(time => parseInt(time) >= moment("2016-09-16").valueOf())(totalTimes);
            const lastIndex = findLastIndex(time => parseInt(time) <= moment("2016-09-16").endOf("day").valueOf())(totalTimes);
            const timesArray = totalTimes.slice(firstIndex, lastIndex + 1);
            const valuesArray = [
                12, 15, 16, 12, 6, 87, 332, 234, 3, 12, 15, 16, 12, 6, 87, 332, 234, 3, 12, 15, 16, 12, 6, 87, 332, 234, 3
            ].slice(firstIndex, lastIndex + 1);
            const dataArray = getDataArray(timesArray, valuesArray);
            var lastDataNotZero = 0;
            const data = dataArray.reduce((acc, value, index) => {
                if (value[1] !== 0) {
                    lastDataNotZero = value[1];
                }
                return update(index, [value[0], lastDataNotZero], acc);
            }, dataArray);
            expect(ret).to.deep.equal([{data}]);
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
