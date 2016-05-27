import actionTypeValidator from "redux-action-type-validator";
import {String} from "tcomb";

export const ON_LOGIN = "ON_LOGIN";
export const ON_LOGOUT = "ON_LOGOUT";

/**
*   action on login.
*   @param {userId} - id of the logged user
*/
const typeofOnLogin = actionTypeValidator(String);
export function onLogin (userId) {
    typeofOnLogin(...arguments);
    return {
        type: ON_LOGIN,
        payload: userId
    };
}

/**
*   action on logout.
*/
export function onLogout () {
    return {
        type: ON_LOGOUT
    };
}
