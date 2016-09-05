import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View} from "react-native";

import * as colors from "../lib/colors";
import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";

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
        paddingLeft: 25,
        justifyContent: "center"
    },
    meanConsumptionContainer: {
        flexDirection: "column",
        paddingHorizontal: 20,
        overflow: "hidden"
    },
    iconActivityWrp: {
        marginVertical: 5,
        borderRadius: 100,
        backgroundColor: colors.borderIconGreen,
        justifyContent: "center",
        alignItems: "center"
    },
    iconActivity: {
        backgroundColor: colors.transparent,
        justifyContent: "center",
        alignItems: "center",

        lineHeight: 62
    },
    textNumber: {
        paddingRight: 5,
        fontSize: 32,
        fontWeight: "bold",
        color: colors.secondaryBlue
    },
    textUnitOfMeasurement: {
        color: colors.secondaryBlue,
        alignSelf: "flex-end",
        marginBottom: 5,
        fontSize: 14
    },
    numberOtherMeanContainer: {
        justifyContent: "center"
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
        marginHorizontal: 5
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
        lineHeight: 14,
        paddingRight: 5,
        backgroundColor: colors.transparent
    },
    iconContainer: {
        alignSelf: "center",
        marginLeft: 5
    }
});

export default class InfoConsumption extends Component {

    static propTypes = {
        consumptions: PropTypes.shape({
            days: PropTypes.number,
            total: PropTypes.number,
            unit: PropTypes.string
        }),
        heightSwiper: PropTypes.number.isRequired,
        peersConsumptions: PropTypes.shape({
            days: PropTypes.number,
            total: PropTypes.number,
            unit: PropTypes.string
        }),
    }

    renderSmileyBadge () {
        const {width} = Dimensions.get("window");
        const {
            consumptions,
            peersConsumptions
        } = this.props;
        const relativeConsumption = Math.round((consumptions.total * 100 / peersConsumptions.total) - 100);
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
                    <Icon color={badge.iconColor} name={badge.icon} size={width * 0.14} />
                </View>
                <View style={styles.textTipsWrp}>
                    <Text style={styles.textTips}>{badge.title}</Text>
                    <Text ellipsizeMode={"tail"} numberOfLines={3}  style={[styles.textTipsDescription, {width: width * 0.78}]}>
                        {badge.text}
                    </Text>
                </View>
            </View>
        );
    }

    renderConsumptions (consumptions, text) {
        const {height} = Dimensions.get("window");
        return (
            <View style={[styles.numberOtherMeanContainer, {height: height * .175}]}>
                <View style={styles.textContainer}>
                    <Text style={styles.textNumber}>{(consumptions.total / consumptions.days).toFixed(2)}</Text>
                    <Text style={styles.textUnitOfMeasurement}>{consumptions.unit}</Text>
                </View>
                <View style={{height: height * .07}}>
                    <Text style={styles.textStandard}>{text}</Text>
                </View>
            </View>
        );
    }

    renderMyConsumptions () {
        const {
            consumptions
        } = this.props;
        const text = "Media dei miei\nconsumi giornalieri";
        return this.renderConsumptions(consumptions, text);
    }

    renderPeersConsumptions () {
        const {
            peersConsumptions
        } = this.props;
        const text = "Media dei consumi\ngiornalieri di attività simili";
        return this.renderConsumptions(peersConsumptions, text);
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const {
            consumptions,
            peersConsumptions
        } = this.props;

        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer, {width, height: height * .35}]}>
                    <View style={[styles.infoContainer, {height: height * .35, width: width * .42}]}>
                        <View style={[styles.iconActivityWrp, {width: height * .14, height: height * .14}]}>
                            <Icon
                                color={colors.iconGreen}
                                name={"iw-badge-buildings"}
                                size={height * .12}
                                style={styles.iconActivity}
                            />
                        </View>
                        <Text style={styles.textStandardSmall}>{"23 persone"}</Text>
                        <Text style={styles.textStandardSmall}>{"Ufficio di 167 mq"}</Text>
                        <Text style={styles.textStandardSmall}>{"Bergamo, Lombardia"}</Text>
                    </View>
                    <View style={[styles.meanConsumptionContainer, {height: height * .35, width: width * .58}]}>
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
