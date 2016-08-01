import {SAVE_SURVEY_SUCCESS} from "../actions/survey";

export default function survey (state = [], {type, payload}) {
    switch (type) {
        case SAVE_SURVEY_SUCCESS:
            return state.concat(payload.surveyId);
        default:
            return state;
    }
}
