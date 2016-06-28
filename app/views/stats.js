import React, {Component} from "react";
import {Dimensions, View, StyleSheet, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";
import Button from "react-native-button";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {Content} from "native-base";

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
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
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
        padding: 20,
        alignItems: "center"
    },
    titleSwiper: {
        color: colors.primaryBlue,
        textAlign: "center"
    },

    // CONSUMPTION CIRCLE
    consumptionWrp: {
        backgroundColor: colors.secondaryBlue,
        width: 110,
        height: 110,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    consumptionValue: {
        color: colors.white,
        fontSize: 60,
        fontWeight: "bold",
        lineHeight: 60
    },
    consumptionMeasure: {
        color: colors.white,
        fontSize: 20
    },
    // CONSUMPTION CIRCLE SMALL
    smallConsumptionWrp: {
        backgroundColor: colors.secondaryBlue,
        width: 60,
        height: 60,
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
        fontSize: 10
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
        width: 40,
        height: 40,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    alarmsButtonText: {
        color: colors.textGrey,
        fontSize: 13
    },

    // SUMMARY CONSNUMPTION
    summaryConsumptionWrp: {
        flexDirection: "row",
        justifyContent: "center"
    },
    summaryConsumption: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    summaryConsumptionTitle: {
        color: colors.textGrey,
        fontSize: 11,
        textAlign: "center",
        marginVertical: 5,
        marginHorizontal: 10
    }
});

class Stats extends Component {

    constructor (props) {
        super(props);
        this.state = {
            period: ""
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
            {color: colors.secondaryBlue, title: "MEDIA DEI MERCOLEDÍ", key: "average of wednesday ", value: 0.8, percentage: "80", consumption: 146}
        ];
    }

    getSummaryConsumption () {
        return [
            {title: "Media consumi giornalieri di attività simili", key: "average", value: "38"},
            {title: "Consumi in standby", key: "standby", value: "500"}
        ];
    }

    setTabState () {
        this.setState({period: "DAY"});
    }

    renderTabs () {
        return (
            <View style={styles.tabsContainer}>
                <Button containerStyle={(this.state.period === "DAY" ? styles.tabWrpActive : {})} onPress={::this.setTabState}>
                    <Text style={styles.tabTitle}>{"GIORNO"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "WEEK" ? styles.tabWrpActive : {})} onPress={::this.setTabState}>
                    <Text style={styles.tabTitle}>{"SETTIMANA"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "MONTH" ? styles.tabWrpActive : {})} onPress={::this.setTabState}>
                    <Text style={styles.tabTitle}>{"MESE"}</Text>
                </Button>
                <Button containerStyle={(this.state.period === "YEAR" ? styles.tabWrpActive : {})} onPress={::this.setTabState}>
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
        if (this.state.period === "DAY") {
            return (
                <View style={styles.contentStatsWrp}>
                    <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
                    <View style={styles.consumptionWrp}>
                        <Text style={styles.consumptionValue}>{"48"}</Text>
                        <Text style={styles.consumptionMeasure}>{"kWh"}</Text>
                    </View>
                    {this.getProgressBar().map(this.renderProgressBar)}
                    {this.renderAlarmSettings()}
                    <View style={styles.summaryConsumptionWrp}>
                        {this.getSummaryConsumption().map(this.renderSummaryConsumption)}
                    </View>
                </View>
            );
        }
    }

    renderSwiper2 () {
        if (this.state.period === "DAY") {
            return (
                <View style={styles.contentStatsWrp}>
                    <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
                </View>
            );
        }
    }

    renderAlarmSettings () {
        const {width} = Dimensions.get("window");
        return (
            <View style={[styles.alarmsButtonWrp, {width: width}]}>
                <TouchableOpacity style={[styles.alarmsButton, {width: width * 0.9}]} transparent={true}>
                    <View style={styles.iconAlarmWrp}>
                        <Icon
                            color={colors.iconWhite}
                            name={"iw-alert"}
                            size={28}
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
            <View key={getSummaryConsumption.key} style={[styles.summaryConsumption, {width: width * 0.5}]}>
                <Text style={styles.summaryConsumptionTitle}>{getSummaryConsumption.title}</Text>
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
                            <View style={styles.titleBar}>
                                <Text style={styles.title}>{"STATISTICHE"}</Text>
                            </View>
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
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Stats);
