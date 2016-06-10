import actionTypeValidator from "redux-action-type-validator";
import {Boolean} from "tcomb";

export const TOGGLE_FORECAST = "TOGGLE_FORECAST";

const typeofToggleForecast = actionTypeValidator(Boolean);
export function toggleForecast (toggleForecast) {
    typeofToggleForecast(...arguments);
    return {
        type: TOGGLE_FORECAST,
        payload: toggleForecast
    };
}
