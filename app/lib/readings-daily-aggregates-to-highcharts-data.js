import {addIndex, map, memoize} from "ramda";
import moment from "moment";

const mapIndexed = addIndex(map);

export default memoize((aggregates, chartsState) => {

    if (aggregates.isEmpty()) {
        return [{
            data: []
        }];
    }

    const sortedAggregate = aggregates.sortBy(x => x.get("day"));
    const timeFromAggregate = !chartsState[0].period || chartsState[0].period === "day";
    var result;

    if (timeFromAggregate) {
        const chartsData = map(chartState => {
            const {sensorId, day, measurementType, source} = chartState;
            const aggregate = sortedAggregate.get(
                `${sensorId}-${day}-${source}-${measurementType}`
            );
            var data = [];
            if (aggregate) {
                const times = aggregate.get("measurementTimes").split(",");
                const values = aggregate.get("measurementValues").split(",");
                data = mapIndexed((value, index) => {
                    return {
                        hour: moment.utc(parseInt(times[index])).format("H"),
                        value: parseFloat(value)
                    };
                }, values);
            }
            return data;
        }, chartsState);

        const filledChartsData = chartsData.map(chartData => {
            let filledChartData = [];
            for (var index = 0; index < 24; index++) {
                let measurement = chartData.find(x => parseInt(x.hour) === index);
                measurement ? filledChartData[index] = measurement : filledChartData[index] = {
                    hour: index.toString(),
                    value: filledChartData[index - 1] ? filledChartData[index - 1].value : 0
                };
            }
            return filledChartData;
        });
        
        result = filledChartsData.map(data => {
            const chart = data.map(measurement => {
                return [measurement.hour, measurement.value];
            });
            return {
                data: chart
            };
        });
    } else {
        const chartData = map(chartState => {
            const {sensorId, day, measurementType, source, period} = chartState;
            const time = moment.utc(day);
            const dayTime = moment.utc(day).startOf("year");
            const aggregate = sortedAggregate.get(
                `${sensorId}-${dayTime.year()}-${source}-${measurementType}`
            );
            var data = [];
            if (aggregate) {
                const values = aggregate.get("measurementValues").split(",");
                data = values.map((value, index) => {
                    return {
                        period: dayTime.add(1, "day").get(period),
                        formatted: getFormat(period, dayTime),
                        value: parseFloat(values[index])
                    };
                }).filter(x => x.period === time.get(period));
            }
            if ("year" === period) {
                data = data.reduce((state, current) => {
                    const finded = state.find(value => {
                        return value.formatted === current.formatted;
                    });
                    if (finded) {
                        finded.value += current.value;
                        return state;
                    } else {
                        return [
                            ...state,
                            current
                        ];
                    }
                }, []);
            }
            return data;
        }, chartsState);

        result = chartData.map(data => {
            const chart = data.map(serie => {
                return [serie.formatted, serie.value];
            });
            return {
                data: chart
            };
        });
    }

    return result;
});

function getFormat (period, dayTime) {
    switch (period) {
        case "week":
            return dayTime.format("ddd");
        case "month":
            return dayTime.format("D");
        case "year":
            return dayTime.format("M");
    }
}