import {addIndex, map, memoize} from "ramda";
import moment from "moment";

const mapIndexed = addIndex(map);

export default memoize((aggregates, chartsState) => {

    if (aggregates.isEmpty()) {
        return [{
            data: []
        }];
    }

    const sortedAggregates = aggregates.sortBy(x => x.get("day"));
    const fromDailyAggregates = !chartsState[0].period || chartsState[0].period === "day";

    return fromDailyAggregates ?
        chartDataFromDailyAggregates(sortedAggregates, chartsState) : chartDataFromYearlyAggregates(sortedAggregates, chartsState);
});

function chartDataFromDailyAggregates (sortedAggregates, chartsState) {
    const chartData = map(chartState => {
        const {sensorId, day, measurementType, source} = chartState;
        const aggregate = sortedAggregates.get(
            `${sensorId}-${day}-${source}-${measurementType}`
        );
        var data = [];
        if (aggregate) {
            const times = aggregate.get("measurementTimes").split(",");
            const values = aggregate.get("measurementValues").split(",");
            data = mapIndexed((value, index) => {
                return [parseInt(times[index]), parseFloat(value)];
            }, values);
        }
        return data;
    }, chartsState);

    return chartData.map(data => {
        const chart = data.map(serie => {
            return [moment.utc(serie[0]).hour(), serie[1]];
        });
        return {
            data: chart
        };
    });
}

function chartDataFromYearlyAggregates (sortedAggregates, chartsState) {
    const chartData = map(chartState => {
        const {sensorId, day, measurementType, source, period} = chartState;
        const time = moment.utc(day);
        const dayTime = moment.utc(day).startOf("year");
        const aggregate = sortedAggregates.get(
            `${sensorId}-${dayTime.year()}-${source}-${measurementType}`
        );
        var data = [];
        if (aggregate) {
            const values = aggregate.get("measurementValues").split(",");
            const times = values.map(() => {
                return {
                    period: dayTime.add(1, "day").get(period),
                    formatted: dayTime.format("dddd")
                };
            });
            data = mapIndexed((value, index) => {
                return [times[index].period, times[index].formatted, parseFloat(value)];
            }, values).filter(x => x[0] === time.get(period));
        }
        return data;
    }, chartsState);

    return chartData.map(data => {
        const chart = data.map(serie => {
            return [serie[1], serie[2]];
        });
        return {
            data: chart
        };
    });
}