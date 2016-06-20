import moment from "moment";
import {combineReducers} from "redux";

import {TOGGLE_FORECAST} from "../actions/home";

const defaultChartState = [{
    day: moment.utc().format("YYYY-MM-DD"),
    sensorId: "site00022",
    source: "reading",
    measurementType: "activeEnergy"
}];

function charts (state = defaultChartState, {type, payload}) {
    switch (type) {
        case TOGGLE_FORECAST: {
            const sources = payload ? ["reading", "forecast"] : ["reading"];
            return sources.map(source => ({
                ...state[0],
                source
            }));
        }
        default:
            return state;
    }
}

export default combineReducers({
    charts
});
