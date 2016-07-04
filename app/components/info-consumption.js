import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View} from "react-native";

import * as colors from "../lib/colors";
import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.transparent,
        flexDirection: "column",
        paddingTop: 20
    },
    textStandard: {
        color: colors.textGrey,
        fontSize: 13,
        marginTop: 5,
        fontWeight: "200"
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
        justifyContent: "center",
        alignItems: "center"
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
    numberMeanTextContainer: {
        flexDirection: "row"
    },
    numberOtherMeanTextContainer: {
        flexDirection: "row",
        marginTop: 25
    },
    tipsContainer: {
        backgroundColor: colors.secondaryBlue,
        flexDirection: "row",
        alignSelf: "center",
        borderRadius: 14,
        paddingVertical: 6,
        marginTop: 20
    },
    textTips: {
        color: colors.white,
        fontSize: 18,
        lineHeight: 20
    },
    textTipsDescription: {
        color: colors.white,
        fontSize: 13,
        lineHeight: 15
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
        consumptionsMean: PropTypes.string.isRequired,
        consumptionsMeanUnit: PropTypes.string.isRequired,
        consumptionsSimilar: PropTypes.string.isRequired,
        consumptionsSimilarUnit: PropTypes.string.isRequired,
        heightSwiper: PropTypes.number.isRequired
    }

    render () {
        const {width} = Dimensions.get("window");
        const {
            consumptionsMean,
            consumptionsMeanUnit,
            consumptionsSimilar,
            consumptionsSimilarUnit
        } = this.props;
        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer]}>
                    <View style={styles.infoContainer}>
                        <View style={styles.borderIconGreen}>
                            <Icon color={colors.iconGreen} name={"iw-badge-green"} size={72} style={styles.iconGreen} />
                        </View>
                        <Text style={styles.textStandard}>{"Numero di persone"}</Text>
                        <Text style={styles.textStandard}>{"Grandezza dell'ufficio"}</Text>
                        <Text style={styles.textStandard}>{"Posizione"}</Text>
                    </View>
                    <View style={styles.meanConsumptionContainer}>
                        <View style={styles.numberMeanTextContainer}>
                            <Text style={styles.textNumber}>{consumptionsMean}</Text>
                            <Text style={styles.textUnitOfMeasurement}>{consumptionsMeanUnit}</Text>
                        </View>
                        <Text style={styles.textStandard}>{"Media dei miei\nconsumi giornalieri"}</Text>
                        <View style={[styles.numberOtherMeanTextContainer]}>
                            <Text style={styles.textNumber}>{consumptionsSimilar}</Text>
                            <Text style={styles.textUnitOfMeasurement}>{consumptionsSimilarUnit}</Text>
                        </View>
                        <Text style={styles.textStandard}>{"Media dei consumi\ngiornalieri di attività simili"}</Text>
                    </View>
                </View>
                <View style={[styles.tipsContainer, {width: width * 0.96}]}>
                    <View style={styles.iconContainer}>
                        <Icon color={colors.iconGood} name={"iw-good"} size={46} />
                    </View>
                    <View style={styles.textTipsContainer}>
                        <Text style={styles.textTips}>{"GRANDE!"}</Text>
                        <Text allowFontScaling={true} style={[styles.textTipsDescription, {width: width * 0.79}]}>
                            {"Stai andando molto bene. Hai usato il 10% di energia in meno dei tuoi vicini"}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

}
