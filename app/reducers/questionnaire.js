import {combineReducers} from "redux";

import {SET_QUESTIONNAIRE_DETAILS} from "../actions/questionnaire";

function questionnaire (state = null, {type, payload}) {
    switch (type) {
        case SET_QUESTIONNAIRE_DETAILS:
            return {
                type: payload.type,
                category: payload.category
            };
        default:
            return state;
    }
}

export default combineReducers({
    questionnaire
});
