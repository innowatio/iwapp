import axios, {AxiosError} from "../lib/axios";

export const SAVE_SURVEY_START = "SAVE_ANSWERS_START";
export const SAVE_SURVEY_SUCCESS = "SAVE_ANSWERS_SUCCESS";
export const SAVE_SURVEY_ERROR = "SAVE_ANSWERS_ERROR";

export function saveSurveyAnswers (surveyInfo, answers, questions, userId) {
    return async dispatch => {
        try {
            dispatch({type: SAVE_SURVEY_START});
            return axios.post("/answers", {
                ...surveyInfo,
                userId,
                questions,
                answers
            })
            .then(res => {
                dispatch({type: SAVE_SURVEY_SUCCESS, payload: res.data});
            })
            .catch(err => {
                /*
                *   We want to dispatch a SAVE_SURVEY_ERROR action only when
                *   `axios.post` fails (the error is an AxiosError). In all
                *   other cases we rethrow the error.
                */
                if (err instanceof AxiosError) {
                    dispatch({
                        type: SAVE_SURVEY_ERROR,
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
