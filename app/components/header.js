import React, {Component, PropTypes} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";
import {last} from "ramda";
import FaIcons from "react-native-vector-icons/FontAwesome";

import Icon from "./iwapp-icons";
import * as colors from "../lib/colors";
import {headerHeight} from "../lib/const";

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
    leftHeader: {
        justifyContent: "flex-start",
        flexDirection: "row",
        alignSelf: "center"
    },
    rightHeader: {
        justifyContent: "flex-end",
        flexDirection: "row"
    },
    iconRightButton: {
        padding: 0,
        marginHorizontal: 3
    },
    iconAlarmButton: {
        alignSelf: "center",
        borderRadius: 100,
        padding: 5,
        marginRight: 5
    },
    iconUserButton: {
        alignSelf: "center",
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.iconWhite,
        padding: 5
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
        onToggleHamburger: PropTypes.func.isRequired,
        selectedView: PropTypes.arrayOf(PropTypes.string).isRequired
    }

    renderBackArrow () {
        return (
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={Actions.pop}
                    style={styles.buttonBack}
                >
                    <FaIcons color={colors.iconWhite} name={"angle-left"} size={35} style={{lineHeight: 40}} />
                </TouchableOpacity>
            </View>
        );
    }

    renderLeftButton () {
        const {onToggleHamburger} = this.props;
        return (
            <View style={styles.leftHeader}>
                <TouchableOpacity
                    onPress={onToggleHamburger}
                    style={styles.iconRightButton}
                    transparent={true}
                >
                    <Icon color={colors.iconWhite} name={"iw-menu"} size={40} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Actions.home()}
                    style={styles.iconRightButton}
                    transparent={true}
                >
                    <Icon color={colors.iconWhite} name={"iw-innowatio-logo"} size={35} />
                </TouchableOpacity>
            </View>
        );
    }

    renderRightButton () {
        const alarmColor = (
            last(this.props.selectedView) === "notifications" ?
            colors.buttonPrimary :
            colors.secondaryBlue
        );
        return (
            <View style={styles.rightHeader}>
                <TouchableOpacity
                    onPress={() => Actions.notifications()}
                    style={[styles.iconAlarmButton, {backgroundColor: alarmColor}]}
                    transparent={true}
                >
                    <Icon color={colors.iconWhite} name={"iw-alarm"} size={25} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Actions.profile()}
                    style={styles.iconUserButton}
                    transparent={true}
                >
                    <Icon color={colors.iconWhite} name={"iw-user"} size={23} />
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
                return this.renderBackArrow();
            default:
                return this.renderClassicHeader();
        }
    }

    render () {
        // const headerViews = this.props.headerViews;
        // const selectedView = this.props.selectedView;
        const {headerViews, selectedView} = this.props;
        const headerType = headerViews.find(headerView =>
            headerView.view === last(selectedView)
        );
        const header = headerType ? headerType.header : "default";
        return (
            <View style={styles.headerWrp}>
                {this.renderHeader(header)}
            </View>
        );
    }

}
