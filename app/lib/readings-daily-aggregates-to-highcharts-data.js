import {addIndex, map, memoize} from "ramda";

const mapIndexed = addIndex(map);

export default memoize(function readingsDailyAggregatesToHighchartsData (aggregates, chartsState) {

    if (aggregates.isEmpty()) {
        return [{
            data: []
        }];
    }

    const sortedAggregate = aggregates.sortBy(x => x.get("day"));
    const chartData = map(chartState => {
        const {sensorId, day, measurementType, source} = chartState;
        const aggregate = sortedAggregate.get(
            `${sensorId}-${day}-${source}-${measurementType}`
        );
        var data = [];
        if (aggregate) {
            const times = aggregate.get("measurementTimes").split(",");
            const values = aggregate.get("measurementValues").split(",");
            data = mapIndexed((value, valueIndex) => {
                return [parseInt(times[valueIndex]), parseFloat(value)];
            }, values);
        }
        return data;
    }, chartsState);

    return chartData.map(data => ({data}));
});
