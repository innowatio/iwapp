import axios from "axios";
import nock from "nock";

import {
    SAVE_SURVEY_START,
    SAVE_SURVEY_SUCCESS,
    SAVE_SURVEY_ERROR,
    saveSurveyAnswers
} from "actions/survey";
import axiosLib, {AxiosError} from "lib/axios";

describe("`survey` actions", () => {

    describe("`saveSurveyAnswers` function", () => {

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

        const surveyInfo = {
            questionId: "surveyId",
            type: "type",
            category: "category"
        };

        const answers = [{
            id: 1,
            answer: "first answer",
            timestamp: "2016-07-15T08:45:34.066Z",
            question: {
                text: "first question",
                category: "category 1"
            }
        }, {
            id: 2,
            answer: "second answer",
            timestamp: "2016-07-15T08:46:34.066Z",
            question: {
                text: "second question",
                category: "category 2"
            }
        }];

        const userId = "userId";
        const visitId = "visitId";

        const expectedBody = {
            userId,
            ...surveyInfo,
            answers,
            visitId
        };


        it("dispatches a SAVE_SURVEY_START action right away", async function () {
            this.timeout(5000);
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            const dispatchFirstCall = dispatch.getCall(0);
            expect(dispatchFirstCall.args[0]).to.deep.equal({
                type: SAVE_SURVEY_START,
                payload: "surveyId"
            });
        });

        it("makes post request to save the answers of the survey", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(201, {result: "OK"});
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            scope.done();
        });

        it("dispatches a SAVE_SURVEY_SUCCESS action on save request success", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(201, {result: "OK"});
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_SURVEY_SUCCESS
            });
        });

        it("dispatches a SAVE_SURVEY_ERROR action on save request error [CASE: http request error]", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .replyWithError("Request error");
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_SURVEY_ERROR,
                errorMessage: sinon.match.instanceOf(AxiosError),
                error: true

            });
        });

        it("dispatches a SAVE_SURVEY_ERROR action on shorten request error [CASE: http response error]", async () => {
            const scope = nock(WRITE_API_ENDPOINT)
            .post("/answers", expectedBody)
            .reply(400, "Bad request");
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            scope.done();
            expect(dispatch).to.have.been.calledWithExactly({
                type: SAVE_SURVEY_ERROR,
                errorMessage: sinon.match.instanceOf(AxiosError),
                error: true
            });
        });

        it("doesn't dispatch a SAVE_SURVEY_ERROR action on dispatch errors", async () => {
            const dispatch = sinon.stub().throws(
                new Error("Error message")
            );
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            expect(dispatch).to.have.callCount(1);
            expect(dispatch).to.have.been.calledWith({
                type: SAVE_SURVEY_START,
                payload: "surveyId",

            });
        });

        it("logs dispatch errors", async () => {
            const dispatch = sinon.stub().throws(
                new Error("Error message")
            );
            await saveSurveyAnswers(surveyInfo, answers, userId, visitId)(dispatch);
            expect(console.error).to.have.callCount(1);
            const error = console.error.getCall(0).args[0];
            expect(error.message).to.equal("Error message");
        });

    });

});
