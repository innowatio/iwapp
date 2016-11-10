import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, Image, View} from "react-native";

import * as colors from "../lib/colors";
import Icon from "../components/iwapp-icons";
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
        color: colors.textGrey,
        fontSize: 12
    },
    infoAndConsumptionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    infoContainer: {
        flexDirection: "column",
        paddingLeft: 15,
        justifyContent: "center"
    },
    iconActivityWrp: {
        marginVertical: 5
    },
    meanConsumptionContainer: {
        flexDirection: "column",
        paddingHorizontal: 15,
        justifyContent: "center",
        overflow: "hidden"
    },
    numberOtherMeanContainer: {
        justifyContent: "center"
    },
    textNumber: {
        paddingRight: 5,
        fontSize: 30,
        fontWeight: "bold",
        color: colors.secondaryBlue,
        overflow: "hidden"
    },
    textUnitOfMeasurement: {
        color: colors.secondaryBlue,
        alignSelf: "flex-end",
        marginBottom: 4,
        fontSize: 14
    },
    textContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    tipsContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    tipsWrp: {
        backgroundColor: colors.secondaryBlue,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 14,
        paddingVertical: 6
    },
    textTipsWrp: {
        flexDirection: "column",
        marginHorizontal: 4
    },
    textTips: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: colors.transparent
    },
    textTipsDescription: {
        color: colors.white,
        fontSize: 12,
        paddingRight: 4,
        backgroundColor: colors.transparent
    },
    iconContainer: {
        alignSelf: "center",
        marginLeft: 4
    }
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

    renderSmileyBadge () {
        const {width} = Dimensions.get("window");
        const {consumptions, peersConsumptions} = this.props;
        const relativeConsumption = Math.round((consumptions.avg * 100 / peersConsumptions.avg) - 100);
        let badge = {};
        if (relativeConsumption < -5) {
            badge = {
                icon: "iw-good",
                iconColor: colors.iconGood,
                title: "GRANDE!",
                text: `Stai andando molto bene.  Hai usato il ${Math.abs(relativeConsumption)}% di energia in meno di attività simili alla tua.`
            };
        }
        if (relativeConsumption >= -5 && relativeConsumption <= 0) {
            badge = {
                icon: "iw-middling",
                iconColor: colors.iconMiddling,
                title: "OK!",
                text: `Sei in linea con il consumo energetico di attività simili alla tua: hai consumato il ${Math.abs(relativeConsumption)}% di energia in meno.`
            };
        }
        if (relativeConsumption > 0 && relativeConsumption <= 5) {
            badge = {
                icon: "iw-middling",
                iconColor: colors.iconMiddling,
                title: "OK!",
                text: `Sei in linea con il consumo energetico di attività simili alla tua: hai consumato il ${relativeConsumption}% di energia in più.`
            };
        }
        if (relativeConsumption > 5) {
            badge = {
                icon: "iw-bad",
                iconColor: colors.iconBad,
                title: "ATTENZIONE!",
                text: `Hai usato il ${relativeConsumption}% di energia in più rispetto ad attività simili alla tua.`
            };
        }
        return (
            <View style={[styles.tipsWrp, {width: width * 0.96}]}>
                <View style={styles.iconContainer}>
                    <Icon color={badge.iconColor} name={badge.icon} size={width * 0.13} />
                </View>
                <View style={styles.textTipsWrp}>
                    <Text style={styles.textTips}>{badge.title}</Text>
                    <Text style={[styles.textTipsDescription, {width: width * 0.78}]}>
                        {badge.text}
                    </Text>
                </View>
            </View>
        );
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
        return (
            <View style={styles.iconActivityWrp}>
                <Image
                    source={icon}
                    style={{width: height * .14, height: height * .14}}
                />
            </View>
        );
    }

    renderConsumptions (consumptions, text) {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.numberOtherMeanContainer, {height: height * .175}]}>
                <View style={styles.textContainer}>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={[styles.textNumber, {maxWidth: width * .4}]}>
                        {(consumptions.avg).toFixed(2)}
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
        const text = "Media dei miei\nconsumi giornalieri";
        return this.renderConsumptions(consumptions, text);
    }

    renderPeersConsumptions () {
        const {peersConsumptions} = this.props;
        const text = "Media dei consumi\ngiornalieri di attività simili";
        return this.renderConsumptions(peersConsumptions, text);
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const {consumptions, peersConsumptions, site} = this.props;

        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer, {width, height: height * .35}]}>
                    <View style={[styles.infoContainer, {height: height * .35, width: width * .41}]}>
                        {this.renderActivityTypeIcon()}
                        {site && site.employees ? <Text style={styles.textStandardSmall}>{`${site.employees} persone`}</Text> : null}
                        {site && site.areaInMq ? <Text style={styles.textStandardSmall}>{`Attività di ${site.areaInMq} mq`}</Text> : null}
                        {site && site.address ? <Text style={styles.textStandardSmall}>{`${site.address}`}</Text> : null}
                    </View>
                    <View style={[styles.meanConsumptionContainer, {height: height * .35, width: width * .59}]}>
                        {consumptions ? this.renderMyConsumptions() : null}
                        {peersConsumptions ? this.renderPeersConsumptions() : null}
                    </View>
                </View>
                <View style={[styles.tipsContainer, {width, height: height * .16}]}>
                    {(consumptions && peersConsumptions) ? this.renderSmileyBadge() : null}
                </View>
            </View>
        );
    }
}
