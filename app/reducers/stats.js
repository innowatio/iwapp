import moment from "moment";
import {combineReducers} from "redux";

import {SELECT_PERIOD} from "../actions/stats";
import {SELECT_SITE} from "../actions/site";

const defaultChartState = {
    day: moment.utc().format("YYYY-MM-DD"),
    sensorId: null,
    source: "reading",
    measurementType: "activeEnergy",
    period: "day"
};

function chart (state = defaultChartState, {type, payload}) {
    switch (type) {
        case SELECT_SITE: {
            return {
                ...state,
                sensorId: payload._id
            };
        }
        case SELECT_PERIOD: {
            return {
                ...state,
                period: payload,
                day: moment.utc().startOf(payload).format("YYYY-MM-DD")
            };
        }
        default:
            return state;
    }
}

export default combineReducers({
    chart
});
