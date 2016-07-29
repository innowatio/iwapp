import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";
import Button from "react-native-button";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {Actions} from "react-native-router-flux";
import {bindActionCreators} from "redux";

import {selectPeriod} from "../actions/stats";
import Highcharts from "../components/highcharts";
import Icon from "../components/iwapp-icons";
import RealTimeSpinner from "../components/realtime";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import {getTitleAndSubtitle} from "../lib/consumptions-utils";
import getRealTimeValue from "../lib/get-realtime";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    },
    titleBarWrp: {
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 5,
        backgroundColor: colors.secondaryBlue
    },
    title: {
        fontWeight: "bold",
        color: colors.white
    },
    tabsContainer: {
        paddingVertical: 5,
        backgroundColor: colors.secondaryBlue,
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 0.5,
        borderStyle: "solid",
        borderTopColor: colors.white
    },
    tabWrpActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.buttonPrimary
    },
    tabTitle: {
        color: colors.white
    },

    // CONTENT
    contentStatsWrp: {
        paddingVertical: 10,
        alignItems: "center",
        height: 500
    },
    titleSwiper: {
        color: colors.primaryBlue,
        textAlign: "center"
    },

    // CONSUMPTION CIRCLE Swiper 1
    consumptionCircleWrp: {
        backgroundColor: colors.secondaryBlue,
        width: 110,
        height: 110,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    consumptionCircleValue: {
        color: colors.white,
        fontWeight: "bold",
        lineHeight: 35
    },
    consumptionCircleMeasure: {
        color: colors.white,
        fontSize: 15
    },
    // CONSUMPTION CIRCLE SMALL
    smallConsumptionWrp: {
        backgroundColor: colors.secondaryBlue,
        width: 75,
        height: 75,
        marginVertical: 8,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    smallConsumptionValue: {
        color: colors.white,
        fontSize: 30,
        fontWeight: "bold",
        lineHeight: 30
    },
    smallConsumptionMeasure: {
        color: colors.white,
        fontSize: 11,
        fontWeight: "bold"
    },

    // PROGRESS BAR
    progressBarStyleWrp: {
        marginBottom: 10
    },
    progressBarValuesWrp: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    progressBarTitle: {
        color: colors.textGrey,
        fontSize: 13
    },
    progressBarPercentageValue: {
        fontSize: 11,
        color: colors.grey
    },
    progressBarConsumptionValue: {
        fontSize: 11,
        color: colors.secondaryBlue
    },

    // ALERT
    alarmsButtonWrp: {
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: colors.lightGrey,
        borderBottomColor: colors.lightGrey,
        marginBottom: 10
    },
    alarmsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingVertical: 3
    },
    iconAlarmWrp: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 100,
        width: 36,
        height: 36,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    alarmsButtonText: {
        color: colors.textGrey,
        fontSize: 13
    },

    // SUMMARY CONSUMPTION
    summaryConsumptionContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    summaryConsumptionWrp: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    consumptionTitle: {
        color: colors.textGrey,
        fontSize: 11,
        textAlign: "center",
        marginBottom: 5,
        marginHorizontal: 15,
        lineHeight: 13
    }
});

