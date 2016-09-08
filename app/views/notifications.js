import {Map} from "immutable";
import {equals} from "ramda";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, ListView, View} from "react-native";
import {Content} from "native-base";
import {connect} from "react-redux";
import IPropTypes from "react-immutable-proptypes";
import moment from "moment";

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
    }
});

class Notifications extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired
    }

    constructor (props) {
        super(props);
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => !equals(r1, r2)});
        this.state = {dataSource};
    }

    componentDidMount () {
        this.props.asteroid.subscribe("notifications");
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.getNotifications(nextProps))
        });
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

    getNotifications (nextProps) {
        const props = nextProps ? nextProps : this.props;
        const notifs = props.collections.get("notifications") || Map();
        return notifs.map((notification, index) => {
            const type = notification.get("type");
            return {
                key: index,
                text: notification.get("message"),
                icon: this.getNotificationIcon(type),
                bgcolor: this.getNotificationBackgroundColor(type),
                date: notification.get("date")
            };
        }).sortBy(notification => -notification.date).toArray();
    }

    renderNotificationsList () {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderNotification}
                style={styles.containerView}
            />
        );
    }

    renderNotification (notification) {
        const {width} = Dimensions.get("window");
        const date = new Date(notification.date);
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
                        {moment.utc(date).format("ddd DD MMM")}
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
