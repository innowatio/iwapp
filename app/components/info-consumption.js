import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, Image, View} from "react-native";

import * as colors from "../lib/colors";
// import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import icoDefault from "../assets/img/ico_default.gif";
import icoSelling from "../assets/img/ico_selling.gif";
import icoFeedingSector from "../assets/img/ico_feeding-sector.gif";
import icoIndustry from "../assets/img/ico_industry.gif";
import icoOffices from "../assets/img/ico_offices.gif";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.transparent,
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    textStandardSmall: {
        color: colors.textGrey,
        fontSize: 10
    },
    textStandard: {
        color: colors.white,
        fontSize: 13
    },
    infoAndConsumptionContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center"
    },
    infoContainer: {
        flexDirection: "row",
        paddingLeft: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    iconActivityWrp: {
        marginVertical: 5
    },
    meanConsumptionContainer: {
        flexDirection: "column",
        overflow: "hidden",
        paddingHorizontal: 0,
        justifyContent: "center"
    },
    consumptionWrp: {
        borderWidth: 1,
        borderColor: colors.primaryBlue,
        borderRadius: 5,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondaryBlue
    },
    //
    numberOtherMeanContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    textNumber: {
        paddingRight: 5,
        fontSize: 55,
        fontWeight: "bold",
        overflow: "hidden",
        color: colors.white
    },
    textUnitOfMeasurement: {
        alignSelf: "flex-end",
        marginBottom: 4,
        color: colors.white,
        fontSize: 32
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
});

export default class InfoConsumption extends Component {

    static propTypes = {
        consumptions: PropTypes.shape({
            avg: PropTypes.number,
            unit: PropTypes.string
        }),
        heightSwiper: PropTypes.number.isRequired,
        peersConsumptions: PropTypes.shape({
            avg: PropTypes.number,
            unit: PropTypes.string
        }),
        site: PropTypes.object
    }
    renderActivityTypeIcon () {
        const {height} = Dimensions.get("window");
        const site = this.props.site || {};
        var icon;
        switch (site.businessType) {
            case "Vendita all'ingrosso o al dettaglio (negozi, ecc)":
                icon = icoSelling;
                break;
            case "Settore alimentazione (ristoranti, bar, panetterie, fast food, ecc)":
                icon = icoFeedingSector;
                break;
            case "Industria (costruzioni, manifatturiera, agricoltura)":
                icon = icoIndustry;
                break;
            case "Uffici (uffici societari, servizi finanziari, pubblica amministrazione, agenzie immobiliari, ecc)":
                icon = icoOffices;
                break;
            case "Altro":
            default:
                icon = icoDefault;
        }

        if (site && site.businessType) {
            return (
                <View style={styles.iconActivityWrp}>
                    <Image
                        source={icon}
                        style={{width: height * .14, height: height * .14}}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.iconActivityWrp}>
                    <Image
                        source={icoDefault}
                        style={{width: height * .14, height: height * .14}}
                    />
                </View>
            );
        }
    }

    renderConsumptionData (consumptions) {
        if (consumptions.avg.toString().split(".")[0].length >= 3) {
            return consumptions.avg.toFixed(0);
        } else {
            return consumptions.avg.toFixed(1);
        }
    }

    renderConsumptions (consumptions, text) {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.numberOtherMeanContainer, {height: height * .175}]}>
                <View style={styles.textContainer}>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={[styles.textNumber, {maxWidth: width * .4}]}>
                        {this.renderConsumptionData(consumptions)}
                    </Text>
                    <Text style={styles.textUnitOfMeasurement}>{consumptions.unit}</Text>
                </View>
                <View>
                    <Text style={styles.textStandard}>{text}</Text>
                </View>
            </View>
        );
    }

    renderMyConsumptions () {
        const {consumptions} = this.props;
        const text = "Media dei miei consumi giornalieri";
        return this.renderConsumptions(consumptions, text);
    }

    renderPeersConsumptions () {
        const {peersConsumptions} = this.props;
        const text = "Media dei consumi\ngiornalieri di attività simili";
        return this.renderConsumptions(peersConsumptions, text);
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const {consumptions, site} = this.props;
        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer, {width, height: height * .5}]}>
                    <View style={[styles.infoContainer, {height: height * .3, width: width * .9}]}>
                        {this.renderActivityTypeIcon()}
                        <View style={{width: width * .55, marginLeft: width * .02}}>
                            {site && site.employees ? <Text style={styles.textStandardSmall}>{`${site.employees} persone`}</Text> : null}
                            {site && site.areaInMq ? <Text style={styles.textStandardSmall}>{`Attività di ${site.areaInMq} mq`}</Text> : null}
                            {site && site.address ? <Text style={styles.textStandardSmall}>{`${site.address}`}</Text> : null}
                        </View>
                    </View>
                    <View style={[styles.meanConsumptionContainer, {height: height * .3, width: width * .9}]}>
                        <View style={styles.consumptionWrp}>
                            {consumptions ? this.renderMyConsumptions() : null}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
