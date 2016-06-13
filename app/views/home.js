import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, Switch, View, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {bindActionCreators} from "redux";

import Highcharts from "../components/highcharts";
import Text from "../components/text-lato";
import {background} from "../lib/colors";
import {toggleForecast} from "../actions/home";
import getDailySumConsumption from "../lib/get-daily-sum-consumption";

const styles = StyleSheet.create({
    consumptionContainer: {
        flexDirection: "row"
    },
    summaryConsumptionContainer: {
        flexDirection: "column"
    },
    powerContainer: {
        flexDirection: "row"
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

class Home extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired,
        home: PropTypes.shape({
            charts: PropTypes.arrayOf(PropTypes.shape({
                sensorId: PropTypes.string,
                source: PropTypes.string
            }))
        }).isRequired,
        toggleForecast: PropTypes.func.isRequired
    }

    componentDidMount () {
        this.props.asteroid.subscribe("sites");
        this.subscribeToMeasure(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.subscribeToMeasure(nextProps);
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    subscribeToMeasure (props) {
        const charts = props.home.charts;
        charts.forEach(chart => {
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                chart.sensorId,
                chart.day,
                chart.day,
                chart.source,
                chart.measurementType
            );
            props.asteroid.subscribe(
                "yearlyConsumptions",
                chart.sensorId,
                moment.utc(chart.day).format("YYYY"),
                chart.source,
                chart.measurementType
            );
        });
    }

    getSummaryConsumption () {
        const consumptionAggregate = this.props.collections.get("consumptions-yearly-aggregates") || Map();
        const dayOfYear = moment.utc().dayOfYear();
        const sensorId = this.props.home.charts[0].sensorId;
        const year = moment.utc().format("YYYY");
        const source = "reading";
        const measurementType = "activeEnergy";
        return getDailySumConsumption(
            consumptionAggregate,
            {sensorId, year, source, measurementType},
            dayOfYear
        );
    }

    renderSecondSwitchView (height) {
        return (
            <View>
                <View style={[styles.consumptionContainer, {height: height * 0.2}]}>
                    <View style={styles.summaryConsumptionContainer}>
                        <Text>{"Consumo di oggi"}</Text>
                        <View>
                            <Text>{this.getSummaryConsumption()}</Text>
                            <Text>{"kWh"}</Text>
                        </View>
                    </View>
                    <View style={styles.powerContainer}>
                        <Text>{"Potenza attuale"}</Text>
                    </View>
                </View>
                <Highcharts
                    aggregates={this.props.collections.get("readings-daily-aggregates") || Map()}
                    charts={this.props.home.charts}
                    height={height * 0.2}
                />
                <View style={styles.switchContainer}>
                    <Switch
                        onValueChange={this.props.toggleForecast}
                        style={styles.switch}
                        value={this.props.home.charts.length === 2}
                    />
                    <View style={styles.switchTextContainer}>
                        <Text style={styles.switchTextHeader}>{"Consumi previsti"}</Text>
                        <Text style={styles.switchText}>{"basati sulla tua giornata tipo"}</Text>
                    </View>
                </View>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <Content style={{backgroundColor: background}}>
                <View style={{height: height * 0.35}}>
                    <Text>{"Home page"}</Text>
                    <TouchableOpacity onPress={this.onLogout.bind(this)}>
                        <Text>{"logout"}</Text>
                    </TouchableOpacity>
                </View>
                <Swiper height={height * 0.55} index={1} loop={false} showButtons={true}>
                    <View>
                        <Text>{"Consumi"}</Text>
                    </View>
                    <View>
                        {this.renderSecondSwitchView(height)}
                    </View>
                    <View>
                        <Text>{"Grafico a torta"}</Text>
                    </View>
                </Swiper>
            </Content>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        home: state.home
    };
}
function mapDispatchToProps (dispatch) {
    return {
        toggleForecast: bindActionCreators(toggleForecast, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
