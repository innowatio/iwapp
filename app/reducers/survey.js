import {dropLast, last} from "ramda";

import {SAVE_SURVEY_START, SAVE_SURVEY_ERROR, SAVE_SURVEY_SUCCESS} from "../actions/survey";

export default function survey (state = [{}], {type, payload, error, errorMessage}) {
    switch (type) {
        case SAVE_SURVEY_START: {
            const stateItem = {
                id: payload,
                fetch: true
            };
            return state.concat(stateItem);
        }
        case SAVE_SURVEY_SUCCESS: {
            const stateItem = {
                ...last(state),
                fetch: false
            };
            dropLast(1, state);
            return state.concat(stateItem);
        }
        case SAVE_SURVEY_ERROR: {
            const stateItem = {
                ...last(state),
                fetch: false,
                error,
                errorMessage
            };
            return state.concat(stateItem);
        }
        default:
            return state;
    }
}
