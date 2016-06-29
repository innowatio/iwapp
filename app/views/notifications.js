import React, {Component} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import {Content} from "native-base";

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
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        color: colors.white
    },
    notificationsContainer: {
        marginTop: 20,
        justifyContent: "space-around",
        alignItems: "center"
    },
    notificationWrp: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    notificationIcon: {
        borderRadius: 100,
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    notificationText: {
        color: colors.textGrey,
        fontSize: 13
    },
    notificationDate: {
        color: colors.lightGrey,
        fontSize: 13,
        alignSelf: "flex-end"
    }
});

export default class Notifications extends Component {

    getNotification () {
        return [
            {
                bgcolor: colors.energeticTip,
                date: "Oggi",
                key: "Tips energetico",
                icon: "iw-energetic-tip",
                text: "E’ disponibile il report dei tuoi consumi settimanali."
            },
            {
                bgcolor: colors.alarmsTip,
                date: "Oggi",
                key: "Allarme",
                icon: "iw-alarms-tip",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                bgcolor: colors.welcomeNotification,
                date: "Ieri",
                key: "Notifica benvenuto al pilot",
                icon: "iw-welcome",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                bgcolor: colors.endPilotNotification,
                date: "Ieri",
                key: "Notifica di fine pilot",
                icon: "iw-like",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                bgcolor: colors.badgeNotification,
                date: "Ieri",
                key: "Notifica nuovo badge",
                icon: "iw-badge",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            },
            {
                bgcolor: colors.upgradeNotification,
                date: "Ieri",
                key: "Notifica upgrade",
                icon: "iw-upgrade",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            }
        ];
    }

    renderNotifications (notification) {
        const {width} = Dimensions.get("window");
        return (
            <View key={notification.key} style={styles.notificationWrp}>
                <View style={{width: width * 0.16}}>
                    <View style={[styles.notificationIcon, {backgroundColor: notification.bgcolor}]}>
                        <Icon
                            color={colors.iconWhite}
                            name={notification.icon}
                            size={40}
                        />
                    </View>
                </View>
                <View style={{width: width * 0.74}}>
                    <Text style={styles.notificationText}>
                        {notification.text}
                    </Text>
                    <Text style={styles.notificationDate}>
                        {notification.date}
                    </Text>
                </View>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"NOTIFICHE"}</Text>
                        </View>
                    </View>
                    <View style={styles.notificationsContainer}>
                        {this.getNotification().map(this.renderNotifications)}
                    </View>
                </Content>
            </View>
        );
    }

}
