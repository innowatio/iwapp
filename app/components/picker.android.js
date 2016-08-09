import React, {Component, PropTypes} from "react";
import {StyleSheet, TimePickerAndroid, TouchableWithoutFeedback, View} from "react-native";

import * as colors from "../lib/colors";
import Text from "./text-lato";

const styles = StyleSheet.create({
    pickerWrp: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    text: {
        color: colors.textGrey
    }
});

export default class TimePicker extends Component {

    static propTypes = {
        onDateChange: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);
        this.state = {
            isoFormatText: "Imposta"
        };
    }

    setformatTime (hour, minute) {
        return hour + ":" + (minute < 10 ? "0" + minute : minute);
    }

    async showPicker (stateKey, options) {
        try {
            const {action, minute, hour} = await TimePickerAndroid.open(options);
            var newState = {};
            if (action === TimePickerAndroid.timeSetAction) {
                newState[stateKey + "Text"] = ::this.setformatTime (hour, minute);
                newState[stateKey + "Size"] = 22;
                newState[stateKey + "Hour"] = hour;
                newState[stateKey + "Minute"] = minute;
                this.props.onDateChange(new Date(`2016-01-01T${hour}:${minute}:00Z`));
            } else if (action === TimePickerAndroid.dismissedAction) {
                newState[stateKey + "Text"] = "non impostato";
                newState[stateKey + "Size"] = 16;
            }
            this.setState(newState);
        } catch ({code, message}) {
            console.warn(`Error in example "${stateKey}": `, message);
        }
    }

    render () {
        return (
            <View style={styles.pickerWrp}>
                <View key={"start"} style={styles.picker}>
                    <TouchableWithoutFeedback
                        onPress={() => ::this.showPicker("isoFormat", {
                            hour: this.state.isoFormatHour,
                            minute: this.state.isoFormatMinute,
                            is24Hour: true,
                        })}
                    >
                        <View>
                            <Text style={[styles.text, {fontSize: this.state.isoFormatSize}]}>
                                {this.state.isoFormatText}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}


// <View key={"end"} style={styles.picker}>
//     <TouchableWithoutFeedback
//         onPress={() => ::this.showPicker("isoFormatEnd", {
//             endHour: this.state.isoFormatEndHour,
//             endMinute: this.state.isoFormatEndMinute,
//             is24Hour: true,
//         })}
//     >
//         <View>
//             <Text style={[styles.text, {fontSize: this.state.isoFormatEndSize}]}>
//                 {this.state.isoFormatEndText}
//             </Text>
//         </View>
//     </TouchableWithoutFeedback>
// </View>
