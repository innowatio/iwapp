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
    const questionnaireState ={
        status:[
            {value:0.33},
            {value:0.5},
            {value:0},
            {value:0},
            {value:0}
        ]};

    const showImagePickerSpy = spy();
    const user = {};
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
                questionnaireState={questionnaireState}
                site={site}
                user={user}
            />);
    });

    after(() => {
        Profile.__ResetDependency__("showImagePicker");
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
