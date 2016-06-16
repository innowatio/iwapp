import React, {Component} from "react";
import {Image, StyleSheet, View} from "react-native";

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

    render () {
        return (
            <Image source={require("../assets/img/bg_meteo.png")} style={styles.backgroundImage}>
                <Text style={styles.textHello}>{"Buongiorno!"}</Text>
                <View style={styles.weatherWrp}>
                    <View>
                        <View style={styles.iconWrp}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-clouds"
                                size={95}
                                style={styles.icon}
                            />
                        </View>
                        <View style={styles.climateVariablesWrp}>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"UMIDITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{"100%"}</Text>
                            </View>
                            <View style={styles.climateVariables}>
                                <Text style={styles.labelPercentage}>
                                    {"NUVOLOSITA'"}
                                </Text>
                                <Text style={styles.textPercentage}>{"100%"}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.textDegreesWrp}>
                        <Text style={styles.textDegrees}>{"20°"}</Text>
                        <Text style={styles.textDescDegrees}>
                            {"TEMPERATURA \n ESTERNA"}
                        </Text>
                    </View>
                </View>
            </Image>
        );
    }

}
