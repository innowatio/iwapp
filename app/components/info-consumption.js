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
        consumptionsDays: PropTypes.number,
        consumptionsLast: PropTypes.number,
        consumptionsTotal: PropTypes.number,
        consumptionsUnit: PropTypes.string,
        heightSwiper: PropTypes.number.isRequired,
        peersConsumptionsDays: PropTypes.number,
        peersConsumptionsLast: PropTypes.number,
        peersConsumptionsTotal: PropTypes.number,
        peersConsumptionsUnit: PropTypes.string,
    }

    renderSmileyBadge () {
        const {width} = Dimensions.get("window");
        const {
            consumptionsLast,
            peersConsumptionsLast
        } = this.props;
        const peersRelativeConsumption = (consumptionsLast * 100 / peersConsumptionsLast) - 100;
        let badge = {
            icon: "iw-middling",
            title: "MWEEE!",
            text: "Stai andando così così!"
        };
        if (peersRelativeConsumption < -10) {
            badge = {
                icon: "iw-good",
                title: "GRANDE!",
                text: `Stai andando bene! Stai consumando il ${Math.abs(peersRelativeConsumption).toFixed()}% in meno dei tuoi vicini!`
            };
        }
        if (peersRelativeConsumption > 10) {
            badge = {
                icon: "iw-bad",
                title: "AHIOOOO!",
                text: `Stai andando male! Stai consumando il ${peersRelativeConsumption.toFixed()}% in più dei tuoi vicini!`
            };
        }
        return (consumptionsLast && peersConsumptionsLast && consumptionsLast != 0 && peersConsumptionsLast != 0) ? (
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
        ) : null;
    }

    renderMyConsumptions () {
        const {
            consumptionsDays,
            consumptionsTotal,
            consumptionsUnit
        } = this.props;
        return consumptionsTotal ? (
            <View>
                <View style={[styles.numberOtherMeanTextContainer]}>
                    <Text style={styles.textNumber}>{(consumptionsTotal / consumptionsDays).toFixed(2) }</Text>
                    <Text style={styles.textUnitOfMeasurement}>{consumptionsUnit}</Text>
                </View>
                <Text style={styles.textStandard}>{"Media dei consumi\ngiornalieri di attività simili"}</Text>
            </View>
        ) : (
            <View style={[styles.numberOtherMeanTextContainer]}>
                <Text style={styles.textStandard}>{"Consumi non disponibili"}</Text>
            </View>
        );
    }

    renderPeersConsumptions () {
        const {
            peersConsumptionsDays,
            peersConsumptionsTotal,
            peersConsumptionsUnit
        } = this.props;
        return peersConsumptionsTotal ? (
            <View>
                <View style={[styles.numberOtherMeanTextContainer]}>
                    <Text style={styles.textNumber}>{(peersConsumptionsTotal / peersConsumptionsDays).toFixed(2) }</Text>
                    <Text style={styles.textUnitOfMeasurement}>{peersConsumptionsUnit}</Text>
                </View>
                <Text style={styles.textStandard}>{"Media dei consumi\ngiornalieri di attività simili"}</Text>
            </View>
        ) : (
            <View style={[styles.numberOtherMeanTextContainer]}>
                <Text style={styles.textStandard}>{"Consumi simili non disponibili"}</Text>
            </View>
        );
    }

    render () {
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
                        {this.renderMyConsumptions()}
                        {this.renderPeersConsumptions()}
                    </View>
                </View>
                {this.renderSmileyBadge()}
            </View>
        );
    }

}
