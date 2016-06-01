import React, {cloneElement, Component, PropTypes} from "react";
import {TextInput} from "react-native";

import getStyle from "../lib/get-style";

export default class TextLato extends Component {

    static propTypes = {
        style: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.number
        ])
    }

    render () {
        const textInput = (
            <TextInput {...this.props}/>
        );
        return cloneElement(textInput, {
            style: [{
                fontFamily: "lato"
            }, getStyle(this.props.style)]
        });
    }

}
