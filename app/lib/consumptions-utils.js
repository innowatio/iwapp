import utils from "iwwa-utils";
import moment from "moment";
import "moment/locale/it";

const PERIODS = ["day", "week", "month", "year"];

function getLabel (key, day) {
    switch (key) {
        case "today":
            return "OGGI";
        case "today-7d-toNow":
        case "yesterday":
            return `${day.format("dddd")}`.toUpperCase();
        case "avg-8-prev-today":
        case "avg-8-prev-yesterday":
            return `media ${day.isoWeekday() === 7
                ? "delle ultime 8 domeniche"
                : "degli ultimi 8 " + day.format("dddd")}`.toUpperCase();
        default:
    }
}

export function getTitleAndSubtitle (period, aggregates, aggregatesPrevPeriod) {
    const periodDates = utils.getTimeRangeByPeriod(period);
    const periodDatesToNow = utils.getTimeRangeByPeriod(period, true);
    const previousPeriodDates = utils.getPreviousPeriod(period, period);
    const previousPeriod2Dates = utils.getPreviousPeriod(period, period, false, 2);
    const previousPeriod3Dates = utils.getPreviousPeriod(period, period, false, 3);
    const defaultNow = utils.getSumByPeriod(periodDates, aggregatesPrevPeriod);
    const defaultToNow = utils.getSumByPeriodToNow(periodDatesToNow, aggregates);
    const aggregatesPrevPeriodFiltered = aggregatesPrevPeriod.filter(agg => agg.get("year") != moment().format("YYYY"));
    const isPyAvailable = aggregatesPrevPeriodFiltered.size > 0;
    const year1y = isPyAvailable ? utils.getSumByPeriod(previousPeriodDates, aggregatesPrevPeriodFiltered) : 0;
    const yearAvg = isPyAvailable ? utils.getAverageByYear(aggregatesPrevPeriodFiltered) : 0;
    const today = moment();
    const yesterday = moment().subtract(1, "day");

    switch (PERIODS.indexOf(period)) {
        case 0:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "OGGI HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                peersText: "Media dei consumi giornalieri di attività simili",
                title: "OGGI",
                sum: defaultToNow,
                comparisons: [{
                    key: "today",
                    title: "OGGI",
                    now: defaultToNow
                }, {
                    key: "avg-8-prev-today",
                    title: getLabel("avg-8-prev-today", today),
                    now: utils.getAverageByPeriodToNow(aggregates, "days", 7)
                }, {
                    key: "today-7d-toNow",
                    title: getLabel("today-7d-toNow", today),
                    now: utils.getSumByPeriodToNow(utils.getPreviousPeriod("week", period, true), aggregates)
                }],
                comparisonsPrevPeriod: [{
                    key: "yesterday",
                    title: "TOTALE DI " + getLabel("yesterday", yesterday),
                    now: utils.getSumByPeriod(utils.getPreviousPeriod("day", period, false, 8), aggregatesPrevPeriod)
                }, {
                    key: "avg-8-prev-yesterday",
                    title: getLabel("avg-8-prev-yesterday", yesterday),
                    now: utils.getAverageByPeriod(aggregatesPrevPeriod, "days", 8)
                }]
            };
        case 1:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: "QUESTA SETTIMANA HAI UTILIZZATO",
                periodSubtitle: `${moment(periodDates.start).format("DD")} - ${moment(periodDates.end).locale("it").format("DD MMMM YYYY")}`.toUpperCase(),
                peersText: "Media dei consumi settimanali di attività simili",
                title: "SETTIMANA CORRENTE",
                sum: defaultNow,
                comparisons: [{
                    key: "week-toNow",
                    title: "SETTIMANA CORRENTE",
                    now: defaultToNow
                }, {
                    key: "avg-8w-toNow",
                    title: "MEDIA DELLE ULTIME 8 SETTIMANALE",
                    now: utils.getAverageByPeriodToNow(aggregates, period, 1)
                }, {
                    key: "week-1w-toNow",
                    title: "SETTIMANA SCORSA",
                    now: utils.getSumByPeriodToNow(utils.getPreviousPeriod(period, period, true), aggregates)
                }],
                comparisonsPrevPeriod: [{
                    key: "week-1w",
                    title: "TOTALE DI SETTIMANA SCORSA",
                    now: utils.getSumByPeriod(previousPeriodDates, aggregatesPrevPeriod)
                }, {
                    key: "avg-8w",
                    title: "TOTALE IN MEDIA DELLE ULTIME 8 SETTIMANA",
                    now: utils.getAverageByPeriod(aggregatesPrevPeriod, period, 1)
                }]
            };
        case 2:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL MESE DI ${moment(periodDates.start).locale("it").format("MMMM")} HAI UTILIZZATO`.toUpperCase(),
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`,
                peersText: "Media dei consumi mensili di attività simili",
                title: "MESE CORRENTE",
                sum: defaultNow,
                comparisons: [],
                comparisonsPrevPeriod: [{
                    key: "month-1m",
                    title: `${moment.utc(previousPeriodDates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: utils.getSumByPeriod(previousPeriodDates, aggregatesPrevPeriod)
                }, {
                    key: "month-2m",
                    title: `${moment.utc(previousPeriod2Dates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: utils.getSumByPeriod(previousPeriod2Dates, aggregatesPrevPeriod)
                }, {
                    key: "month-3m",
                    title: `${moment.utc(previousPeriod3Dates.start).format("MMMM YYYY")}`.toUpperCase(),
                    now: utils.getSumByPeriod(previousPeriod3Dates, aggregatesPrevPeriod)
                }]
            };
        case 3:
            return {
                key: period,
                measureUnit: "kWh",
                period: period,
                periodTitle: `NEL ${moment(periodDates.start).format("YYYY")} HAI UTILIZZATO`,
                periodSubtitle: `${moment(periodDates.start).format("YYYY")}`.toUpperCase(),
                peersText: "Media dei consumi annuali di attività simili",
                title: "ANNO CORRENTE",
                sum: defaultNow,
                comparisons: [],
                comparisonsPrevPeriod: [
                    {
                        key: "year-1y",
                        title: `${moment(previousPeriodDates.start).format("YYYY")}`.toUpperCase(),
                        now: year1y
                    },
                    {
                        key: "year-avg",
                        title: "MEDIA DEGLI ANNI PRECEDENTI",
                        now: yearAvg
                    }
                ]
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
