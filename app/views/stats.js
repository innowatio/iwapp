import React, {Component} from "react";
import {Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";
import Button from "react-native-button";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {Content} from "native-base";
import {Actions} from "react-native-router-flux";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

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
        fontSize: 55,
        fontWeight: "bold",
        lineHeight: 55
    },
    consumptionCircleMeasure: {
        color: colors.white,
        fontSize: 20
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

    constructor (props) {
        super(props);
        this.state = {
            period: "DAY"
        };
    }

    getButtonStyle (buttonType) {
        if (this.state.period === buttonType) {
            return styles.tabWrpActive;
        } else {
            return {};
        }
    }

    getProgressBar () {
        return [
            {color: colors.secondaryBlue, title: "IERI", key: "yesterday", value: 1, percentage: "100", consumption: 175},
            {color: colors.secondaryBlue, title: "MERCOLEDÍ SCORSO", key: "last wednesday", value: 0.3, percentage: "30", consumption: 80},
            {color: colors.progressBarError, title: "MEDIA DEI MERCOLEDÍ", key: "average of wednesday ", value: 0.8, percentage: "80", consumption: 146}
        ];
    }

    getSummaryConsumption () {
        return [
            {title: "Media consumi giornalieri di attività simili", key: "average", value: "38"},
            {title: "Consumi in standby", key: "standby", value: "500"}
        ];
    }

    setTabState (tab) {
        this.setState({period: tab});
    }

    renderTabs () {
        return (
            <View style={styles.tabsContainer}>
                <Button containerStyle={(this.state.period === "DAY" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("DAY")}>
                    <Text style={styles.tabTitle}>{"GIORNO"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "WEEK" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("WEEK")}>
                    <Text style={styles.tabTitle}>{"SETTIMANA"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "MONTH" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("MONTH")}>
                    <Text style={styles.tabTitle}>{"MESE"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "YEAR" ? styles.tabWrpActive : {})} onPress={() => this.setTabState("YEAR")}>
                    <Text style={styles.tabTitle}>{"ANNO"}</Text>
                </Button>
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

    renderSwiper1 () {
        return (
            <View style={styles.contentStatsWrp}>
                <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
                <View style={styles.consumptionCircleWrp}>
                    <Text style={styles.consumptionCircleValue}>{"48"}</Text>
                    <Text style={styles.consumptionCircleMeasure}>{"kWh"}</Text>
                </View>
                {this.getProgressBar().map(this.renderProgressBar)}
                {this.renderAlarmSettings()}
                <View style={styles.summaryConsumptionContainer}>
                    {this.getSummaryConsumption().map(this.renderSummaryConsumption)}
                </View>
            </View>
        );
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
                        <Text style={styles.consumptionTitle}>{"Superamento soglia contrattuale giornaliera"}</Text>
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

    renderSummaryConsumption (getSummaryConsumption) {
        const {width} = Dimensions.get("window");
        return (
            <View key={getSummaryConsumption.key} style={[styles.summaryConsumptionWrp, {width: width * 0.5}]}>
                <Text style={styles.consumptionTitle}>{getSummaryConsumption.title}</Text>
                <View style={styles.smallConsumptionWrp}>
                    <Text style={styles.smallConsumptionValue}>{getSummaryConsumption.value}</Text>
                    <Text style={styles.smallConsumptionMeasure}>{"kWh"}</Text>
                </View>
            </View>
        );
    }

    renderProgressBar (getProgressBar) {
        const {width} = Dimensions.get("window");
        return (
            <View key={getProgressBar.key} style={styles.ProgressBarStyleWrp}>
                <Text style={styles.progressBarTitle}>{getProgressBar.title}</Text>
                <Progress.Bar
                    borderColor={getProgressBar.color}
                    borderRadius={30}
                    borderWidth={1}
                    color={getProgressBar.color}
                    height={6}
                    progress={getProgressBar.value}
                    style={{width: width * 0.9}}
                    unfilledColor={colors.white}
                />
                <View style={styles.progressBarValuesWrp}>
                    <Text style={styles.progressBarPercentageValue}>
                        {getProgressBar.percentage}
                        {"%"}
                    </Text>
                    <Text style={styles.progressBarConsumptionValue}>
                        {getProgressBar.consumption}
                        {"KWh"}
                    </Text>
                </View>
            </View>
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
                        {this.renderTabs()}
                    </View>
                    {this.renderContentTab()}
                </Content>
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        home: state.home,
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Stats);
