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

    it("renders a Text Component with `fontSize`", () => {
        const customStyle = {
            fontSize: 10
        };
        const text = shallow(
            <TextLato
                style={customStyle}
            />
        );
        expect(text.find(Text).prop("style")).to.deep.equal([{fontFamily: "lato"}, {fontSize: 10}, {fontSize:  11.95}]);
    });

    it("renders a Text Component without `fontSize`", () => {
        const customStyle = {};
        const text = shallow(
            <TextLato
                style={customStyle}
            />
        );
        expect(text.find(Text).prop("style")).to.deep.equal([{fontFamily: "lato"}, {}, {}]);
    });

    describe("getCorrectFontSizeForScreen", () => {
        const getCorrectFontSizeForScreen = TextLato.prototype.getCorrectFontSizeForScreen;
        const dimensions = {height: 640, width: 320};
        const currentFont = 10;

        it("return different fontSize [CASE: (factor<=1)]", () => {
            const devRatio = 1;

            const result = getCorrectFontSizeForScreen(currentFont, dimensions.height, dimensions.width, devRatio);
            expect(result).to.equal(9.1);
        });

        it("return different fontSize [CASE: ((factor>=1) && (factor<=1.6))]", () => {
            const devRatio = 1.5;

            const result = getCorrectFontSizeForScreen(currentFont, dimensions.height, dimensions.width, devRatio);
            expect(result).to.equal(9.7);
        });

        it("return different fontSize [CASE: ((factor>=1.6) && (factor<=2))]", () => {
            const devRatio = 2;

            const result = getCorrectFontSizeForScreen(currentFont, dimensions.height, dimensions.width, devRatio);
            expect(result).to.equal(10);
        });

        it("return different fontSize [CASE: ((factor>=2) && (factor<=3))]", () => {
            const devRatio = 2.5;

            const result = getCorrectFontSizeForScreen(currentFont, dimensions.height, dimensions.width, devRatio);
            expect(result).to.equal(11.95);
        });

        it("return different fontSize [CASE: (factor>=3)]", () => {
            const devRatio = 4;

            const result = getCorrectFontSizeForScreen(currentFont, dimensions.height, dimensions.width, devRatio);
            expect(result).to.equal(13);
        });
    });

});
