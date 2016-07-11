import moment from "moment";
import "moment/locale/it";

const PERIODS = ["day", "week", "month", "year"];

export function getTimeRangeByPeriod (period) {
    const now = moment.utc();
    return {
        start: now.startOf(period).format("YYYY-MM-DDTHH:mm:ssZ"),
        end: now.endOf(period).format("YYYY-MM-DDTHH:mm:ssZ")
    };
}

function getPreviousPeriod (subtractPeriod, rangePeriod) {
    return {
        start: moment.utc().subtract(1, subtractPeriod).startOf(rangePeriod).format("YYYY-MM-DDTHH:mm:ssZ"),
        end: moment.utc().subtract(1, subtractPeriod).endOf(rangePeriod).format("YYYY-MM-DDTHH:mm:ssZ")
    };
}

function getInYear (time, period) {
    return getPeriodRatio(period, time.dayOfYear() - 1);
}

function getPeriodRatio (period, days) {
    return days / getDaysIn (period);
}

function getDaysIn (period) {
    var result = 0;
    switch (period) {
        case "day":
            result = 1;
            break;
        case "week":
            result = 7;
            break;
        case "month":
            result = 30.41;
            break;
        case "year":
            result = 365.25;
            break;
    }
    return result;
}

function sumMeasurements (measurements, startDay, endDay, period) {
    var sum = 0;
    var max = 0;
    for (var index = startDay; index < endDay; index++) {
        const number = isNaN(parseFloat(measurements[index])) ? 0 : parseFloat(measurements[index]);
        sum += number;
        if (max < number) {
            max = number;
        }
    }
    const avg = sum / getPeriodRatio(period, endDay - startDay);
    return avg.toFixed(0);
}

function getRangeStats (aggregates, period, periodOffset = 0, periodOffsetType = period, periodLenght = 1) {

    const startTime = moment().startOf(period).subtract(periodOffset, periodOffsetType);
    const endTime = moment().startOf(period).subtract(periodOffset, periodOffsetType).add(periodLenght, period);
    const delta = moment.duration(endTime - startTime);

    const range = {
        startDay: startTime.dayOfYear() - 1,
        endDay: (startTime.dayOfYear() - 1) + delta.asDays()
    };

    const aggregate = aggregates.find(x => x.get("measurementType") === "activeEnergy" && parseInt(x.get("year")) === startTime.year());
    const measurements = aggregate ? aggregate.get("measurementValues").split(",") : [];

    return sumMeasurements(measurements, range.startDay, range.endDay, period);
}

function getPeriodStats (period, aggregates) {

    const aggregate = aggregates.find(x => x.get("measurementType") === "activeEnergy" && x.get("year") === "2016");
    const measurements = aggregate.get("measurementValues").split(",");

    const time = moment().startOf("year");
    time.add({
        days: measurements.length - 1
    });

    var max = 0;
    const total = measurements.reduce((x, y) => {
        const number = isNaN(parseFloat(y)) ? 0 : parseFloat(y);
        if (max < number) {
            max = number;
        }
        return x + number;
    }, 0);

    const avg = total / getInYear(time, period);

    return {
        avg: avg.toFixed(0),
        max: (max * getDaysIn(period)).toFixed(0)
    };
}

export function getTitleAndSubtitle (period, aggregates) {
    const periodDates = getTimeRangeByPeriod(period);
    const result = getPeriodStats(period, aggregates);
    const periodStats = (period, periodOffset, periodOffsetType) => getRangeStats(aggregates, period, periodOffset, periodOffsetType);
    switch (PERIODS.indexOf(period)) {
        case 0:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "OGGI",
                sum: periodStats(period),
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    max: result.max,
                    now: periodStats(period, 1)
                }, {
                    key: "today-7d",
                    title: `${moment().locale("it").format("dddd")} scors${moment().day() === 6 ? "a" : "o"}`.toUpperCase(),
                    max: result.max,
                    now: periodStats(period, 2)
                }, {
                    key: "avg-7d",
                    title: `media ${moment().locale("it").format("dddd")}`.toUpperCase(),
                    max: result.max,
                    now: result.avg
                }]
            };
        case 1:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                title: "SETTIMANA CORRENTE",
                sum: periodStats(period),
                comparisons: [{
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    max: result.max,
                    now: periodStats(period, 1)
                }, {
                    key: "avg-week",
                    title: "MEDIA SETTIMANALE",
                    max: result.max,
                    now: result.avg
                }]
            };
        case 2:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).locale("it").format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
                title: "MESE CORRENTE",
                sum: periodStats(period),
                comparisons: [{
                    key: "month-1m",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: result.max,
                    now: periodStats(period, 1)
                }, {
                    key: "month-1y",
                    title: `${moment(getPreviousPeriod("year", "month").start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: result.max,
                    now: periodStats(period, 2)
                }, {
                    key: "avg-month",
                    title: "MEDIA DEI MESI",
                    max: result.max,
                    now: result.avg
                }]
            };
        case 3:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                title: "ANNO CORRENTE",
                sum: result.avg,
                comparisons: [{
                    key: "year-1y",
                    title: `${moment(getPreviousPeriod(period, period).start).locale("it").format("YYYY")}`.toUpperCase(),
                    max: result.max,
                    now: periodStats(period, 1)
                }]
            };
        default:
            return {
                key: period,
                measureUnit: "kWh",
                now: 0,
                period: period,
                periodTitle: "",
                periodSubtitle: "",
                title: "",
                comparisons: []
            };
    }
}
