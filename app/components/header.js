import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {last} from "ramda";
import FaIcons from "react-native-vector-icons/FontAwesome";

import Icon from "./iwapp-icons";
import * as colors from "../lib/colors";
import {headerHeight} from "../lib/const";
import {getNavigationType} from "../lib/scene";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    headerWrp: {
        backgroundColor: colors.primaryBlue,
        paddingVertical: 5,
        paddingHorizontal: 3
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: headerHeight
    },
    headerEmpty: {
        height: headerHeight
    },
    leftHeader: {
        justifyContent: "flex-start",
        flexDirection: "row",
        alignSelf: "center"
    },
    rightHeader: {
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    iconButton: {
        padding: 0,
        marginHorizontal: 5
    },
    iconAlarmButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 34,
        height: 34,
        marginRight: 16
    },
    iconUserButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        width: 34,
        height: 34,
        marginRight: 15
    },
    textUser: {
        color: colors.white,
        fontSize: 20,
        fontWeight: "bold"
    },
    textNotificationWrp: {
        backgroundColor: colors.notificationsCircle,
        borderRadius: 100,
        width: 15,
        height: 15,
        position: "absolute",
        top: 0,
        right: 8,
        alignItems: "center",
        justifyContent: "center",
        padding: 0
    },
    textNotification: {
        color: colors.white,
        fontSize: 10,
        backgroundColor: colors.transparent
    },
    buttonBack: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 40
    }
});

export default class Header extends Component {

    static propTypes = {
        headerViews: PropTypes.arrayOf(PropTypes.shape({
            view: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired
        })).isRequired,
        notifications: PropTypes.number.isRequired,
        notificationsAction: PropTypes.func,
        onToggleHamburger: PropTypes.func.isRequired,
        selectedView: PropTypes.arrayOf(PropTypes.string).isRequired,
        userName: PropTypes.string
    }

    navigateNotifications (selectedView) {
        Actions.notifications(getNavigationType(selectedView));
        this.props.notificationsAction ? this.props.notificationsAction() : null;
    }

    renderBackArrowHeader () {
        return (
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={Actions.pop}
                    style={styles.buttonBack}
                >
                    <FaIcons
                        color={colors.iconWhite}
                        name={"angle-left"}
                        size={35}
                        style={{lineHeight: 40}}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderEmptyHeader () {
        return (
            <View style={styles.headerEmpty} />
        );
    }

    renderLeftButton () {
        const {onToggleHamburger} = this.props;
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.leftHeader, {width: width * .5}]}>
                <TouchableOpacity
                    onPress={onToggleHamburger}
                    style={styles.iconButton}
                    transparent={true}
                >
                    <Icon color={colors.iconWhite} name={"iw-menu"} size={42} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={Actions.home}
                    style={styles.iconButton}
                    transparent={true}
                >
                    <Icon
                        color={colors.iconWhite}
                        name={"iw-innowatio-logo"}
                        size={32}
                        style={{marginTop: 4}}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderNotificationNumber () {
        const numberOfNotifications = (
            this.props.notifications > 9 ? "9+" : this.props.notifications
        );
        return this.props.notifications ? (
            <View style={styles.textNotificationWrp}>
                <Text style={[styles.textNotification]}>{numberOfNotifications}</Text>
            </View>
        ) : null;
    }

    renderRightButton () {
        const alarmColor = (
            last(this.props.selectedView) === "notifications" ?
            colors.buttonPrimary :
            colors.secondaryBlue
        );
        //

        return (
            <View style={styles.rightHeader}>
                <View>
                    <TouchableOpacity
                        onPress={() => this.navigateNotifications(this.props.selectedView)}
                        style={[styles.iconAlarmButton, {backgroundColor: alarmColor}]}
                        transparent={true}
                    >
                        <Icon
                            color={colors.iconWhite}
                            name={"iw-alarm"}
                            size={20}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </TouchableOpacity>
                    {this.renderNotificationNumber()}
                </View>
                <TouchableOpacity
                    onPress={() => Actions.profile(getNavigationType(this.props.selectedView))}
                    style={styles.iconUserButton}
                >
                    <Text style={styles.textUser}>{this.props.userName}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderClassicHeader () {
        return (
            <View style={styles.header}>
                {this.renderLeftButton()}
                {this.renderRightButton()}
            </View>
        );
    }

    renderHeader (headerKey) {
        switch (headerKey) {
            case "back-arrow":
                return this.renderBackArrowHeader();
            case "empty":
                return this.renderEmptyHeader();
            default:
                return this.renderClassicHeader();
        }
    }

    render () {
        const {headerViews, selectedView} = this.props;
        const headerType = headerViews.find(headerView =>
            headerView.view === last(selectedView)
        );
        const header = headerType ? headerType.header : "default";
        return (
            <View key="mainView" style={styles.headerWrp}>
                {this.renderHeader(header)}
            </View>
        );
    }

}
