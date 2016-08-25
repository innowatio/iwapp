import actionTypeValidator from "redux-action-type-validator";
import {maybe, list, struct, Any, Number, String} from "tcomb";

import axios, {AxiosError} from "../lib/axios";

export const SAVE_SURVEY_START = "SAVE_SURVEY_START";
export const SAVE_SURVEY_SUCCESS = "SAVE_SURVEY_SUCCESS";
export const SAVE_SURVEY_ERROR = "SAVE_SURVEY_ERROR";

export const SURVEY_RATE = "rate";
export const SURVEY_SIGLE_CHOICE = "singleChoice";

const typeofSaveSurveyAnswers = actionTypeValidator(
    struct({
        questionId: String,
        type: String,
        category: String
    }),
    list(
        struct({
            answer: Any,
            id: Number,
            timestamp: String,
            question: struct({
                text: String,
                category: maybe(String)
            })
        })
    ),
    String,
    String
);
export function saveSurveyAnswers (surveyInfo, answers, userId, sessionId) {
    typeofSaveSurveyAnswers(...arguments);




    return async dispatch => {
        try {
            dispatch({
                type: SAVE_SURVEY_START,
                payload: surveyInfo.questionId
            });
            return axios.post("/answers", {
                ...surveyInfo,
                userId,
                answers,
                visitId: sessionId
            }).then(() => {
                dispatch({type: SAVE_SURVEY_SUCCESS});
            }).catch(err => {
                /*
                *   We want to dispatch a SAVE_SURVEY_ERROR action only when
                *   `axios.post` fails (the error is an AxiosError). In all
                *   other cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: SAVE_SURVEY_ERROR,
                        errorMessage: err,
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
