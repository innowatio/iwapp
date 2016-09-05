import React, {cloneElement, Component, PropTypes} from "react";
import {Dimensions, Text, PixelRatio} from "react-native";

import getStyle from "../lib/get-style";

export default class TextLato extends Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.array
        ])
    }

    getCorrectFontSizeForScreen (currentFont) {
        const {height, width} = Dimensions.get("window");

        let devRatio = PixelRatio.get();
        let factor = (((width*devRatio)/320)+((height*devRatio)/640))/2.0;
        let maxFontDifferFactor = 3; //the maximum pixels of font size we can go up or down

        if (factor<=1) {
            return currentFont-((maxFontDifferFactor*0.3) || 0);
        } else if ((factor>=1) && (factor<=1.6)) {
            return currentFont-((maxFontDifferFactor*0.1) || 0);
        } else if ((factor>=1.6) && (factor<=2)) {
            return currentFont;
        } else if ((factor>=2) && (factor<=3)) {
            return currentFont+((maxFontDifferFactor*0.65) || 0);
        } else if (factor>=3) {
            return currentFont+(maxFontDifferFactor || 0);
        }
    }

    render () {
        const fontSize = getStyle(this.props.style).fontSize;
        const text = (
            <Text {...this.props}/>
        );
        console.log("CACCA");
        console.log(Dimensions.get("window"));
        return cloneElement(text, {
            style: [{
                fontFamily: "lato"
            }, getStyle(this.props.style), fontSize ? {fontSize: this.getCorrectFontSizeForScreen(fontSize)} : {}]
        });
    }
}
