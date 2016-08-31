import {Map} from "immutable";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, ScrollView, View} from "react-native";
import {Content} from "native-base";
import {connect} from "react-redux";
import IPropTypes from "react-immutable-proptypes";
import FaIcons from "react-native-vector-icons/FontAwesome";
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
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        color: colors.white
    },
    containerView: {
        flex: 1,
        paddingBottom: 100
    },
    notificationsContainer: {
        marginVertical: 20,
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
    },

    buttonScrollWrp: {
        position: "absolute",
        height: 30,
        zIndex: 100,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 10,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    buttonScroll: {
        borderRadius: 100,
        height: 30,
        width: 30,
        backgroundColor: colors.primaryBlue,
        justifyContent: "center",
        alignItems: "center"

    }
});

class Notifications extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired
    }

    componentDidMount () {
        this.props.asteroid.subscribe("notifications");
    }

    getNotificationBackgroundColor (type) {
        switch (type) {
            case "alarm":
                return colors.acidGreen;
            case "notification":
                return colors.alarmDailyEnergy;
            case "tip":
                return colors.aquaGreen;
            default:
                return colors.badgeNotification;
        }
    }

    getNotificationIcon (type) {
        switch (type) {
            case "alarm":
                return "iw-alarms-tip";
            case "notification":
                return "iw-like";
            case "tip":
                return "iw-energetic-tip";
            default:
                return "iw-welcome";
        }
    }

    getNotifications () {
        const notifs = this.props.collections.get("notifications") || Map();
        return notifs.map((notification, index) => {
            const type = notification.get("type");
            return {
                key: index,
                text: notification.get("message"),
                icon: this.getNotificationIcon(type),
                bgcolor: this.getNotificationBackgroundColor(type),
                date: notification.get("date")
            };
        }).toArray();
    }

    renderScrollButton () {
        const {height} = Dimensions.get("window");
        return (
            <View style={[styles.buttonScrollWrp, {top: height * .75}]}>
                <Button containerStyle={styles.buttonScroll}>
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-down"}
                        size={20}
                    />
                </Button>
            </View>
        );
    }

    renderNotificationsList () {
        return (
            <View style={styles.containerView}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    key={"scrollView1"}
                    scrollEnabled={true}
                    scrollEventThrottle={6}
                    showsVerticalScrollIndicator={true}
                    style={styles.scrollView}
                >
                    {this.getNotifications().map(this.renderNotification)}
                </ScrollView>
            </View>
        );
    }

    renderNotification (notification) {
        const {width} = Dimensions.get("window");
        return (
            <View key={notification.key} style={styles.notificationWrp}>
                <View style={{width: width * 0.16}}>
                    <View style={[styles.notificationIcon, {backgroundColor: notification.bgcolor}]}>
                        <Icon
                            color={colors.iconWhite}
                            name={notification.icon}
                            size={40}
                            style={{backgroundColor: colors.transparent}}
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
                        {this.renderNotificationsList()}
                    </View>
                </Content>
                {this.getNotifications().length > 6 ? this.renderScrollButton() : undefined}
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}

export default connect(mapStateToProps)(Notifications);