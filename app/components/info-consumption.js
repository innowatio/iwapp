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
        fontSize: 11,
        lineHeight: 13,
        marginTop: 5,
        fontWeight: "400"
    },
    textStandard: {
        color: colors.textGrey,
        fontSize: 13,
        marginTop: 0
    },
    infoAndConsumptionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    infoContainer: {
        flexDirection: "column"
    },
    meanConsumptionContainer: {
        flexDirection: "column"
    },
    borderIconGreen: {
        marginTop:5,
        width: 80,
        height: 80,
        borderWidth: 2,
        borderColor: colors.white,
        borderRadius: 100,
        backgroundColor: colors.borderIconGreen,
        padding: 2
    },
    iconGreen: {
        backgroundColor: colors.transparent
    },
    textNumber: {
        paddingRight: 5,
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.secondaryBlue
    },
    textUnitOfMeasurement: {
        color: colors.secondaryBlue,
        alignSelf: "flex-end",
        marginBottom: 5
    },
    numberOtherMeanTextContainer: {
        flexDirection: "row",
        marginTop: 25
    },
    tipsContainerWrp: {
        marginTop: 20
    },
    tipsContainer: {
        backgroundColor: colors.secondaryBlue,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 14,
        paddingVertical: 6,
    },
    textTips: {
        color: colors.white,
        fontSize: 18,
        lineHeight: 20
    },
    textTipsDescription: {
        color: colors.white,
        fontSize: 13,
        lineHeight: 15,
        paddingRight: 5
    },
    textTipsContainer: {
        flexDirection: "column",
        marginLeft: 10
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
                title: "GRANDE!",
                text: `Stai andando molto bene.  Hai usato il ${Math.abs(relativeConsumption)}% di energia in meno di attività simili alla tua.`
            };
        }
        if (relativeConsumption >= -5 && relativeConsumption <= 0) {
            badge = {
                icon: "iw-middling",
                title: "OK!",
                text: `Sei in linea con il consumo energetico di attività simili alla tua: hai consumato il ${Math.abs(relativeConsumption)}% di energia in meno.`
            };
        }
        if (relativeConsumption > 0 && relativeConsumption <= 5) {
            badge = {
                icon: "iw-middling",
                title: "OK!",
                text: `Sei in linea con il consumo energetico di attività simili alla tua: hai consumato il ${relativeConsumption}% di energia in più.`
            };
        }
        if (relativeConsumption > 5) {
            badge = {
                icon: "iw-bad",
                title: "ATTENZIONE!",
                text: `Hai usato il ${relativeConsumption}% di energia in più rispetto ad attività simili alla tua.`
            };
        }
        return (
            <View style={styles.tipsContainerWrp}>
                <View style={[styles.tipsContainer, {width: width * 0.96}]}>
                    <View style={styles.iconContainer}>
                        <Icon color={colors.iconGood} name={badge.icon} size={46} />
                    </View>
                    <View style={styles.textTipsContainer}>
                        <Text style={styles.textTips}>{badge.title}</Text>
                        <Text allowFontScaling={true} style={[styles.textTipsDescription, {width: width * 0.79}]}>
                            {badge.text}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    renderConsumptions (consumptions, text) {
        return (
            <View>
                <View style={[styles.numberOtherMeanTextContainer]}>
                    <Text style={styles.textNumber}>{(consumptions.total / consumptions.days).toFixed(2)}</Text>
                    <Text style={styles.textUnitOfMeasurement}>{consumptions.unit}</Text>
                </View>
                <Text style={styles.textStandard}>{text}</Text>
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
        const {
            consumptions,
            peersConsumptions
        } = this.props;
        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer]}>
                    <View style={styles.infoContainer}>
                        <View style={styles.borderIconGreen}>
                            <Icon color={colors.iconGreen} name={"iw-badge-buildings"} size={72} style={styles.iconGreen} />
                        </View>
                        <Text style={styles.textStandardSmall}>{"Numero di persone \nGrandezza dell'ufficio \nPosizione"}</Text>
                    </View>
                    <View style={styles.meanConsumptionContainer}>
                        {consumptions ? this.renderMyConsumptions() : null}
                        {peersConsumptions ? this.renderPeersConsumptions() : null}
                    </View>
                </View>
                {(consumptions && peersConsumptions) ? this.renderSmileyBadge() : null}
            </View>
        );
    }
}