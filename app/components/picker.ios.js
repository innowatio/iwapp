import React, {Component} from "react";
import {DatePickerIOS} from "react-native";


export default class TimePicker extends Component {
    render () {
        return (
            <DatePickerIOS
                {...this.props}
            />
        );
    }
}
