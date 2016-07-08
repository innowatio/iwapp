import React, {Component} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import {Content} from "native-base";
import Button from "react-native-button";

import Icon from "../components/iwapp-icons";
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
        justifyContent: "space-between"
    },
    alarmText: {
        color: colors.textGrey,
        fontSize: 15
    },
    alarmValue: {
        color: colors.textGrey,
        fontSize: 14,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    },
    alarmDay: {
        color: colors.textGrey,
        fontSize: 12,
        fontStyle: "italic"
    }
});

export default class AlarmsSettings extends Component {

    constructor (props) {
        super(props);
        this.state = {
            option: "SETTINGS"
        };
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

    getAlarm () {
        return [
            {
                bgcolor: colors.alarmDailyEnergy,
                key: "Soglia giornaliera",
                icon: "iw-daily",
                text: "Soglia energia giornaliera",
                value: "kWh 48",
                unit: "kWh"
            },
            {
                bgcolor: colors.alarmMonthlyEnergy,
                key: "Soglia mensile",
                icon: "iw-monthly",
                text: "Soglia energia mensile",
                value: "kWh 186",
                unit: "kWh"
            },
            {
                bgcolor: colors.alarmInstantPower,
                key: "Potenza istantanea",
                icon: "iw-power",
                text: "Soglia potenza istantanea",
                value: "kW",
                unit: "kW"
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

    renderAlarmsSettings (alarm) {
        const {width} = Dimensions.get("window");
        return (
            <View key={alarm.key} style={[styles.alarmWrp, {width: width}]}>
                <View style={{width: width * 0.16}}>
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
                    <Text style={styles.alarmText}>
                        {alarm.text}
                    </Text>
                    <Text style={styles.alarmValue}>
                        {alarm.value}
                    </Text>
                </View>
            </View>
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
                <Button containerStyle={(this.state.option === "SETTINGS" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("SETTINGS")}>
                    <Text style={styles.tabTitle}>{"IMPOSTAZIONE"}</Text>
                </Button>
                <Button containerStyle={(this.state.option === "NOTIFY" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("NOTIFY")}>
                    <Text style={styles.tabTitle}>{"NOTIFICHE"}</Text>
                </Button>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View>
                        <View style={styles.titleBarWrp}>
                            <Text style={styles.title}>{"ALLARMI"}</Text>
                        </View>
                        {this.renderTabs()}
                    </View>
                    {this.state.option == "SETTINGS" ? (
                        <View style={styles.alarmsContainer}>
                            {this.getAlarm().map(this.renderAlarmsSettings)}
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
