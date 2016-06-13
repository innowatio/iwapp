import React, {Component, PropTypes} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";

import Icon from "./iwapp-icons";
import * as colors from "../lib/colors";

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
        height: 40
        // shadowColor: colors.white,
        // shadowOffset: {width: 0, height: 2},
        // shadowOpacity: 0.1,
        // shadowRadius: 1.5
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
        padding: 0
    },
    iconAlarmButton: {
        alignSelf: "center",
        borderRadius: 100,
        backgroundColor: colors.secondaryBlue,
        padding: 5,
        marginRight: 5
    },
    iconUserButton: {
        alignSelf: "center",
        borderRadius: 100,
        borderWidth: 1,
        borderColor: colors.iconWhite,
        padding: 5
    }
});

export default class Header extends Component {

    static propTypes = {
        onToggleHamburger: PropTypes.func.isRequired
    }

    renderLeftButton () {
        const {onToggleHamburger} = this.props;
        return (
            <View style={styles.leftHeader}>
                <TouchableOpacity onPress={onToggleHamburger} style={styles.iconRightButton} transparent={true}>
                    <Icon color={colors.iconWhite} name={"iw-menu"} size={40} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconRightButton} transparent={true}>
                    <Icon color={colors.iconWhite} name={"iw-innowatio-logo"} size={35} />
                </TouchableOpacity>
            </View>
        );
    }

    renderRightButton () {
        return (
            <View style={styles.rightHeader}>
                <TouchableOpacity style={styles.iconAlarmButton} transparent={true}>
                    <Icon color={colors.iconWhite} name={"iw-alarm"} size={25} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconUserButton} transparent={true}>
                    <Icon color={colors.iconWhite} name={"iw-user"} size={23} />
                </TouchableOpacity>
            </View>
        );
    }

    render () {
        return (
            <View style={styles.headerWrp}>
                <View style={styles.header}>
                    {this.renderLeftButton()}
                    {this.renderRightButton()}
                </View>
            </View>
        );
    }

}
