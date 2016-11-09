import utils from "iwwa-utils";
import moment from "moment";
import "moment/locale/it";

const PERIODS = ["day", "week", "month", "year"];

export function getTitleAndSubtitle (period, aggregates) {
    const periodDates = utils.getTimeRangeByPeriod(period);
    const defaultNow = utils.getSumByPeriod(periodDates, aggregates);
    const defaultMax = utils.getSumByPeriod(utils.getPreviousPeriod(period, period), aggregates);
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
                sum: defaultNow,
                comparisons: [{
                    key: "today-1d",
                    title: "IERI",
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "today-7d",
                    title: `${moment().locale("it").format("dddd")} scors${moment().day() === 6 ? "a" : "o"}`.toUpperCase(),
                    max: utils.getSumByPeriod(utils.getPreviousPeriod("week", "day"), aggregates),
                    now: defaultNow
                }, {
                    key: "avg-7d",
                    title: `media ${moment().locale("it").format("dddd")}`.toUpperCase(),
                    max: utils.getAverageByPeriod(aggregates, "days", 7),
                    now: defaultNow
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
                    key: "week-1w",
                    title: "SETTIMANA SCORSA",
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "avg-week",
                    title: "MEDIA SETTIMANALE",
                    max: utils.getAverageByPeriod(aggregates, "week"),
                    now: defaultNow
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
                comparisons: [{
                    key: "month-1m",
                    title: `${moment(utils.getPreviousPeriod(period, period).start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: defaultMax,
                    now: defaultNow
                }, {
                    key: "month-1y",
                    title: `${moment(utils.getPreviousPeriod("year", "month").start).locale("it").format("MMMM YYYY")}`.toUpperCase(),
                    max: utils.getSumByPeriod(utils.getPreviousPeriod("year", "month"), aggregates),
                    now: defaultNow
                }, {
                    key: "avg-month",
                    title: "MEDIA DEI MESI",
                    max: utils.getAverageByPeriod(aggregates, "month"),
                    now: defaultNow
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
                comparisons: [{
                    key: "year-1y",
                    title: `${moment(utils.getPreviousPeriod(period, period).start).locale("it").format("YYYY")}`.toUpperCase(),
                    max: defaultMax,
                    now: defaultNow
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
