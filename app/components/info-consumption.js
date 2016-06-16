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
    textNumber: {
        paddingRight: 5,
        fontSize: 30,
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
        borderRadius: 8,
        height: 60,
        marginTop: 20
    },
    textTips: {
        color: colors.white
    },
    textTipsDescription: {
        color: colors.white
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
        heightSwiper: PropTypes.number.isRequired
    }

    render () {
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.container, {height: this.props.heightSwiper}]}>
                <View style={[styles.infoAndConsumptionContainer]}>
                    <View style={styles.infoContainer}>
                        <Text>{"Immagine"}</Text>
                        <Text>{"Numero di persone"}</Text>
                        <Text>{"Grandezza dell'ufficio"}</Text>
                        <Text>{"Posizione"}</Text>
                    </View>
                    <View style={styles.meanConsumptionContainer}>
                        <View style={styles.numberMeanTextContainer}>
                            <Text style={styles.textNumber}>{"23.2"}</Text>
                            <Text style={styles.textUnitOfMeasurement}>{"kWh"}</Text>
                        </View>
                        <Text>{"Media dei miei\nconsumi giornalieri"}</Text>
                        <View style={[styles.numberOtherMeanTextContainer]}>
                            <Text style={styles.textNumber}>{"22.7"}</Text>
                            <Text style={styles.textUnitOfMeasurement}>{"kWh"}</Text>
                        </View>
                        <Text>{"Media dei consumi\ngiornalieri di attività simili"}</Text>
                    </View>
                </View>
                <View style={[styles.tipsContainer, {width: width * 0.96}]}>
                    <View style={styles.iconContainer}>
                        <Icon color={"green"} name={"iw-user"} size={40} />
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
