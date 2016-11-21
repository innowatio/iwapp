import {List, Map} from "immutable";
import {uniq} from "ramda";

import * as colors from "../lib/colors";

export function getQuestionnairesDecorator () {
    return [
        {color: colors.demographicsSection, name: "Demographics", key: "demographics", icon: "iw-demographics"},
        {color: colors.buildingsSection, name: "Building", key: "building", icon: "iw-buildings"},
        {color: colors.heatingSection, name: "Heating", key: "heating", icon: "iw-heating"},
        {color: colors.coolingSection, name: "Cooling", key: "cooling", icon: "iw-cooling"},
        {color: colors.statisticsSection, name: "Statistics", key: "behavioural", icon: "iw-statistics"}
    ];
}

export function roundTwoDecimals (number) {
    return Math.round((number) * 100) / 100;
}

export function getPercentage (questions, answers, category, type, siteId) {
    if (!questions) {
        return {percentage: 0, totalQuestions: 0, totalAnswers: 0};
    }
    const totalQuestions = countQuestionsByCategoryAndType(questions, category, type);
    const totalAnswers = countAnswersByCategoryTypeAndSiteId(answers, category, type, siteId);
    const percentage = roundTwoDecimals(totalAnswers / totalQuestions);
    return {percentage, totalQuestions, totalAnswers};
}

export function countQuestionsByCategoryAndType (questionsCollection, category, type) {

    const questions = questionsCollection.find((question) => {
        return question.get("type") === type && question.get("category") === category;
    }) || Map({questions: []});
    return questions.get("questions").size || 0;
}

export function countAnswersByCategoryTypeAndSiteId (answersCollection, category, type, siteId) {
    const key = `${type}-${category}-${siteId}`;
    const answers = answersCollection.getIn([key, "answers"]) || List();
    return uniq(answers.map((answer) => {
        return answer.get("id");
    }).toJS()).length;
}

export default function getQuestionnaireItems (questions, answers, siteId) {
    const questionnaireDecorator = getQuestionnairesDecorator();
    return questionnaireDecorator.map(questionnaire => {
        const {percentage, totalQuestions, totalAnswers} = getPercentage(questions, answers, questionnaire.key, "questionnaire", siteId);
        return {
            ...questionnaire,
            value: percentage || 0,
            totalQuestions,
            totalAnswers,
            text: ((percentage || 0) * 100).toFixed() + "% completato"
        };
    });
}
