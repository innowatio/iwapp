import {combineReducers} from "redux";

import {QUESTIONNAIRE_STATUS, SAVE_QUESTIONNAIRE_SUCCESS} from "../actions/questionnaire";
import {roundTwoDecimals} from "../lib/questionnaire";

function status (state = [], {type, payload}) {
    switch (type) {
        case SAVE_QUESTIONNAIRE_SUCCESS:
            return state.map(value => {
                if (value.key == payload.key) {
                    var newTotalAnswers = value.totalAnswers + 1;
                    var newValue = roundTwoDecimals(newTotalAnswers / value.totalQuestions);
                    return {
                        ...value,
                        totalAnswers: newTotalAnswers,
                        value: newValue,
                        text: ((newValue || 0) * 100).toFixed() + "% completato"
                    };
                }
                return value;
            });
        case QUESTIONNAIRE_STATUS:
            return payload;
        default:
            return state;
    }
}

export default combineReducers({
    status
});
