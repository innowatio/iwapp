import moment from "moment";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, View, StyleSheet, Switch} from "react-native";
import shallowCompare from "react-addons-shallow-compare";
import FaIcons from "react-native-vector-icons/FontAwesome";

import getDailySumConsumption from "../lib/get-daily-sum-consumption";
import getRealTimeValue from "../lib/get-realtime";
import Highcharts from "./highcharts";
import RealTimeSpinner from "./realtime";
import Text from "./text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    consumptionContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 10,
        marginBottom: 5
    },
    powerContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    summaryConsumptionContainer: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "stretch"
    },
    summaryConsumption: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
    },
    consumptionNumber: {
        paddingRight: 5,
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        color: colors.primaryBlue
    },
    consumptionUnitOfMeasurement: {
        color: colors.primaryBlue
    },
    bottomChartWrp: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 10
    },
    switch: {
        marginTop: 3
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    switchTextContainer: {
        flexDirection: "column",
        paddingHorizontal: 4
    },
    switchTextHeader: {
        fontSize: 10,
        color: colors.textGrey
    },
    switchText: {
        fontSize: 9,
        color: colors.textGrey
    },
    switchTextRed: {
        fontSize: 9,
        color: colors.lineStandby
    },
    subTitle: {
        fontSize: 11,
        color: colors.textGrey
    },
    standbyContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    // standbyIcon: {
    //     marginHorizontal: 5
    // }
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
        isForecastData: PropTypes.bool,
        isStandbyData: PropTypes.bool,
        onToggleSwitch: PropTypes.func.isRequired
    }

    constructor (props) {
        super(props);
        this.state = {
            activeStep: 0,
            modalVisible: false,
            answers: [],
            questions: []
        };
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

    renderTextForecast () {
        return this.props.isForecastData ? (
            <Text
                ellipsizeMode={"tail"}
                numberOfLines={1}
                style={styles.switchText}
            >
                {"basati sulla tua giornata tipo"}
            </Text>
        ) : (<Text style={styles.switchText}>
            {"(disponibili a breve)"}
        </Text>);
    }

    renderTextStandby () {
        console.log(121323232322322);

        if (this.props.isStandbyData) {
            const sensorId = this.props.charts[0].sensorId;

            const standby = this.props.dailyAggregates.get(`${sensorId}-standby-2016-11-29-reading-activeEnergy`);
            const prova = standby.get("measurementValues");
            console.log("\n\n\n\n");
            console.log(prova);

            return (
                <Text style={styles.switchTextRed}>
                    {`${prova} kW`}
                </Text>
            );
        } else {
            return (
                <Text style={styles.switchText}>
                    {"(disponibili a breve)"}
                </Text>
            );
        }
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const sensorId = this.props.charts[0].sensorId;
        const forecast = this.props.charts.find(x => x.source === "forecast");
        return (
            <View>
                <View style={[styles.consumptionContainer, {height: height * .175}]}>
                    <View style={styles.summaryConsumptionContainer}>
                        <Text style={styles.subTitle}>{"Consumo di oggi"}</Text>
                        <View style={styles.summaryConsumption}>
                            <Text style={styles.consumptionNumber}>{this.getSummaryConsumption().toFixed(1)}</Text>
                            <Text style={styles.consumptionUnitOfMeasurement}>{"kWh"}</Text>
                        </View>
                    </View>
                    <View style={styles.powerContainer}>
                        <Text style={styles.subTitle}>{"Potenza attuale"}</Text>
                        <RealTimeSpinner
                            charts={this.props.charts}
                            powerValue={getRealTimeValue(sensorId, this.props.dailyAggregates)}
                        />
                    </View>
                </View>
                <View style={{height: this.props.heightSwiper * 0.44}}>
                    <Highcharts
                        aggregates={this.props.dailyAggregates}
                        charts={this.props.charts}
                        height={this.props.heightSwiper * 0.46}
                    />
                </View>
                <View style={[styles.bottomChartWrp, {width: width * .9, height: height * 0.08}]}>
                    <View style={styles.switchContainer}>
                        <Switch
                            disabled={!this.props.isForecastData}
                            onTintColor={colors.HomeSwitchActive}
                            onValueChange={this.props.onToggleSwitch}
                            style={styles.switch}
                            value={!!forecast}
                        />
                        <View style={styles.switchTextContainer}>
                            <Text
                                ellipsizeMode={"tail"}
                                numberOfLines={1}
                                style={styles.switchTextHeader}
                            >
                                <Text style={styles.switchTextHeader}>{"Consumi previsti"}</Text>
                            </Text>
                            {this.renderTextForecast()}
                        </View>
                    </View>
                    <View style={styles.standbyContainer}>
                        <FaIcons
                            color={colors.lineStandby}
                            name={"circle-thin"}
                            size={22}
                            style={styles.standbyIcon}
                        />
                        <View style={styles.switchTextContainer}>
                            <Text style={styles.switchTextHeader}>{"Consumi in standby"}</Text>
                            {this.renderTextStandby()}
                        </View>
                    </View>
                </View>
            </View>
        );
    }

}
