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

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";
import {getTitleAndSubtitle} from "../lib/consumptions-utils";

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
        alignItems: "center"
    },
    titleSwiper: {
        color: colors.primaryBlue,
        textAlign: "center"
    },

    // CONSUMPTION Swiper 2
    consumptionWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    consumptionValue: {
        marginRight: 5,
        color: colors.primaryBlue,
        fontSize: 50,
        fontWeight: "bold"
    },
    consumptionMeasure: {
        color: colors.primaryBlue,
        fontSize: 16
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
        width: 70,
        height: 70,
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
    ProgressBarStyleWrp: {
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

    // SUMMARY CONSNUMPTION
    summaryConsumptionContainer: {
        flexDirection: "row",
        justifyContent: "center"
    },
    summaryConsumptionWrp: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    consumptionTitle: {
        color: colors.textGrey,
        fontSize: 11,
        textAlign: "center",
        marginBottom: 5,
        marginHorizontal: 15,
        lineHeight: 13
    },
    actualPowerWrp: {
        borderWidth: 2,
        borderColor: colors.grey,
        marginVertical: 4,
        width: 70,
        height: 70,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    actualPowerValue: {
        fontSize: 26,
        textAlign: "center",
        fontWeight: "bold",
        color: colors.powerNumber
    },
    actualPowerMeasure: {
        color: colors.powerNumber,
        textAlign: "center"
    }
});

class Stats extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired,
        site: PropTypes.object
    }

    constructor (props) {
        super(props);
        this.state = {
            period: "day"
        };
    }

    componentDidMount () {
        this.subscribeToMeasurements(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.subscribeToMeasurements(nextProps);
    }

    getButtonStyle (buttonType) {
        if (this.state.period === buttonType) {
            return styles.tabWrpActive;
        } else {
            return {};
        }
    }

    getConsumptionAggregate () {
        return this.props.collections.get("consumptions-yearly-aggregates") || Map();
    }

    setTabState (tab) {
        this.setState({period: tab});
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

    renderSummaryConsumption (consumptions, unit) {
        const {width} = Dimensions.get("window");
        return consumptions.map(consumption => {
            return (
                <View key={consumption.key} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                    <Text style={styles.consumptionTitle}>{consumption.title}</Text>
                    <View style={styles.smallConsumptionWrp}>
                        <Text style={styles.smallConsumptionValue}>{1}</Text>
                        <Text style={styles.smallConsumptionMeasure}>{unit}</Text>
                    </View>
                </View>
            );
        });
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
                <View key={consumption.key} style={styles.ProgressBarStyleWrp}>
                    <Text style={styles.progressBarTitle}>{consumption.title}</Text>
                    <Progress.Bar
                        borderColor={colors.secondaryBlue}
                        borderRadius={30}
                        borderWidth={1}
                        color={colors.primaryBlue}
                        height={6}
                        progress={consumption.now / consumption.max}
                        width={width * 0.9}
                    />
                    <View style={styles.progressBarValuesWrp}>
                        <Text style={styles.progressBarPercentageValue}>
                            {(consumption.now / consumption.max * 100).toFixed(0)}
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
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.contentStatsWrp}>
                <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
                <View style={styles.consumptionWrp}>
                    <Text style={styles.consumptionValue}>{"11,2"}</Text>
                    <Text style={styles.consumptionMeasure}>{"kWh"}</Text>
                </View>
                <View><Text>{"\n\n\n\n"}</Text></View>
                <View style={styles.summaryConsumptionContainer}>
                    <View key={"Daily Threshold"} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                        <Text style={styles.consumptionTitle}>{"Superamento soglia\ncontrattuale giornaliera"}</Text>
                        <View style={styles.smallConsumptionWrp}>
                            <Text style={styles.smallConsumptionValue}>{"3"}</Text>
                            <Text style={styles.smallConsumptionMeasure}>{"volte"}</Text>
                        </View>
                    </View>
                    <View key={"Actual Power"} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                        <Text style={styles.consumptionTitle}>{"Potenza attuale"}</Text>
                        <View style={styles.actualPowerWrp}>
                            <Text style={styles.actualPowerValue}>{"17,3"}</Text>
                            <Text style={styles.actualPowerMeasure}>{"kW"}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderSwiper1 () {
        const tabAggregate = getTitleAndSubtitle(this.state.period, this.getConsumptionAggregate().filter(x => x.get("sensorId") == this.props.site._id));
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
                    {this.renderSummaryConsumption(tabAggregate.comparisons, tabAggregate.measureUnit)}
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
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View>
                        <View style={styles.titleBarWrp}>
                            <Text style={styles.title}>{"STATISTICHE"}</Text>
                        </View>
                        <View style={styles.tabsContainer}>
                            <Button containerStyle={(this.state.period === "day" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("day")}>
                                <Text style={styles.tabTitle}>{"GIORNO"}</Text>
                            </Button>
                            <Button containerStyle={(this.state.period === "week" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("week")}>
                                <Text style={styles.tabTitle}>{"SETTIMANA"}</Text>
                            </Button>
                            <Button containerStyle={(this.state.period === "month" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("month")}>
                                <Text style={styles.tabTitle}>{"MESE"}</Text>
                            </Button>
                            <Button containerStyle={(this.state.period === "year" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("year")}>
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

function mapStateToProps (state) {
    return {
        collections: state.collections,
        home: state.home,
        site: state.site
    };
}
export default connect(mapStateToProps)(Stats);
