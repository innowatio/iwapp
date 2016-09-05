import {shallow} from "enzyme";
import {StyleSheet, Text} from "react-native";

import TextLato from "components/text-lato";

describe("`TextLato` components", () => {

    it("renders a Text Component", () => {
        const text = shallow(<TextLato />);
        expect(text.find(Text)).to.have.length(1);
    });

    it("renders a Text Component with `fontFamily` lato", () => {
        const text = shallow(
            <TextLato />
    );
        expect(text.find(Text).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {}, {}]);
    });

    it("renders a Text Component with `fontFamily` lato and custom style [CASE: style created with StyleSheet]", () => {
        const customStyle = StyleSheet.create({
            width: 100,
            height: 200
        });
        const text = shallow(
            <TextLato
                style={customStyle}
            />
        );
        expect(text.find(Text).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {
            width: 100,
            height: 200
        }, {}]);
    });

    it("renders a Text Component with `fontFamily` lato and custom style [CASE: style is a plain object]", () => {
        const customStyle = {
            width: 100,
            height: 200
        };
        const text = shallow(
            <TextLato
                style={customStyle}
            />
        );
        expect(text.find(Text).prop("style")).to.deep.equal([{
            fontFamily: "lato"
        }, {
            width: 100,
            height: 200
        }, {}]);
    });

});
