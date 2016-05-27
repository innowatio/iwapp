import {ON_LOGOUT, ON_LOGIN} from "../actions/user-id";

export default function userId (state = null, {type, payload}) {
    switch (type) {
        case ON_LOGIN: {
            return payload;
        }
        case ON_LOGOUT: {
            return null;
        }
        default:
            return state;
    }
}
