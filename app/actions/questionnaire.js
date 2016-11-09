import axios, {AxiosError} from "../lib/axios";
export const SAVE_QUESTIONNAIRE_START = "SAVE_QUESTIONNAIRE_START";
export const SAVE_QUESTIONNAIRE_SUCCESS = "SAVE_QUESTIONNAIRE_SUCCESS";
export const SAVE_QUESTIONNAIRE_ERROR = "SAVE_QUESTIONNAIRE_ERROR";

export function saveQuestionnaireAnswers (answers, questionIndex, userId, siteId, questionnaire, visitId) {
    return async dispatch => {
        try {
            dispatch({type: SAVE_QUESTIONNAIRE_START});
            const answer = answers[questionIndex];
            const countAnswers = answers.filter(value => value.answer).length;
            return axios.post("/answers", {
                answers: [answer],
                userId,
                siteId,
                questionId: questionnaire._id,
                category: questionnaire.category,
                type: questionnaire.type,
                visitId
            })
            .then(res => {
                dispatch({
                    type: SAVE_QUESTIONNAIRE_SUCCESS,
                    payload: {
                        data: res.data,
                        key:  questionnaire.category,
                        countAnswers
                    }

                });
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

export const QUESTIONNAIRE_STATUS = "QUESTIONNAIRE_STATUS";

export function questionnaireStatus (questionnairesItem) {
    return {
        type: QUESTIONNAIRE_STATUS,
        payload: questionnairesItem
    };
}
