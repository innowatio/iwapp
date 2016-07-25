import actionTypeValidator from "redux-action-type-validator";
import {Object as object, String} from "tcomb";

import axios, {AxiosError} from "../lib/axios";

export const SET_ANSWERS = "SET_ANSWERS";
export const INITIALIZE_ANSWERS = "INITIALIZE_ANSWERS";

export function setAnswers (answers, questionnaire, selectedAnswer, questionIndex) {
    return {
        type: SET_ANSWERS,
        payload: {
            answers,
            questionnaire,
            selectedAnswer,
            questionIndex
        }
    };
}

export function initializeAnswers (questionnaire) {
    return {
        type: INITIALIZE_ANSWERS,
        payload: {questionnaire}
    };
}

export const SAVE_QUESTIONNAIRE_START = "SAVE_QUESTIONNAIRE_START";
export const SAVE_QUESTIONNAIRE_SUCCESS = "SAVE_QUESTIONNAIRE_SUCCESS";
export const SAVE_QUESTIONNAIRE_ERROR = "SAVE_QUESTIONNAIRE_ERROR";

const typeofSaveQuestionnaireAnswers = actionTypeValidator(
    object,
    String,
    String
);
export function saveQuestionnaireAnswers (answers, userId, siteId) {
    typeofSaveQuestionnaireAnswers(...arguments);
    return async dispatch => {
        try {
            dispatch({type: SAVE_QUESTIONNAIRE_START});
            console.log({
                ...answers,
                userId,
                siteId
            });
            return axios.post("/answers", {
                ...answers,
                userId,
                siteId
            })
            .then(res => {
                dispatch({type: SAVE_QUESTIONNAIRE_SUCCESS, payload: res.data});
            })
            .catch(err => {
                /*
                *   We want to dispatch a SAVE_SURVEY_ERROR action only when
                *   `axios.post` fails (the error is an AxiosError). In all
                *   other cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: SAVE_QUESTIONNAIRE_ERROR,
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
