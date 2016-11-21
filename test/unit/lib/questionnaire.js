//import {Actions} from "react-native-router-flux";
import {fromJS} from "immutable";

import {
    roundTwoDecimals,
    getPercentage,
    countQuestionsByCategoryAndType,
    countAnswersByCategoryTypeAndSiteId
} from "lib/questionnaire";
import getQuestionnaireItems from "lib/questionnaire";

import * as colors from "lib/colors";

describe("`questionnaire` library", () => {

    const category = "demographics";
    const type = "questionnaire";
    const siteId = "SitoDiTest1";

    const percentage = 0.33;
    const totalQuestions = 3;
    const totalAnswers = 1;

    const questions =fromJS([
        {
            id:"zTybvqEQeXxauS4Yb",
            type:"questionnaire",
            category:"demographics",
            categoryNumber:1,
            questions:[{id:1}, {id:2}, {id:3}]
        },
        {
            id:"WHD5on5pw3wA4bgfx",
            type:"questionnaire",
            category:"building",
            categoryNumber:2,
            questions:[{id:1}, {id:2}]
        }
    ]);

    const answers = fromJS({
        "questionnaire-demographics-SitoDiTest1":{
            type:"questionnaire",
            category:"demographics",
            siteId:"SitoDiTest1",
            answers:[{id:2}],
            _id:"questionnaire-demographics-SitoDiTest1"
        },
        "questionnaire-building-SitoDiTest1":{
            type:"questionnaire",
            category:"building",
            siteId:"SitoDiTest1",
            answers:[{id:1}, {id:2}],
            _id:"questionnaire-building-SitoDiTest1"
        }
    });

    describe("`roundTwoDecimals` method", () => {
        it("returns the correct number", () => {
            const number = 0.1234;
            const ret = roundTwoDecimals(number);
            expect(ret).to.equal(0.12);
        });
    });

    describe("`getPercentage`method", () => {
        const expected = {percentage, totalQuestions, totalAnswers};
        const defaultExpected = {percentage:0, totalQuestions:0, totalAnswers:0};

        it("calls the `getPercentage` with the correct argument ", () => {
            const ret = getPercentage(questions, answers, category, type, siteId);
            expect(ret).to.deep.equal(expected);
        });

        it("calls the `getPercentage` with question undefined ", () => {
            const ret = getPercentage(null, answers, category, type, siteId);
            expect(ret).to.deep.equal(defaultExpected);
        });

    });

    describe("the `countQuestionsByCategoryAndType` method", () => {
        it("returns the correct value", () => {
            const ret = countQuestionsByCategoryAndType(questions, category, type, siteId);
            expect(ret).to.equal(3);
        });
    });

    describe("the `countAnswersByCategoryTypeAndSiteId` method", () => {
        it("returns the correct value", () => {
            const ret = countAnswersByCategoryTypeAndSiteId(answers, category, type, siteId);
            expect(ret).to.equal(1);
        });
    });

    describe("the `getQuestionnaireItems` method", () => {
        const demographics = {
            color: colors.demographicsSection,
            name: "Demographics",
            key: "demographics",
            icon: "iw-demographics"
        };

        const buildings = {
            color: colors.buildingsSection,
            name: "Building",
            key: "building",
            icon: "iw-buildings"
        };

        const getQuestionnairesDecorator= sinon.stub().returns([demographics, buildings]);

        before(() => {
            getQuestionnaireItems.__Rewire__("getQuestionnairesDecorator", getQuestionnairesDecorator);
        });

        after(() => {
            getQuestionnaireItems.__ResetDependency__("getQuestionnairesDecorator");
        });

        beforeEach(() => {
            getQuestionnairesDecorator.reset();
        });

        it("returns the values with the correct properties", () => {
            const ret = getQuestionnaireItems(questions, answers, siteId);
            expect(getQuestionnairesDecorator).to.have.callCount(1);
            expect(ret).to.be.a("array");
            ret.forEach(value => {
                expect(value).to.have.property("color");
                expect(value).to.have.property("icon");
                expect(value).to.have.property("key");
                expect(value).to.have.property("name");
                expect(value).to.have.property("text");
                expect(value).to.have.property("totalAnswers");
                expect(value).to.have.property("totalQuestions");
                expect(value).to.have.property("value");
            });
        });

/*
        const expected = [
            {
                ...demographics,
                color: "#536DFE",
                onPress: () => Actions.questionnaire({selectedQuestionnaire: demographics}),
                text: "33% completato",
                totalAnswers: 1,
                totalQuestions: 3,
                value: 0.33
            }, {
                ...buildings,
                color: "#3E50B4",
                onPress: () => Actions.questionnaire({selectedQuestionnaire: buildings}),
                text: "100% completato",
                totalAnswers: 2,
                totalQuestions: 2,
                value: 1
            }
        ];

        it("returns the correct value", () => {
            const ret = getQuestionnaireItems(questions, answers, siteId);
            expect(getQuestionnairesDecorator).to.have.callCount(1);
            expect(ret).to.be.a("array");
            expect(ret).to.deep.equal(expected);
        });
*/
    });

});
