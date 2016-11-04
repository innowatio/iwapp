import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import getDeviceInfo from "../lib/get-device-info";
import pkg from "../../package";
import moment from "moment";

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
    textContactsWrp: {
        justifyContent: "center",
        alignItems: "flex-start"
    },
    titContacts: {
        fontSize: 16,
        color: colors.textGrey
    },
    textContacts: {
        fontSize: 13,
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
        textAlign: "center",
        color: colors.textGrey
    }
});

class Info extends Component {

    renderPageContent () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.websiteContainer, {width: width, marginTop: height * .03}]}>
                <View style={[styles.websiteWrp, {height: height * .30, width: width * .90}]}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL("http://www.innowatio.com")}
                        style={[styles.iconWrp, {width: width * .18, height: width * .18}]}
                        transparent={true}
                    >
                        <Icon
                            color={colors.iconWhite}
                            name="iw-innowatio-logo"
                            size={height * .06}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => Linking.openURL("http://www.innowatio.com")}
                        transparent={true}
                    >
                        <Text style={[styles.textWebsite, {marginTop: height * .02}]}>{"www.innowatio.com"}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.textContactsWrp, {
                    width: width * .96,
                    height: height * .35,
                    marginTop: height * .03,
                    paddingLeft: height * .08}
                ]}
                >
                    <Text style={[styles.titContacts, {fontWeight: "bold"}]}>
                        {"Innowatio S.p.A.\n"}
                    </Text>
                    <Text style={[styles.textContacts]}>
                        {`Sede legale e operativa:\nc/o Kilometro Rosso - Via Stezzano, 87\n24126, Bergamo\nTelefono: +39 035 3846911\nFax: +39 035 3846930\nEmail: info@innowatio.it`}
                    </Text>
                </View>
                {this.renderFooter()}
            </View>
        );
    }

    renderFooter () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.footerWrp, {width: width, height: height * .12}]}>
                <View style={[styles.textFooterWrp, {width: width, height: height * .05}]}>
                    <Text style={styles.textFooter}>
                        {`App Version ${getDeviceInfo().appVersion} | Bundle Version ${pkg.version}`}
                    </Text>
                </View>
                <View style={[styles.textFooterWrp, {width:  width, height: height * .065}]}>
                    <Text style={styles.textFooter}>
                        {`Copyright © ${moment().format("YYYY")} Innowatio SpA - P.I. 03486370160\nAll rights reserved`}
                    </Text>
                </View>
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
