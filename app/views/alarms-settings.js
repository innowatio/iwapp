import {contains} from "ramda";
import React, {Component} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import {Content} from "native-base";
import Button from "react-native-button";

import Icon from "../components/iwapp-icons";
import DefaultModal from "../components/modal";
import TimePicker from "../components/picker";
import RangeSlider from "../components/slider";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    },
    titleBarWrp: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        backgroundColor: colors.secondaryBlue
    },
    title: {
        fontWeight: "bold",
        color: colors.white
    },
    tabsContainer: {
        paddingVertical: 5,
        backgroundColor: colors.secondaryBlue,
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 0.5,
        borderStyle: "solid",
        borderTopColor: colors.white
    },
    tabWrpActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.buttonPrimary
    },
    tabTitle: {
        color: colors.white
    },

    alarmsContainer: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: "wrap"
    },
    alarmWrp: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightGrey
    },
    alarmIcon: {
        borderRadius: 100,
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center"
    },
    alarmTextWrp: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    alarmText: {
        fontSize: 14,
        color: colors.textGrey
    },
    alarmValue: {
        color: colors.textGrey,
        fontSize: 14,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    alarmDay: {
        color: colors.textGrey,
        fontSize: 12,
        fontStyle: "italic"
    },

    weekdayWrp: {
        marginVertical: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopWidth: .5,
        borderBottomWidth: .5,
        borderColor: colors.lightGrey
    },
    buttonWeekdayWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:  "space-around"
    },
    buttonWeekday: {
        borderRadius: 50,
        height: 30,
        width: 30,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondaryBlue
    },
    buttonWeekdayActive: {
        borderRadius: 50,
        height: 30,
        width: 30,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.buttonPrimary
    },
    buttonWeekdayText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "normal"
    },
    modalLabelSection: {
        fontSize: 16,
        color: colors.textGrey,
        textAlign: "center",
        marginBottom: 10
    },

    pickerWrp: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    thresholdWrp: {
        marginBottom: 20,
        paddingBottom: 10,
        paddingHorizontal: 20,
        borderBottomWidth: .5,
        borderColor: colors.lightGrey
    },
    threshold: {
        marginVertical: 10
    },
    thresholdTextWrp: {
        flexDirection: "row",
        alignItems: "center",
        height: 20,
        overflow: "hidden",
        justifyContent: "space-between"
    },
    thresholdText: {
        color: colors.textGrey,
        fontSize: 11
    }
});

export default class AlarmsSettings extends Component {

    constructor (props) {
        super(props);
        this.state = {
            dateEnd: new Date(),
            dateStart: new Date(),
            option: "SETTINGS",
            modalVisible: false,
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
        };
    }

    onDateChangeStart (date) {
        console.log(date);
        this.setState({dateStart: date});
    }

    onDateChangeEnd (date) {
        this.setState({dateEnd: date});
    }

    getButtonStyle (buttonType) {
        if (this.state.option === buttonType) {
            return styles.tabWrpActive;
        } else {
            return {};
        }
    }

    setTabState (tab) {
        this.setState({option: tab});
    }

    setModalVisible (visible) {
        this.setState({modalVisible: visible});
    }

    setAlarmTime (hours) {
        this.setState({alarmTime: hours});
    }

    getAlarm () {
        return [
            {
                bgcolor: colors.alarmDailyEnergy,
                key: "Soglia giornaliera",
                icon: "iw-daily",
                text: "Soglia energia giornaliera",
                value: "48",
                unit: "kWh"
            },
            {
                bgcolor: colors.alarmMonthlyEnergy,
                key: "Soglia mensile",
                icon: "iw-monthly",
                text: "Soglia energia mensile",
                value: "186",
                unit: "kWh"
            },
            {
                bgcolor: colors.alarmInstantPower,
                key: "Potenza istantanea",
                icon: "iw-power",
                text: "Potenza istantanea da impostare",
                value: "",
                unit: ""
            }

        ];
    }

    getNotification () {
        return [
            {
                bgcolor: colors.alarmDailyEnergy,
                key: "Soglia giornaliera",
                icon: "iw-daily",
                text: "Soglia giornaliera superata",
                day: "26 giugno 2016"
            },
            {
                bgcolor: colors.alarmMonthlyEnergy,
                key: "Soglia mensile",
                icon: "iw-monthly",
                text: "Soglia mensile superata",
                day: "26 giugno 2016"
            },
            {
                bgcolor: colors.alarmInstantPower,
                key: "Potenza istantanea",
                icon: "iw-power",
                text: "Potenza istantanea risolto",
                day: "26 giugno 2016"
            },
            {
                bgcolor: colors.alarmSolvedInstantPower,
                key: "Potenza istantanea risolta",
                icon: "iw-power",
                text: "Potenza istantanea superata",
                day: "26 giugno 2016"
            }
        ];
    }

    getWeekDays () {
        return [
            {
                label: "L",
                key: "lunedì"
            },
            {
                label: "M",
                key: "martedì"
            },
            {
                label: "M",
                key: "mercoledì"
            },
            {
                label: "G",
                key: "giovedì"
            },
            {
                label: "V",
                key: "venerdì"
            },
            {
                label: "S",
                key: "sabato"
            },
            {
                label: "D",
                key: "domenica"
            }
        ];
    }

    alarmInstantPowerText (alarm) {
        return alarm.value ? colors.textGrey : colors.grey;
    }

