import React, {cloneElement, Component, PropTypes} from "react";
import {Text} from "react-native";

export default class TextLato extends Component {

    static propTypes = {
        style: PropTypes.object
    }

    render () {
        const text = (
            <Text {...this.props}/>
        );
        return cloneElement(text, {
            style: {
                fontFamily: "lato",
                ...this.props.style
            }
        });
    }

}
