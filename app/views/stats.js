import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, View, StyleSheet} from "react-native";
import * as Progress from "react-native-progress";
import Button from "react-native-button";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {bindActionCreators} from "redux";

import {selectPeriod} from "../actions/stats";
import Highcharts from "../components/highcharts";
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
        backgroundColor: colors.secondaryBlue
    },
    title: {
        fontWeight: "bold",
        fontSize: 12,
        color: colors.white
    },
    tabsContainer: {
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
        color: colors.white,
        fontSize: 11
    },

    // CONTENT
    contentStatsWrp: {
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    consumptionWrp: {
        alignItems: "center",
        justifyContent: "center"
    },
    titleSwiper: {
        color: colors.primaryBlue,
        textAlign: "center",
        fontSize: 11
    },

    // CONSUMPTION CIRCLE Swiper 1
    consumptionCircleWrp: {
        backgroundColor: colors.secondaryBlue,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    consumptionCircleValue: {
        letterSpacing: -2,
        color: colors.white,
        fontWeight: "bold",
        backgroundColor: colors.transparent
    },
    consumptionCircleMeasure: {
        color: colors.white,
        fontSize: 14,
        backgroundColor: colors.transparent
    },
    // CONSUMPTION CIRCLE SMALL
    smallConsumptionWrp: {
        backgroundColor: colors.secondaryBlue,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    smallConsumptionValue: {
        color: colors.white,
        fontSize: 26,
        letterSpacing: -.8,
        fontWeight: "bold",
        backgroundColor: colors.transparent
    },
    smallConsumptionMeasure: {
        color: colors.white,
        fontSize: 10,
        fontWeight: "400",
        backgroundColor: colors.transparent
    },

    // PROGRESS BAR
    progressBarValuesWrp: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    progressBarTitle: {
        color: colors.textGrey,
        fontSize: 12
    },
    progressBarPercentageValue: {
        fontSize: 10,
        color: colors.grey
    },
    progressBarConsumptionValue: {
        fontSize: 10,
        color: colors.secondaryBlue
    },

    // ALERT
    // alarmsButtonWrp: {
    //     borderTopWidth: 0.5,
    //     borderBottomWidth: 0.5,
    //     borderTopColor: colors.lightGrey,
    //     borderBottomColor: colors.lightGrey,
    //     marginBottom: 10
    // },
    // alarmsButton: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     justifyContent: "flex-start",
    //     paddingHorizontal: 20,
    //     paddingVertical: 3
    // },
    // iconAlarmWrp: {
    //     backgroundColor: colors.primaryBlue,
    //     borderRadius: 100,
    //     width: 36,
    //     height: 36,
    //     marginRight: 5,
    //     alignItems: "center",
    //     justifyContent: "center"
    // },
    // alarmsButtonText: {
    //     color: colors.textGrey,
    //     fontSize: 13
    // },

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
        fontSize: 10,
        textAlign: "center",
        marginBottom: 5,
        marginHorizontal: 0
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
        if (props.site) {
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
    }

    mapNumberFontSize (number) {
        var fontSize = 34;
        if (number > 999) {
            fontSize = 28;
        }
        if (number > 9999) {
            fontSize = 24;
        }
        if (number > 99999) {
            fontSize = 22;
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
        // TODO waiting the alarms feature

        // const {width} = Dimensions.get("window");
        // return (
        //     <View style={[styles.alarmsButtonWrp, {width}]}>
        //         <TouchableOpacity
        //             onPress={() => Actions.alarmsSettings()}
        //             style={[styles.alarmsButton, {width: width * 0.9}]}
        //         >
        //             <View style={styles.iconAlarmWrp}>
        //                 <Icon
        //                     color={colors.iconWhite}
        //                     name={"iw-alert"}
        //                     size={24}
        //                 />
        //             </View>
        //             <Text style={styles.alarmsButtonText}>{"Imposta allarmi"}</Text>
        //         </TouchableOpacity>
        //     </View>
        // );
    }

    renderProgressBar (consumptions, unit) {
        const {width, height} = Dimensions.get("window");
        return consumptions.map(consumption => {
            if (consumption.max === 0) {
                return null;
            }
            const progress = consumption.now / consumption.max;
            return (
                <View key={consumption.key} style={[styles.progressBarStyleWrp, {margin: height * .01}]}>
                    <Text style={styles.progressBarTitle}>{consumption.title}</Text>
                    <Progress.Bar
                        borderColor={(progress < .8) ? colors.secondaryBlue : colors.progressBarError}
                        borderRadius={30}
                        borderWidth={1}
                        color={(progress < .8) ? colors.primaryBlue : colors.progressBarError}
                        height={6}
                        progress={progress}
                        width={width * 0.9}
                    />
                    <View style={styles.progressBarValuesWrp}>
                        <Text style={styles.progressBarPercentageValue}>
                            {(progress * 100).toFixed(0)}
                            {"%"}
                        </Text>
                        <Text style={styles.progressBarConsumptionValue}>
                            {`${consumption.max} ${unit}`}
                        </Text>
                    </View>
                </View>
            );
        });
    }

    renderSwiper2 () {
        const {height, width} = Dimensions.get("window");
        const sensorId = this.props.stats.chart.sensorId;
        const showThreshold = false;
        return (
            <View style={styles.contentStatsWrp}>
                <View style={{height: height * .42, marginBottom: height * .05}}>
                    <Text style={styles.titleSwiper}>{this.mapPeriodLabel()}</Text>
                    <Highcharts
                        aggregates={this.getStatsAggregate()}
                        charts={[this.props.stats.chart]}
                        height={height * .35}
                    />
                </View>
                <View style={[styles.summaryConsumptionContainer, {height: height * .2}]}>
                    {showThreshold ?
                        <View
                            key={"Daily Threshold"}
                            style={[styles.summaryConsumptionWrp, {width: width * .5}]}
                        >
                            <Text style={styles.consumptionTitle}>
                                {"Superamento soglia\ncontrattuale giornaliera"}
                            </Text>
                            <View
                                style={[
                                    styles.smallConsumptionWrp,
                                    {width: height * .12, height: height * .12, marginVertical: height * .01}
                                ]}
                            >
                                <Text style={styles.smallConsumptionValue}>{"3"}</Text>
                                <Text style={styles.smallConsumptionMeasure}>{"volte"}</Text>
                            </View>
                        </View> : null}
                    <View key={"Actual Power"} style={[styles.summaryConsumptionWrp, {width: width * .5}]}>
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

    renderConsumptionsData (sensorId, text) {
        const {width, height} = Dimensions.get("window");
        const {
            stats
        } = this.props;
        const aggregate = this.getConsumptionAggregate().filter(agg => (
            agg.get("sensorId") === sensorId && agg.get("measurementType") === "activeEnergy")
        );
        if (!aggregate.isEmpty()) {
            const data = getTitleAndSubtitle(stats.chart.period, aggregate);
            const fontSize = this.mapNumberFontSize(data.sum) - 10;
            return (
                <View style={[styles.summaryConsumptionWrp, {width: width * .45}]}>
                    <View style={{marginHorizontal: width * .025}}>
                        <Text style={styles.consumptionTitle}>{text ? text : data.peersText}</Text>
                    </View>
                    <View style={[styles.smallConsumptionWrp, {width: height * .12, height: height * .12}]}>
                        <Text
                            style={[styles.smallConsumptionValue, {
                                fontSize: fontSize, lineHeight: fontSize
                            }]}
                        >
                            {data.sum}
                        </Text>
                        <Text style={styles.smallConsumptionMeasure}>{"kWh"}</Text>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }

    renderSwiper1 () {
        const {site, stats} = this.props;
        const {height} = Dimensions.get("window");
        const aggregates = this.getConsumptionAggregate().filter(agg => (
            agg.get("sensorId") == site._id && agg.get("measurementType") === "activeEnergy"
        ));
        if (!aggregates.isEmpty()) {
            const tabAggregate = getTitleAndSubtitle(stats.chart.period, aggregates);
            const fontSize = this.mapNumberFontSize(tabAggregate.sum);
            return (
                <View style={styles.contentStatsWrp}>
                    <View style={[styles.consumptionWrp, {height: height * .2}]}>
                        <Text style={styles.titleSwiper}>{tabAggregate.periodTitle}</Text>
                        <View style={[styles.consumptionCircleWrp, {width: height * .16, height: height * .16}]}>
                            <Text ellipsizeMode={"tail"} numberOfLines={1} style={[styles.consumptionCircleValue, {fontSize, lineHeight: fontSize}]}>
                                {tabAggregate.sum}
                            </Text>
                            <Text style={styles.consumptionCircleMeasure}>
                                {tabAggregate.measureUnit}
                            </Text>
                        </View>
                    </View>
                    <View style={{height: height * .28}}>
                        {this.renderProgressBar(tabAggregate.comparisons, tabAggregate.measureUnit)}
                    </View>
                    {this.renderAlarmSettings()}
                </View>
            );
        } else {
            return null;
        }
    }

    // <View style={[styles.summaryConsumptionContainer, {height: height * .2}]}>
    //     {this.renderConsumptionsData(`${site._id}-peers-avg`)}
    //     {this.renderConsumptionsData(`${site._id}-standby`, "Consumi\nin standby")}
    // </View>

    renderContentTab () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.78;
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
                <Content style={{backgroundColor: colors.background, height}}>
                    <View>
                        <View style={[styles.titleBarWrp, {height: height * .045}]}>
                            <Text style={styles.title}>{"STATISTICHE"}</Text>
                        </View>
                        <View style={[styles.tabsContainer, {paddingVertical: height * .008}]}>
                            <Button
                                containerStyle={(period === "day" ? styles.tabWrpActive : {})}
                                onPress={() => selectPeriod("day")}
                            >
                                <Text style={styles.tabTitle}>{"GIORNO"}</Text>
                            </Button>
                            <Button
                                containerStyle={(period === "week" ? styles.tabWrpActive : {})}
                                onPress={() => selectPeriod("week")}
                            >
                                <Text style={styles.tabTitle}>{"SETTIMANA"}</Text>
                            </Button>
                            <Button
                                containerStyle={(period === "month" ? styles.tabWrpActive : {})}
                                onPress={() => selectPeriod("month")}
                            >
                                <Text style={styles.tabTitle}>{"MESE"}</Text>
                            </Button>
                            <Button
                                containerStyle={(period === "year" ? styles.tabWrpActive : {})}
                                onPress={() => selectPeriod("year")}
                            >
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
