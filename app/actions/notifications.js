import actionTypeValidator from "redux-action-type-validator";
import {list, String} from "tcomb";

import axios, {AxiosError} from "../lib/axios";

export const NOTIFICATIONS_READED_START = "NOTIFICATIONS_READED_START";
export const NOTIFICATIONS_READED_SUCCESS = "NOTIFICATIONS_READED_SUCCESS";
export const NOTIFICATIONS_READED_ERROR = "NOTIFICATIONS_READED_ERROR";

const typeofOnLogin = actionTypeValidator(list(String));
export function setNotificationsReaded (notificationsIds) {
    typeofOnLogin(...arguments);
    return (dispatch) => {
        try {
            dispatch({type: NOTIFICATIONS_READED_START});
            return axios.post("/notifications-readed", {
                notificationsIds
            }).then(res => {
                dispatch({type: NOTIFICATIONS_READED_SUCCESS, payload: res.data});
            }).catch(err => {
                /*
                *   We want to dispatch a POST_SURVEY_ERROR action only when
                *   `axios.post` fails (the error is an AxiosError). In all
                *   other cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: NOTIFICATIONS_READED_ERROR,
                        payload: err,
                        error: true
                    });
                } else {
                    throw err;
                }
            });
        } catch (err) {
            /*
            *   We cannot recover from a dispatch error. Therefore we only
            *   log it.
            */
            console.error(err);
        }
    };
}
