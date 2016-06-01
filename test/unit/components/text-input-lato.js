import {shallow} from "enzyme";
import {StyleSheet, TextInput} from "react-native";

import TextInputLato from "components/text-input-lato";

describe("`TextInputLato` components", () => {

    it("renders a TextInput Component", () => {
        const text = shallow(<TextInputLato />);
        expect(text.find(TextInput)).to.have.length(1);
    });

    it("renders a TextInput Component with `fontFamily` lato", () => {
        const text = shallow(
            <TextInputLato />
    );
        expect(text.find(TextInput).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {}]);
    });

    it("renders a TextInput Component with `fontFamily` lato and custom style [CASE: style created with StyleSheet]", () => {
        const customStyle = StyleSheet.create({
            width: 100,
            height: 200
        });
        const text = shallow(
            <TextInputLato
                style={customStyle}
            />
        );
        expect(text.find(TextInput).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {
            width: 100,
            height: 200
        }]);
    });

    it("renders a TextInput Component with `fontFamily` lato and custom style [CASE: style is a plain object]", () => {
        const customStyle = {
            width: 100,
            height: 200
        };
        const text = shallow(
            <TextInputLato
                style={customStyle}
            />
        );
        expect(text.find(TextInput).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {
            width: 100,
            height: 200
        }]);
    });

});
