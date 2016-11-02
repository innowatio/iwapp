import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import FaIcons from "react-native-vector-icons/FontAwesome";
// import {Actions} from "react-native-router-flux";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import Text from "../components/text-lato";

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
        backgroundColor: colors.secondaryBlue
    },
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        color: colors.white,
        fontSize: 12
    },

    // INFO PAGE
    contentInfoWrp: {
        justifyContent: "center",
        alignItems: "center"
    },
    contentInfo: {
        alignItems: "center"
    },
    websiteContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    websiteWrp: {
        backgroundColor: colors.backgroundWebsite,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    iconWrp: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    textWebsite: {
        fontSize: 13,
        padding: 0,
        color: colors.textGrey
    },
    buttonsWrp: {
        borderTopWidth: .5,
        borderStyle: "solid",
        borderColor: colors.grey,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: .5,
        borderStyle: "solid",
        borderColor: colors.grey
    },
    buttonIcon: {
        color: colors.textGrey
    },
    footerWrp: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    textFooterWrp: {
        borderTopWidth: .5,
        borderStyle: "solid",
        borderColor: colors.grey,
        alignItems: "center",
        justifyContent: "center"
    },
    textFooter: {
        fontSize: 9,
        textAlign: "center"
    }
});

class Info extends Component {

    renderButtons () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.buttonsWrp, {width: width, height: height * .41, marginTop: height * .03}]}>
                <TouchableOpacity
                    // TODO add link to button with actions: onPress={() => Actions.PAGE()}
                    style={[styles.buttons, {paddingHorizontal: width * .02, paddingVertical: height * .02}]}
                    transparent={true}
                >
                    <Text style={styles.textWebsite}>{"Contact Us"}</Text>
                    <FaIcons
                        name={"angle-right"}
                        size={width * .05}
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    // TODO add link to button with actions: onPress={() => Actions.PAGE()}
                    style={[styles.buttons, {paddingHorizontal: width * .02, paddingVertical: height * .02}]}
                    transparent={true}
                >
                    <Text style={styles.textWebsite}>{"Help & FAQ"}</Text>
                    <FaIcons
                        name={"angle-right"}
                        size={width * .05}
                        style={styles.buttonIcon}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderFooter () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.footerWrp, {width: width, height: height * .12}]}>
                <View style={[styles.textFooterWrp, {width: width, height: height * .05}]}>
                    <Text style={styles.textFooter}>
                        {"Versione n. 1.0.0"}
                    </Text>
                </View>
                <View style={[styles.textFooterWrp, {width: width, height: height * .065}]}>
                    <Text style={styles.textFooter}>
                        {"Copyright ©2016 Innowatio SpA P.I.03486370160\nAll rights reserved"}
                    </Text>
                </View>
            </View>
        );
    }

    renderPageContent () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.websiteContainer, {width: width, marginTop: height * .03}]}>
                <View style={[styles.websiteWrp, {height: height * .24, width: width * .96}]}>
                    <View style={[styles.iconWrp, {width: width * .18, height: width * .18}]}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-innowatio-logo"
                            size={height * .06}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => Linking.openURL("http://www.innowatio.com")}
                        transparent={true}
                    >
                        <Text style={[styles.textWebsite, {marginTop: height * .02}]}>{"www.innowatio.com"}</Text>
                    </TouchableOpacity>
                </View>
                {this.renderButtons()}
                {this.renderFooter()}
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height}}>
                    <View style={[styles.titleBarWrp, {height: height * .045}]}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"INFO"}</Text>
                        </View>
                    </View>
                    <View style={styles.contentInfoWrp}>
                        <View style={styles.contentInfo}>
                            {this.renderPageContent()}
                        </View>
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

export default connect(mapStateToProps)(Info);
