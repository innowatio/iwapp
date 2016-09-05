import React, {Component, PropTypes} from "react";
import {Dimensions, Image, StyleSheet, View} from "react-native";

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
    textHelloWrp: {
        alignItems: "center",
        justifyContent: "center"
    },
    textHello: {
        color: colors.white,
        backgroundColor: colors.transparent,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: colors.blackOpacity,
        textShadowOffset: ({width: 1, height: 1}),
        textShadowRadius: 3
    },
    weatherWrp: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: colors.backgroundBlackOpacity
    },
    weatherCol: {
        justifyContent: "space-around",
        alignSelf: "center"
    },
    iconWrp: {
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
        fontSize: 9,
        lineHeight: 9,
        textAlign: "center"
    },
    textPercentage: {
        color: colors.white,
        fontSize: 20,
        lineHeight: 19,
        fontWeight: "bold",
        textAlign: "center"
    },
    textDegreesWrp: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    textDegreesValue: {
        color: colors.white,
        fontSize: 58,
        fontWeight: "bold",
        justifyContent: "center",
    },
    textDescDegreesWrp: {
        justifyContent: "center"
    },
    textDegrees: {
        color: colors.white,
        fontSize: 22,
        fontWeight: "bold"
    },
    textDescDegrees: {
        color: colors.white,
        fontSize: 12,
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
        const {height, width} = Dimensions.get("window");
        // onLayout={nativeEvent: {layout: {x, y, width, height}}}
        return (
            <Image resizeMode={"cover"} source={background} style={styles.backgroundImage}>
                <View style={[styles.textHelloWrp, {height: height * .06}]}>
                    <Text style={styles.textHello}>
                        {this.getGreeting()}
                    </Text>
                </View>
                <View style={[styles.weatherWrp, {width}]}>
                    <View style={[styles.weatherCol, {width: width * .55}]}>
                        <View style={[styles.iconWrp, {height: height * .12}]}>
                            {icon ? (
                                <Icon
                                    color={colors.iconWhite}
                                    name={`${icon}`}
                                    size={height * .14}
                                />
                            ) : null}
                        </View>
                        <View style={[styles.climateVariablesWrp, {height: height * .08}]}>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"UMIDITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>
                                    {`${humidity.toFixed()} ${humidityUnit ? humidityUnit : "%"}`}
                                </Text>
                            </View>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"NUVOLOSITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>
                                    {`${cloudness.toFixed()} ${cloudnessUnit ? cloudnessUnit : "%"}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.weatherCol, {width: width * .45}]}>
                        <View style={[styles.textDegreesWrp, {height: height * .12}]}>
                            <Text style={styles.textDegreesValue}>{`${temperature.toFixed()}`}</Text>
                            <Text style={styles.textDegrees}>{`${temperatureUnit ? temperatureUnit : ""}`}</Text>
                        </View>
                        <View style={[styles.textDescDegreesWrp, {height: height * .08}]}>
                            <Text style={styles.textDescDegrees}>
                                {"TEMPERATURA \n ESTERNA"}
                            </Text>
                        </View>
                    </View>
                </View>
            </Image>
        );
    }

}
