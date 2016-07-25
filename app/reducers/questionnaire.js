import get from "lodash.get";
import {isEmpty, isNil} from "ramda";

import {INITIALIZE_ANSWERS, SET_ANSWERS} from "../actions/questionnaire";

function questions (questionnaire) {
    return questionnaire.questions.map(question => {
        return {
            id: question.id,
            text: question.text
        };
    });
}

function answers ({answers, questionnaire, selectedAnswer, questionIndex}, state) {
    return questionnaire.questions.map((question, index) => {
        const selectedAnswerInCollection = get(answers, `answers[${index}]`) || {};
        if (
            isEmpty(selectedAnswerInCollection) &&
            isNil(selectedAnswer)
        ) {
            return {};
        }
        if (index !== questionIndex) {
            return state.answers[index] || selectedAnswerInCollection;
        }
        return {
            id: question.id,
            timestamp: new Date().toISOString(),
            answer: selectedAnswer
        };
    });
}

export default function questionnaire (state = null, {type, payload}) {
    switch (type) {
        case INITIALIZE_ANSWERS: {
            const {questionnaire} = payload;
            return {
                type: questionnaire.type,
                category: questionnaire.category,
                questions: questions(questionnaire),
                answers: []
            };
        }
        case SET_ANSWERS:
            return {
                answers: answers(payload, state)
            };
        default:
            return state;
    }
}
