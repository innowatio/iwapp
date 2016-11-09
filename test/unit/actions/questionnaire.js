import axios from "axios";
import nock from "nock";

import {saveQuestionnaireAnswers, questionnaireStatus} from "actions/questionnaire";
import {SAVE_QUESTIONNAIRE_SUCCESS, SAVE_QUESTIONNAIRE_START, SAVE_QUESTIONNAIRE_ERROR, QUESTIONNAIRE_STATUS} from "actions/questionnaire";
import axiosLib, {AxiosError} from "lib/axios";

describe("`questionnaire` actions", () => {

    describe("`saveQuestionnaireAnswers` action", () => {
        const dispatch = sinon.spy();
        const WRITE_API_ENDPOINT = "http://iwwa-write-endpoint.com";
        const axiosInstance = axios.create({
            baseURL: WRITE_API_ENDPOINT,
            timeout: 5000
        });

        beforeEach(() => {
            axiosLib.__Rewire__("axiosInstance", axiosInstance);
            nock.cleanAll();
            sinon.stub(console, "error");
            console.error.reset();
            dispatch.reset();
        });

        afterEach(() => {
            axiosLib.__ResetDependency__("axiosInstance");
            console.error.restore();
        });

        const answers = [{
            id: 1,
            answer: "first answer",
            timestamp: "2016-07-15T08:45:34.066Z",
            question: {
                text: "first question",
                category: "category 1"
            }
        }];

        const questionIndex = 0;

        const questionnaire = {
            _id: "questionnaireId",
            category: "category",
            catgorynumber: 1,
            questions: [
                {
                    id: 1,
                    options:["0", "1", "2"],
                    text: "question text",
                    type: "type"
                }
            ],
            type: "questionnaire"
        };
        const siteId = "siteId";
        const userId = "userId";
        const visitId = "visitId";

        const expectedBody = {
            answers,
            userId,
            siteId,
            questionId: "questionnaireId",
            category: "category",
            type: "questionnaire",
            visitId
        };

        it("dispatches a SAVE_QUESTIONNAIRE_START action right away", async function() {
            this.timeout(5000);
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            const dispatchFirstCall = dispatch.getCall(0);
            expect(dispatchFirstCall.args[0]).to.deep.equal({
                type: SAVE_QUESTIONNAIRE_START
            });
        });

        it("makes post to save the answers of the questionnaire", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(201, {result: "OK"});
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            scope.done();
        });

        it("dispatches a SAVE_QUESTIONNAIRE_SUCCESS action on save request success", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(201, {result: "OK"});
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_QUESTIONNAIRE_SUCCESS,
                payload: {
                    data: {result: "OK"},
                    key:  "category",
                    countAnswers: 1
                }
            });
        });

        it("dispatches a SAVE_QUESTIONNAIRE_ERROR action on save request error [CASE: http request error]", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .replyWithError("Request error");
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_QUESTIONNAIRE_ERROR,
                payload: sinon.match.instanceOf(AxiosError),
                error: true

            });
        });

        it("dispatches a SAVE_QUESTIONNAIRE_ERROR action on shorten request error [CASE: http response error]", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(400, "Bad request");
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_QUESTIONNAIRE_ERROR,
                payload: sinon.match.instanceOf(AxiosError),
                error: true
            });
        });

        it("doesn't dispatch a SAVE_QUESTIONNAIRE_ERROR action on dispatch errors", async () => {
            const dispatch = sinon.stub().throws(
                new Error("Error message")
            );
            await saveQuestionnaireAnswers(answers, questionIndex, userId, siteId, questionnaire, visitId)(dispatch);
            expect(dispatch).to.have.callCount(1);
            expect(dispatch).to.have.been.calledWith({
                type: SAVE_QUESTIONNAIRE_START
            });
        });

        it("logs dispatch errors", async () => {
            const dispatch = sinon.stub().throws(
                new Error("Error message")
            );
            await saveQuestionnaireAnswers(answers, userId, siteId, questionnaire, visitId)(dispatch);
            expect(console.error).to.have.callCount(1);
            const error = console.error.getCall(0).args[0];
            expect(error.message).to.equal("Error message");
        });

    });

    describe("`questionnaireStatus` action", () => {
        const questionnairesItem =[
            {
                color: "color",
                icon: "icon",
                key: "demographics",
                name: "name",
                text: "text",
                totalAnswers: 1,
                totalQuestion: 4,
                value: 0.1
            }
        ];
        it("return a QUESTIONNAIRE_STATUS type right away", () => {
            const ret =questionnaireStatus(questionnairesItem);
            expect(ret).to.deep.equal({
                type: QUESTIONNAIRE_STATUS,
                payload:questionnairesItem
            });
        });

    });
});
