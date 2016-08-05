import {SAVE_SURVEY_START} from "../actions/survey";

export default function survey (state = [], {type, payload}) {
    switch (type) {
        case SAVE_SURVEY_START:
            return state.concat(payload);
        default:
            return state;
    }
}
