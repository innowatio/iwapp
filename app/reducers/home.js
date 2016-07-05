import moment from "moment";
import {combineReducers} from "redux";

import {TOGGLE_FORECAST} from "../actions/home";
import {SELECT_SITE} from "../actions/site";

const defaultChartState = [{
    day: moment.utc().format("YYYY-MM-DD"),
    sensorId: "",
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
        case SELECT_SITE: {
            return state.map(old => {
                return {
                    ...old,
                    sensorId: payload._id
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
