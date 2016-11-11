import {addIndex, findIndex, findLastIndex, map, memoize} from "ramda";
import moment from "moment";

const mapIndexed = addIndex(map);

function getDailyAggregate (dailyAggregates, chartState) {
    const {sensorId, day, measurementType, source} = chartState;
    const date = [
        moment.utc(day).subtract({day: 1}).format("YYYY-MM-DD"),
        day,
        moment.utc(day).add({day: 1}).format("YYYY-MM-DD")
    ];
    const aggregates = date.map(dataDay => dailyAggregates.get(
        `${sensorId}-${dataDay}-${source}-${measurementType}`
    ));
    return aggregates.reduce((acc, aggregate) => {
        if (!aggregate) {
            return acc;
        }
        const times = aggregate.get("measurementTimes").split(",");
        const values = aggregate.get("measurementValues").split(",");
        return {
            values: [...acc.values, ...values],
            times: [...acc.times, ...times]
        };
    }, {values: [], times: []});
}

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
            const {sensorId, day} = chartState;
            // Get daily aggregate with correct offset per timezone
            const aggregate = getDailyAggregate(sortedAggregate, chartState);
            const firstIndex = findIndex(time =>
                parseInt(time) >= moment(day).valueOf()
            )(aggregate.times);
            var lastIndex = findLastIndex(time =>
                parseInt(time) <= moment(day).endOf("day").valueOf()
            )(aggregate.times);
            if (lastIndex < 0 && firstIndex >= 0) {
                lastIndex = aggregate.values.length;
            }
            const values = aggregate.values.slice(firstIndex, lastIndex + 1);
            const times = aggregate.times.slice(firstIndex, lastIndex + 1);
            var data = [];
            data = mapIndexed((value, index) => {
                return {
                    hour: moment.utc(parseInt(times[index])).add({minutes: moment().utcOffset()}).format("H"),
                    value: parseFloat(value)
                };
            }, values);
            return {
                toFill: sensorId.includes("-standby"),
                data
            };
        }, chartsState);

        const filledChartsData = chartsData.map(chartData => {
            if (chartData.data.length == 0) {
                return [];
            }
            let filledChartData = [];
            for (var index = 0; index < 24; index++) {

                let measurements = chartData.data.filter(x => parseInt(x.hour) === index);
                let measurement = measurements.reduce((state, current) => {
                    return {
                        hour: current.hour,
                        value: state ? state.value + current.value : current.value
                    };
                }, null);

                measurement ? filledChartData[index] = measurement : filledChartData[index] = {
                    hour: index.toString(),
                    value: chartData.toFill ? (filledChartData[index-1] ? filledChartData[index-1].value : 0) : 0
                };
            }
            return filledChartData;
        });

        result = filledChartsData.map(data => {
            const chart = data.map(measurement => {
                return [measurement.hour, Math.round(measurement.value * 10) / 10];
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
                    const obj = {
                        period: dayTime.get(period),
                        dayTime: dayTime,
                        formatted: getFormat(period, dayTime),
                        formattedTooltip: getFormatTooltip(period, dayTime),
                        value: parseFloat(values[index]) || 0
                    };
                    dayTime.add(1, "day");
                    return obj;
                }).filter(x => x.period === time.get(period));
            }

            if ("year" === period) {
                data = data.reduce((state, current) => {
                    const finded = state.find(value => {
                        return value.formattedTooltip === current.formattedTooltip;
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
            const series = data.map(serie => {
                return [serie.formattedTooltip, Math.round(serie.value * 10) / 10];
            });
            const categories = data.map(serie => {
                return serie.formatted;
            });

            const completedCategories = completeCategories(chartsState[0].period, categories);
            const completedSeries = completeChart(chartsState[0].period, series);
            return {
                data: completedSeries,
                categories: completedCategories
            };
        });
    }
    return result;
});

function completeCategories (period, categories) {
    switch (period) {
        case "week":
            for (var x= categories.length; x<=6; x++) {
                categories.push(moment().weekday(x).format("ddd").substring(0, 1));
            }
            break;
        case "month":
            var endOfMonth = moment().endOf("month").format("D")-1;
            for (x=categories.length; x<=endOfMonth; x++) {
                categories.push(x+1);
            }
            break;
        case "year":
            for (x= categories.length; x<=11; x++) {
                categories.push(moment().month(x).format("MMM").substring(0, 1).toUpperCase());
            }
            break;
    }
    return categories;
}

function completeChart (period, chart) {
    switch (period) {
        case "week":
            for (var x= chart.length; x<=6; x++) {
                chart.push([x, 0]);
            }
            break;
        case "month":
            var endOfMonth = moment().endOf("month").format("D") -1;
            for (x=chart.length; x<=endOfMonth; x++) {
                chart.push([x, 0]);
            }
            break;
        case "year":
            for (x= chart.length; x<=11; x++) {
                chart.push([x, 0]);
            }
            break;
    }
    return chart;
}

function getFormat (period, dayTime) {
    switch (period) {
        case "week":
            return dayTime.format("ddd").substring(0, 1);
        case "month":
            return dayTime.format("D");
        case "year":
            return dayTime.format("MMM").substring(0, 1).toUpperCase();
    }
}

function getFormatTooltip (period, dayTime) {
    switch (period) {
        case "week":
            return dayTime.format("dddd");
        case "month":
            return dayTime.format("D") + " " + dayTime.format("MMMM");
        case "year":
            return dayTime.format("MMMM");
    }
}
