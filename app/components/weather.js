import React, {Component, PropTypes} from "react";
import {Image, StyleSheet, View} from "react-native";

import Icon from "./iwapp-icons";
import Text from "./text-lato";
import * as colors from "../lib/colors";
import {isDay, isNight} from "../lib/weather-mapper";

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    textHello: {
        color: colors.white,
        backgroundColor: colors.transparent,
        marginTop: 5,
        marginBottom: 25,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: colors.backgroundBlackOpacity
    },
    weatherWrp: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.backgroundBlackOpacity
    },
    iconWrp: {
        height: 85,
        alignItems: "center"
    },
    climateVariablesWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    climateVariables: {
        paddingHorizontal: 12
    },
    labelPercentage: {
        color: colors.white,
        fontSize: 10,
        textAlign: "center"
    },
    textPercentage: {
        color: colors.white,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center"
    },
    textDegreesWrp: {
        flexDirection: "row",
        height: 85
    },
    textDegreesValue: {
        color: colors.white,
        fontSize: 66,
        fontWeight: "bold"
    },
    textDegrees: {
        color: colors.white,
        fontSize: 30,
        alignSelf: "center",
        fontWeight: "bold"
    },
    textDescDegrees: {
        color: colors.white,
        fontSize: 13,
        marginRight: 15,
        textAlign: "center"
    }
});

export default class Weather extends Component {

    static propTypes = {
        background: PropTypes.number.isRequired,
        cloudness: PropTypes.number.isRequired,
        cloudnessUnit: PropTypes.string,
        humidity: PropTypes.number.isRequired,
        humidityUnit: PropTypes.string,
        icon: PropTypes.string,
        temperature: PropTypes.number.isRequired,
        temperatureUnit: PropTypes.string
    }

    getGreeting () {
        return isDay() ? "Buongiorno!" : isNight() ? "Buonanotte!" : "Buonasera!";
    }

    render () {
        const {
            background,
            cloudness,
            cloudnessUnit,
            humidity,
            humidityUnit,
            icon,
            temperature,
            temperatureUnit
        } = this.props;
        return (
            <Image source={background} style={styles.backgroundImage}>
                <Text style={styles.textHello}>{this.getGreeting()}</Text>
                <View style={styles.weatherWrp}>
                    <View>
                        <View style={styles.iconWrp}>
                            {icon ? (
                                <Icon
                                    color={colors.iconWhite}
                                    name={`${icon}`}
                                    size={90}
                                />
                            ) : null}
                        </View>
                        <View style={styles.climateVariablesWrp}>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"UMIDITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{`${humidity.toFixed()} ${humidityUnit ? humidityUnit : "%"}`}</Text>
                            </View>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"NUVOLOSITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{`${cloudness.toFixed()} ${cloudnessUnit ? cloudnessUnit : "%"}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={styles.textDegreesWrp}>
                            <Text style={styles.textDegreesValue}>{`${temperature.toFixed()}`}</Text>
                            <Text style={styles.textDegrees}>{`${temperatureUnit ? temperatureUnit : ""}`}</Text>
                        </View>
                        <Text style={styles.textDescDegrees}>
                            {"TEMPERATURA \n ESTERNA"}
                        </Text>
                    </View>
                </View>
            </Image>
        );
    }

}
