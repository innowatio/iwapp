import {fromJS} from "immutable";
import {shallow} from "enzyme";

import Questionnaire from "views/questionnaire";
import QuestionnaireProgress from "components/questionnaire-progress";

describe("`Questionnaire` view", () => {

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
    const site = fromJS({
        _id:"id"
    });

    const QuestionnaireView = Questionnaire.__get__("Questionnaire");
    var questionnaire;

    beforeEach(() => {
        questionnaire = shallow(
            <QuestionnaireView
                asteroid={asteroid}
                collections={collections}
                site={site}
            />);
    });

    after(() => {
        Questionnaire.__ResetDependency__("showImagePicker");
    });

    describe("the `questionnaires status` box", () => {

        it("renders five `QuestionnaireProgress` buttons", () => {
            expect(questionnaire.find(QuestionnaireProgress)).to.have.length(1);
        });
    });

});
