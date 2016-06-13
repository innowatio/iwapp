import React, {cloneElement, Component, PropTypes} from "react";
import {Text} from "react-native";

import getStyle from "../lib/get-style";

export default class TextLato extends Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number,
            PropTypes.array
        ])
    }

    render () {
        const text = (
            <Text {...this.props}/>
        );
        return cloneElement(text, {
            style: [{
                fontFamily: "lato"
            }, getStyle(this.props.style)]
        });
    }
}
