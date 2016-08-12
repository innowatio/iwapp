import {shallow} from "enzyme";
import {fromJS} from "immutable";
import * as Progress from "react-native-progress";

import Profile from "views/profile";

describe("`Profile` view", () => {

    const ProfileView = shallow(<Profile />);

    describe("`getAnswersByCategoryTypeAndSiteId`", () => {
        const getAnswersByCategoryTypeAndSiteId = () => ProfileView.prototype.getAnswersByCategoryTypeAndSiteId.call({}, arguments);

        it("returns the correct number of the given answers", () => {
            console.log(Profile);
            // getAnswersByCategoryTypeAndSiteId (answersCollection, category, type, siteId) {
            const category = "building";
            const type = "questionnaire";
            const siteId = "32";

            const answersCollection = fromJS([{
                _id: "questionnaire-cooling-32",
                answers: [
                    {id: 4}
                ],
                category: "cooling",
                type: "questionnaire"
            }, {
                _id: "questionnaire-cooling-32",
                answers: [
                    {id: 5},
                    {id: 2},
                    {id: 5},
                    {id: 1},
                ],
                category: "cooling",
                type: "questionnaire"
            }, {
                _id: "questionnaire-cooling-329",
                answers: [
                    {id: 2},
                    {id: 5},
                ],
                category: "cooling",
                type: "questionnaire"
            }]);
            expect(3).to.equal(getAnswersByCategoryTypeAndSiteId (answersCollection, category, type, siteId));
        });
    });

    describe("renders the `questionnaires status` box", () => {

        // it("renders the `completed percentage` bar", () => {
        //     const profile = shallow(
        //         <Profile
        //             asteroid={asteroid}
        //             collections={collections}
        //             site={site}
        //         />
        //     );
        //     expect(profile.find(Progress.Bar)).to.have.length(1);
        // });
    });
});
