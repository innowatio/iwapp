import moment from "moment";
import {last} from "ramda";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {View, StyleSheet, Switch} from "react-native";
import shallowCompare from "react-addons-shallow-compare";

import getDailySumConsumption from "../lib/get-daily-sum-consumption";
import Highcharts from "./highcharts";
import Text from "./text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    consumptionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 20,
        marginBottom: 25
    },
    powerContainer: {
        flexDirection: "column"
    },
    summaryConsumptionContainer: {
        flexDirection: "column"
    },
    summaryConsumption: {
        flexDirection: "row",
        margin: 10
    },
    consumptionNumber: {
        paddingRight: 5,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.primaryBlue
    },
    consumptionUnitOfMeasurement: {
        marginTop: 10,
        color: colors.primaryBlue
    },
    powerNumber: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        color: colors.powerNumber
    },
    powerUnitOfMeasurement: {
        color: colors.powerNumber,
        textAlign: "center"
    },
    switch: {
        alignSelf: "flex-start",
        marginTop: 3,
        marginLeft: 10
    },
    switchContainer: {
        flexDirection: "row"
    },
    switchTextContainer: {
        flexDirection: "column",
        marginLeft: 10
    },
    switchTextHeader: {
        fontWeight: "bold"
    },
    switchText: {
        fontSize: 12
    }
});

export default class ChartConsumption extends Component {

    static propTypes = {
        charts: PropTypes.arrayOf(PropTypes.shape({
            sensorId: PropTypes.string,
            source: PropTypes.string,
            measurementType: PropTypes.string,
            day: PropTypes.string
        })).isRequired,
        consumptionAggregates:IPropTypes.map,
        dailyAggregates: IPropTypes.map,
        heightSwiper: PropTypes.number.isRequired,
        onToggleSwitch: PropTypes.func.isRequired
    }

    shouldComponentUpdate (nextProps) {
        return shallowCompare(this, nextProps);
    }

    getSummaryConsumption () {
        const dayOfYear = moment.utc().dayOfYear();
        const sensorId = this.props.charts[0].sensorId;
        const year = moment.utc().format("YYYY");
        const source = "reading";
        const measurementType = "activeEnergy";
        return getDailySumConsumption(
            this.props.consumptionAggregates,
            {sensorId, year, source, measurementType},
            dayOfYear
        );
    }

    getRealTimePower () {
        const sensorId = this.props.charts[0].sensorId;
        const day = moment.utc().format("YYYY-MM-DD");
        const powerValues = this.props.dailyAggregates.getIn(
            [`${sensorId}-${day}-reading-maxPower`, "measurementValues"]
        ) || "";
        const power = last(powerValues.split(","));
        return parseFloat(power) || 0;
    }

    render () {
        return (
            <View>
                <View style={styles.consumptionContainer}>
                    <View style={styles.summaryConsumptionContainer}>
                        <Text>{"Consumo di oggi"}</Text>
                        <View style={styles.summaryConsumption}>
                            <Text style={styles.consumptionNumber}>{this.getSummaryConsumption().toFixed(1)}</Text>
                            <Text style={styles.consumptionUnitOfMeasurement}>{"kWh"}</Text>
                        </View>
                    </View>
                    <View style={styles.powerContainer}>
                        <Text>{"Potenza attuale"}</Text>
                        <Text style={styles.powerNumber}>{this.getRealTimePower().toFixed(1)}</Text>
                        <Text style={styles.powerUnitOfMeasurement}>{"kW"}</Text>
                    </View>
                </View>
                <Highcharts
                    aggregates={this.props.dailyAggregates}
                    charts={this.props.charts}
                    height={this.props.heightSwiper * 0.35}
                />
                <View style={styles.switchContainer}>
                    <Switch
                        onValueChange={this.props.onToggleSwitch}
                        style={styles.switch}
                        value={this.props.charts.length === 2}
                    />
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTextHeader}>{"Consumi previsti"}</Text>
                        <Text style={styles.switchText}>{"basati sulla tua giornata tipo"}</Text>
                    </View>
                </View>
            </View>
        );
    }

}
