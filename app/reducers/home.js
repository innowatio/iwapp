import moment from "moment";
import {combineReducers} from "redux";

import {TOGGLE_FORECAST} from "../actions/home";
import {SELECT_SITE} from "../actions/site";

const defaultChartState = [{
    day: moment.utc().format("YYYY-MM-DD"),
    sensorId: null,
    source: "reading",
    measurementType: "activeEnergy"
}, {
    day: moment.utc().format("YYYY-MM-DD"),
    sensorId: null,
    source: "reading",
    measurementType: "activeEnergy"
}];

function charts (state = defaultChartState, {type, payload}) {
    switch (type) {
        case TOGGLE_FORECAST: {
            const first = state[0];
            return payload ? [
                first, {
                    ...first,
                    source: "forecast"
                }, {
                    ...first,
                    sensorId: `${first.sensorId}-standby`
                }
            ] : state.filter(x => x.source === "reading");
        }
        case SELECT_SITE: {
            return state.map((old, index) => {
                return {
                    ...old,
                    sensorId: (state.length === index + 1) ? `${payload._id}-standby` : payload._id
                };
            });
        }
        default:
            return state;
    }
}

export default combineReducers({
    charts
});
