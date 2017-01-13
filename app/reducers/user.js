import {ON_LOGOUT, ON_LOGIN, SET_USER_INFO} from "../actions/user";

export default function user (state = {}, {type, payload}) {
    switch (type) {
        case ON_LOGIN: {
            return {
                userId: payload
            };
        }
        case ON_LOGOUT: {
            return {};
        }
        case SET_USER_INFO: {
            return {
                ...state,
                ...payload
            };
        }
        default:
            return state;
    }
}
