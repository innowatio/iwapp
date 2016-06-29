import React, {Component, PropTypes} from "react";
import {Image, StyleSheet, View} from "react-native";
import moment from "moment";

import Icon from "./iwapp-icons";
import Text from "./text-lato";
import * as colors from "../lib/colors";

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
        marginBottom: 45,
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
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-around",
        height: 80
    },
    icon: {
        height: 75
    },
    climateVariablesWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    climateVariables: {
        paddingHorizontal: 10
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    textDegrees: {
        color: colors.white,
        fontSize: 66,
        height: 80,
        textAlign: "center",
        fontWeight: "bold"
    },
    textDescDegrees: {
        color: colors.white,
        fontSize: 14,
        marginRight: 15,
        textAlign: "center"
    }
});

export default class Weather extends Component {

    static propTypes = {
        cloudness: PropTypes.number.isRequired,
        cloudnessUnit: PropTypes.string,
        humidity: PropTypes.number.isRequired,
        humidityUnit: PropTypes.string,
        icon: PropTypes.string,
        temperature: PropTypes.number.isRequired,
        temperatureUnit: PropTypes.string
    }

    getGreeting () {
        const hours = parseInt(moment.utc().format("HH"));
        return hours > 17 ? "Buonasera" : "Buongiorno";
    }

    render () {
        const {
            cloudness,
            cloudnessUnit,
            humidity,
            humidityUnit,
            icon,
            temperature,
            temperatureUnit
        } = this.props;
        return (
            <Image source={require("../assets/img/bg_meteo.png")} style={styles.backgroundImage}>
                <Text style={styles.textHello}>{this.getGreeting()}</Text>
                <View style={styles.weatherWrp}>
                    <View>
                        <View style={styles.iconWrp}>
                            {icon ? (
                                <Icon
                                    color={colors.iconWhite}
                                    name={`${icon}`}
                                    size={95}
                                    style={styles.icon}
                                />
                            ) : null}
                        </View>
                        <View style={styles.climateVariablesWrp}>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"UMIDITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{`${humidity} ${humidityUnit ? humidityUnit : "%"}`}</Text>
                            </View>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"NUVOLOSITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{`${cloudness} ${cloudnessUnit ? cloudnessUnit : "%"}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.textDegreesWrp}>
                        <Text style={styles.textDegrees}>{`${temperature} ${temperatureUnit ? temperatureUnit : "°C"}`}</Text>
                        <Text style={styles.textDescDegrees}>
                            {"TEMPERATURA \n ESTERNA"}
                        </Text>
                    </View>
                </View>
            </Image>
        );
    }

}
