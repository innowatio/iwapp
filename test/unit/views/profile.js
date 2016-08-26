import {shallow} from "enzyme";
import {fromJS} from "immutable";
import * as Progress from "react-native-progress";
import {spy} from "sinon";

import QuestionnaireProgress from "components/questionnaire-progress";
import Profile from "views/profile";

describe("`Profile` view", () => {

    const asteroid =  () => {
        return {
            then: () => {
                return {
                    getUserInfo: sinon.stub().returns({
                        username: "user",
                        mail: ["user@email.com"],
                        givenName: ["user1"]
                    })
                };
            }
        };
    };
    const collections = fromJS({});
    const site = {_id: "32"};

    const showImagePickerSpy = spy();
    const ProfileView = Profile.__get__("Profile");
    var profile;

    before(() => {
        Profile.__Rewire__("ImagePicker", {showImagePicker: showImagePickerSpy});
    });

    beforeEach(() => {
        profile = shallow(
            <ProfileView
                asteroid={asteroid}
                collections={collections}
                site={site}
            />);
    });

    after(() => {
        Profile.__ResetDependency__("showImagePicker");
    });

    describe("the `countAnswersByCategoryTypeAndSiteId` method", () => {

        it("returns the correct value", () => {

            const countAnswersByCategoryTypeAndSiteId = ProfileView.prototype.countAnswersByCategoryTypeAndSiteId;
            const category = "building";
            const type = "questionnaire";
            const siteId = "32";

            const answersCollection = fromJS({
                "questionnaire-cooling-32": {
                    _id: "questionnaire-cooling-32",
                    answers: [
                        {id: 4}
                    ],
                    category: "cooling",
                    type: "questionnaire"
                },
                "questionnaire-building-32": {
                    _id: "questionnaire-building-32",
                    answers: [
                        {id: 5},
                        {id: 2},
                        {id: 5},
                        {id: 1},
                    ],
                    category: "building",
                    type: "questionnaire"
                },
                "questionnaire-cooling-329": {
                    _id: "questionnaire-cooling-329",
                    answers: [
                        {id: 2},
                        {id: 5},
                    ],
                    category: "cooling",
                    type: "questionnaire"
                }
            });

            expect(3).to.equal(countAnswersByCategoryTypeAndSiteId(answersCollection, category, type, siteId));
        });
    });

    describe("the `countQuestionsByCategoryAndType` method", () => {

        it("returns the correct value", () => {

            const countQuestionsByCategoryAndType = ProfileView.prototype.countQuestionsByCategoryAndType;
            const category = "cooling";
            const type = "questionnaire";
            const siteId = "32";

            const questionsCollection = fromJS({
                "id-question1": {
                    _id: "questionnaire-cooling-32",
                    category: "cooling",
                    type: "questionnaire",
                    questions: [{}, {}, {}]
                },
                "id-question2": {
                    _id: "questionnaire-building-32",
                    category: "building",
                    type: "questionnaire",
                    questions: [{}, {}]
                },
                "id-question3": {
                    _id: "questionnaire-cooling-32",
                    category: "cooling",
                    type: "survey",
                    questions: [{}]
                }
            });

            expect(3).to.equal(countQuestionsByCategoryAndType(questionsCollection, category, type, siteId));
        });
    });

    describe("the `questionnaires status` box", () => {

        it("renders the `completed percentage` bar", () => {
            expect(profile.find(Progress.Bar)).to.have.length(1);
        });

        it("renders five `QuestionnaireProgress` buttons", () => {
            expect(profile.find(QuestionnaireProgress)).to.have.length(5);
        });
    });

    describe("the `user information` box", () => {

        it("renders the `user image`", () => {
            expect(profile.find(".userImage")).to.have.length(1);
        });

        // it("on click on `user image` calls the `showImagePicker` method", () => {
        //     profile.find(".userImage").simulate("press");
        //     expect(showImagePickerSpy).to.have.property("callCount", 1);
        // });
    });
});