class Stats extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired,
        selectPeriod: PropTypes.func.isRequired,
        site: PropTypes.object,
        stats: PropTypes.shape({
            chart: PropTypes.shape({
                sensorId: PropTypes.string,
                source: PropTypes.string,
                measurementType: PropTypes.string,
                day: PropTypes.string,
                period: PropTypes.string
            })
        }).isRequired
    }

    componentDidMount () {
        this.subscribeToMeasurements(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.subscribeToMeasurements(nextProps);
    }

    getButtonStyle (buttonType) {
        if (this.props.stats.chart.period === buttonType) {
            return styles.tabWrpActive;
        } else {
            return {};
        }
    }

    getConsumptionAggregate () {
        return this.props.collections.get("consumptions-yearly-aggregates") || Map();
    }

    getDailyAggregate () {
        return this.props.collections.get("readings-daily-aggregates") || Map();
    }

    getStatsAggregate () {
        switch (this.props.stats.chart.period) {
            case "day":
                return this.getDailyAggregate();
            case "week":
            case "month":
            case "year":
                return this.getConsumptionAggregate();
        }
    }

    subscribeToMeasurements (props) {
        props.asteroid.subscribe(
            "yearlyConsumptions",
            props.site._id,
            moment.utc().year().toString(),
            "reading",
            "activeEnergy"
        );
        props.asteroid.subscribe(
            "yearlyConsumptions",
            props.site._id,
            (moment.utc().year() - 1).toString(),
            "reading",
            "activeEnergy"
        );
    }

    mapNumberFontSize (number) {
        var fontSize = 40;
        if (number > 999) {
            fontSize = 32;
        }
        if (number > 9999) {
            fontSize = 27;
        }
        return fontSize;
    }

    mapPeriodLabel () {
        const {period} = this.props.stats.chart;
        switch (period) {
            case "day":
                return "IL CONSUMO DI OGGI";
            case "week":
                return "IL CONSUMO DELLA SETTIMANA";
            case "month":
                return "IL CONSUMO DEL MESE";
            case "year":
                return "IL CONSUMO DELL'ANNO";
        }
    }

    renderAlarmSettings () {
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.alarmsButtonWrp, {width: width}]}>
                <TouchableOpacity
                    onPress={() => Actions.alarmsSettings()}
                    style={[styles.alarmsButton, {width: width * 0.9}]}
                >
                    <View style={styles.iconAlarmWrp}>
                        <Icon
                            color={colors.iconWhite}
                            name={"iw-alert"}
                            size={24}
                        />
                    </View>
                    <Text style={styles.alarmsButtonText}>{"Imposta allarmi"}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderProgressBar (consumptions, unit) {
        const {width} = Dimensions.get("window");
        return consumptions.map(consumption => {
            return (
                <View key={consumption.key} style={styles.progressBarStyleWrp}>
                    <Text style={styles.progressBarTitle}>{consumption.title}</Text>
                    <Progress.Bar
                        borderColor={(consumption.max / consumption.now < .8) ? colors.secondaryBlue : colors.progressBarError}
                        borderRadius={30}
                        borderWidth={1}
                        color={(consumption.max / consumption.now < .8) ? colors.primaryBlue : colors.progressBarError}
                        height={6}
                        progress={consumption.max / consumption.now}
                        width={width * 0.9}
                    />
                    <View style={styles.progressBarValuesWrp}>
                        <Text style={styles.progressBarPercentageValue}>
                            {(consumption.max / consumption.now * 100).toFixed(0)}
                            {"%"}
                        </Text>
                        <Text style={styles.progressBarConsumptionValue}>
                            {`${consumption.now} ${unit}`}
                        </Text>
                    </View>
                </View>
            );
        });
    }

    renderSwiper2 () {
        const {height, width} = Dimensions.get("window");
        const sensorId = this.props.stats.chart.sensorId;
        return (
            <View style={styles.contentStatsWrp}>
                <View style={{marginBottom: 40}}>
                    <Text style={styles.titleSwiper}>{this.mapPeriodLabel()}</Text>
                    <Highcharts
                        aggregates={this.getStatsAggregate()}
                        charts={[this.props.stats]}
                        height={height * .3}
                    />
                </View>
                <View style={styles.summaryConsumptionContainer}>
                    <View key={"Daily Threshold"} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                        <Text style={styles.consumptionTitle}>{"Superamento soglia\ncontrattuale giornaliera"}</Text>
                        <View style={styles.smallConsumptionWrp}>
                            <Text style={styles.smallConsumptionValue}>{"3"}</Text>
                            <Text style={styles.smallConsumptionMeasure}>{"volte"}</Text>
                        </View>
                    </View>
                    <View key={"Actual Power"} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                        <Text style={styles.consumptionTitle}>{"Potenza\nattuale"}</Text>
                        <RealTimeSpinner
                            charts={this.props.stats}
                            powerValue={getRealTimeValue(sensorId, this.getDailyAggregate())}
                        />
                    </View>
                </View>
            </View>
        );
    }

    renderSwiper1 () {
        const {width} = Dimensions.get("window");
        const tabAggregate = getTitleAndSubtitle(this.props.stats.chart.period, this.getConsumptionAggregate().filter(x => x.get("sensorId") == this.props.site._id));
        var fontSize = this.mapNumberFontSize(tabAggregate.sum);
        return (
            <View style={styles.contentStatsWrp}>
                <Text style={styles.titleSwiper}>{tabAggregate.periodTitle}</Text>
                <View style={styles.consumptionCircleWrp}>
                    <Text style={[styles.consumptionCircleValue, {fontSize, lineHeight: fontSize}]}>{tabAggregate.sum}</Text>
                    <Text style={styles.consumptionCircleMeasure}>{tabAggregate.measureUnit}</Text>
                </View>
                {this.renderProgressBar(tabAggregate.comparisons, tabAggregate.measureUnit)}
                {this.renderAlarmSettings()}
                <View style={styles.summaryConsumptionContainer}>
                    <View key={"avg-similar"} style={[styles.summaryConsumptionWrp, {width: width * 0.45}]}>
                        <Text style={styles.consumptionTitle}>{"Media dei consumi giornalieri di attività simili"}</Text>
                        <View style={styles.smallConsumptionWrp}>
                            <Text style={styles.smallConsumptionValue}>{48}</Text>
                            <Text style={styles.smallConsumptionMeasure}>{"kWh"}</Text>
                        </View>
                    </View>
                    <View key={"standby-similar"} style={[styles.summaryConsumptionWrp, {width: width * 0.45}]}>
                        <Text style={styles.consumptionTitle}>{"Consumi\nin standby"}</Text>
                        <View style={styles.smallConsumptionWrp}>
                            <Text style={styles.smallConsumptionValue}>{18}</Text>
                            <Text style={styles.smallConsumptionMeasure}>{"kWh"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderContentTab () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.8;
        return (
            <Swiper height={heightSwiper} index={0} loop={false} showButtons={true}>
                {this.renderSwiper1()}
                {this.renderSwiper2()}
            </Swiper>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        const {period} = this.props.stats.chart;
        const {selectPeriod} = this.props;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View>
                        <View style={styles.titleBarWrp}>
                            <Text style={styles.title}>{"STATISTICHE"}</Text>
                        </View>
                        <View style={styles.tabsContainer}>
                            <Button containerStyle={(period === "day" ? styles.tabWrpActive : {})} onPress={() => selectPeriod("day")}>
                                <Text style={styles.tabTitle}>{"GIORNO"}</Text>
                            </Button>
                            <Button containerStyle={(period === "week" ? styles.tabWrpActive : {})} onPress={() => selectPeriod("week")}>
                                <Text style={styles.tabTitle}>{"SETTIMANA"}</Text>
                            </Button>
                            <Button containerStyle={(period === "month" ? styles.tabWrpActive : {})} onPress={() => selectPeriod("month")}>
                                <Text style={styles.tabTitle}>{"MESE"}</Text>
                            </Button>
                            <Button containerStyle={(period === "year" ? styles.tabWrpActive : {})} onPress={() => selectPeriod("year")}>
                                <Text style={styles.tabTitle}>{"ANNO"}</Text>
                            </Button>
                        </View>
                    </View>
                    {this.renderContentTab()}
                </Content>
            </View>
        );
    }
}

function mapDispatchToProps (dispatch) {
    return {
        selectPeriod: bindActionCreators(selectPeriod, dispatch)
    };
}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        site: state.site,
        stats: state.stats
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Stats);
