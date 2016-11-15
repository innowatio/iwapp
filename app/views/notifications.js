import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import {equals} from "ramda";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, TouchableHighlight, StyleSheet, ListView, Platform, View} from "react-native";
import FCM from "react-native-fcm";
import {connect} from "react-redux";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
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
        justifyContent: "center",
        alignItems: "center"
    },
    notificationWrp: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        marginVertical: 8
    },
    notificationIcon: {
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    notificationTextWrp: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    notificationDateWrp: {
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    notificationDate: {
        alignSelf: "flex-end",
        color: colors.lightGrey,
        fontSize: 10,
        textAlign: "right"
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
        this.state = {
            dataSource
        };
    }

    componentWillMount () {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.getNotifications())
        });
    }

    componentDidMount () {
        Platform.OS == "ios" ? FCM.setBadgeNumber() : null;
        this.props.asteroid.subscribe("notifications");
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.getNotifications(nextProps))
        });
    }

    pressRow (rowID) {
        const notifications = this.getNotifications(this.props, rowID);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(notifications),
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

    getNotificationText (notification, index, rowID) {
        return {
            ellipsizeMode: "tail",
            numberOfLines: rowID === index ? undefined : 2,
            style: {color: colors.textGrey, fontSize: 13},
            children: notification.get("message")
        };
    }

    getNotifications (nextProps, rowID) {
        const props = nextProps ? nextProps : this.props;
        const notifs = props.collections.get("notifications") || Map();
        return notifs.sortBy(notification => -notification.date).toArray().map((notification, index) => {
            const type = notification.get("type");
            return {
                key: index,
                text: (<Text {...this.getNotificationText(notification, index, parseInt(rowID))} />),
                icon: this.getNotificationIcon(type),
                bgcolor: this.getNotificationBackgroundColor(type),
                date: notification.get("date")
            };
        });
    }

    renderNotification (notification, rowID, index) {
        const {width} = Dimensions.get("window");
        const date = new Date(notification.date);
        return (
            <TouchableHighlight
                key={notification.key}
                onPress={() => {
                    ::this.pressRow(index);
                }}
                underlayColor={colors.white}
            >
                <View style={[styles.notificationWrp, {width: width * .9}]}>
                    <View style={{width: width * .17}}>
                        <View style={[styles.notificationIcon, {
                            width: width * .14,
                            height: width * .14,
                            backgroundColor: notification.bgcolor}
                        ]}
                        >
                            <Icon
                                color={colors.iconWhite}
                                name={notification.icon}
                                size={width * .10}
                                style={{backgroundColor: colors.transparent}}
                            />
                        </View>
                    </View>
                    <View style={{width: width * .73}}>
                        <View style={[styles.notificationTextWrp, {minHeight: width * .12}]}>
                            {notification.text}
                        </View>
                        <View style={styles.notificationDateWrp}>
                            <Text style={styles.notificationDate}>
                                {moment.utc(date).format("ddd DD MMM")}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    renderNotificationsList () {
        return (
            <ListView
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={::this.renderNotification}
                style={styles.containerView}
            />
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height}}>
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
