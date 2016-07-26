import {GENERATE_SESSION_ID} from "../actions/session-id";

export default function sessionId (state = null, {type, payload}) {
    switch (type) {
        case GENERATE_SESSION_ID: {
            if (state && state.sessionId) {
                return state;
            } else {
                return payload;
            }
        }
        default:
            return state;
    }
}
