import actionTypeValidator from "redux-action-type-validator";
import {String} from "tcomb";
import moment from "moment";
import DeviceInfo from "react-native-device-info";

import axios, {AxiosError} from "../lib/axios";

export const NAVIGATE_BACK = "NAVIGATE_BACK";
export const NAVIGATE_VIEW = "NAVIGATE_VIEW";

export function navigateView (view) {
    return {
        type: NAVIGATE_VIEW,
        payload: {
            view
        }
    };
}

export function navigateBack () {
    return {
        type: NAVIGATE_BACK
    };
}

export const ANALYTICS_POST_START = "ANALYTICS_POST_START";
export const ANALYTICS_POST_SUCCESS = "ANALYTICS_POST_SUCCESS";
export const ANALYTICS_POST_ERROR = "ANALYTICS_POST_ERROR";

const typeofOnLogin = actionTypeValidator(String, String);
export function postAnalytics (userId, visitId) {
    typeofOnLogin(...arguments);
    return (dispatch, getState) => {
        const {analytics} = getState();
        const details = {
            uuid: DeviceInfo.getUniqueID(),
            model: DeviceInfo.getModel(),
            platform: DeviceInfo.getSystemName(),
            version: DeviceInfo.getSystemVersion(),
            appVersion: DeviceInfo.getVersion()
        };
        try {
            dispatch({type: ANALYTICS_POST_START});
            return axios.post("/user-interactions", {
                visitId,
                userId,
                details,
                interactions: analytics.navigationHistory.map(viewed => {
                    return {
                        type: "page_view",
                        timestamp: moment.utc().format(),
                        body: viewed
                    };
                })
            })
            .then(res => {
                dispatch({type: ANALYTICS_POST_SUCCESS, payload: res.data});
            })
            .catch(err => {
                /*
                *   We want to dispatch a POST_SURVEY_ERROR action only when
                *   `axios.post` fails (the error is an AxiosError). In all
                *   other cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: ANALYTICS_POST_ERROR,
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