    isExceeded (alarm) {
        return alarm.value ? (
            alarm.value
        ) : (
            <Text style={styles.alarmValue}>
                <Icon
                    color={colors.alarmExceeded}
                    name={"iw-alert"}
                    size={25}
                    style={{backgroundColor: colors.transparent}}
                />
            </Text>
        );
    }

    returnModalChildren () {
        return (
            <View>
                {this.renderTimePickers()}
                <View style={styles.weekdayWrp}>
                    <Text style={styles.modalLabelSection}>{"Ripetizione"}</Text>
                    <View style={styles.buttonWeekdayWrp}>
                        {this.getWeekDays().map(::this.renderRepetition)}
                    </View>
                </View>
                <View style={styles.thresholdWrp}>
                    <Text style={styles.modalLabelSection}>{"Imposta la soglia massima"}</Text>
                    <View style={styles.threshold}>
                        {this.renderThreshold()}
                    </View>
                </View>
            </View>
        );
    }

    renderTimePickers () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.pickerWrp}>
                <View key={"start"} style={[styles.picker, {width: width * .4}]}>
                    <Text style={styles.modalLabelSection}>{"Inizio"}</Text>
                    <TimePicker
                        date={this.state.dateStart}
                        minuteInterval={5}
                        mode="time"
                        onDateChange={::this.onDateChangeStart}
                        selectedValue={this.state.alarmTimes}
                        timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
                    />
                </View>
                <View key={"end"} style={[styles.picker, {width: width * .4}]}>
                    <Text style={styles.modalLabelSection}>{"Fine"}</Text>
                    <TimePicker
                        date={this.state.dateEnd}
                        minuteInterval={5}
                        mode="time"
                        onDateChange={::this.onDateChangeEnd}
                        selectedValue={this.state.alarmTimes}
                        timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
                    />
                </View>
            </View>
        );
    }

    renderRepetition (weekday) {
        return (
            <Button
                containerStyle={contains(weekday.key, ["martedì", "giovedì"]) ? styles.buttonWeekdayActive : styles.buttonWeekday}
                key={weekday.key}
                style={styles.buttonWeekdayText}
            >
                {weekday.label}
            </Button>
        );
    }

    renderThreshold () {
        return (
            <View>
                <RangeSlider />
                <View style={styles.thresholdTextWrp}>
                    <Text style={styles.thresholdText}>{"0 kW"}</Text>
                    <Text style={styles.thresholdText}>{"100 kW"}</Text>
                </View>
            </View>
        );
    }

    renderModal () {
        return (
            <DefaultModal
                modalButtons={true}
                modalTitle={"Imposta allarme"}
                onRequestClose={() => ::this.setModalVisible(false)}
                transparent={true}
                visible={this.state.modalVisible}
            >
                {this.returnModalChildren()}
            </DefaultModal>
        );
    }

    renderAlarmsSettings (alarm) {
        const {width} = Dimensions.get("window");
        return (
            <TouchableOpacity
                key={alarm.key}
                onPress={() => ::this.setModalVisible(true)}
                style={[styles.alarmWrp, {width: width}]}
            >
                <View key={alarm.key} style={{width: width * 0.16}}>
                    <View style={[styles.alarmIcon, {backgroundColor: alarm.bgcolor}]}>
                        <Icon
                            color={colors.iconWhite}
                            name={alarm.icon}
                            size={40}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </View>
                </View>
                <View style={[styles.alarmTextWrp, {width: width * 0.74}]}>
                    <Text style={[styles.alarmText, {color: this.alarmInstantPowerText(alarm)}]}>
                        {alarm.text}
                    </Text>
                    <Text style={styles.alarmValue}>
                        {alarm.unit}{" "}
                        {this.isExceeded(alarm)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderAlarmsNotifications (notification) {
        const {width} = Dimensions.get("window");
        return (
            <View key={notification.key} style={[styles.alarmWrp, {width: width}]}>
                <View style={{width: width * 0.16}}>
                    <View style={[styles.alarmIcon, {backgroundColor: notification.bgcolor}]}>
                        <Icon
                            color={colors.iconWhite}
                            name={notification.icon}
                            size={40}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </View>
                </View>
                <View style={{width: width * 0.74}}>
                    <Text style={styles.alarmDay}>
                        {notification.day}
                    </Text>
                    <Text style={styles.alarmText}>
                        {notification.text}
                    </Text>
                </View>
            </View>
        );
    }

    renderTabs () {
        return (
            <View style={styles.tabsContainer}>
                <Button
                    containerStyle={(this.state.option === "SETTINGS" ? styles.tabWrpActive : {})}
                    onPress={() => this.setTabState("SETTINGS")}
                >
                    <Text style={styles.tabTitle}>{"IMPOSTAZIONE"}</Text>
                </Button>
                <Button
                    containerStyle={(this.state.option === "NOTIFY" ? styles.tabWrpActive : {})}
                    onPress={() => this.setTabState("NOTIFY")}
                >
                    <Text style={styles.tabTitle}>{"NOTIFICHE"}</Text>
                </Button>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                {this.renderModal()}
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View>
                        <View style={styles.titleBarWrp}>
                            <Text style={styles.title}>{"ALLARMI"}</Text>
                        </View>
                        {this.renderTabs()}
                    </View>
                    {this.state.option == "SETTINGS" ? (
                        <View style={styles.alarmsContainer}>
                            {this.getAlarm().map(::this.renderAlarmsSettings)}
                        </View>
                    ) : (
                        <View style={styles.alarmsContainer}>
                            {this.getNotification().map(this.renderAlarmsNotifications)}
                        </View>
                    )}
                </Content>
            </View>
        );
    }

}
