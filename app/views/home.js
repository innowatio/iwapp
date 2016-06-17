import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, View} from "react-native";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {bindActionCreators} from "redux";

import ChartConsumption from "../components/chart-consumption";
import InfoConsumption from "../components/info-consumption";
import Weather from "../components/weather";
import Text from "../components/text-lato";
import {toggleForecast} from "../actions/home";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    }
});

class Home extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired,
        home: PropTypes.shape({
            charts: PropTypes.arrayOf(PropTypes.shape({
                sensorId: PropTypes.string,
                source: PropTypes.string,
                measurementType: PropTypes.string,
                day: PropTypes.string
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
        });
        props.asteroid.subscribe(
            "yearlyConsumptions",
            charts[0].sensorId,
            moment.utc().format("YYYY"),
            "reading",
            "activeEnergy"
        );
        props.asteroid.subscribe(
            "dailyMeasuresBySensor",
            charts[0].sensorId,
            moment.utc().format("YYYY-MM-DD"),
            moment.utc().format("YYYY-MM-DD"),
            "reading",
            "maxPower"
        );
    }

    getConsumptionAggregate () {
        return this.props.collections.get("consumptions-yearly-aggregates") || Map();
    }

    getDailyAggregate () {
        return this.props.collections.get("readings-daily-aggregates") || Map();
    }

    render () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.54;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={{height: height * 0.34}}>
                        <Weather />
                    </View>
                    <Swiper height={heightSwiper} index={1} loop={false} showButtons={true}>
                        <View>
                            <InfoConsumption
                                heightSwiper={heightSwiper}
                            />
                        </View>
                        <View>
                            <ChartConsumption
                                charts={this.props.home.charts}
                                consumptionAggregates={this.getConsumptionAggregate()}
                                dailyAggregates={this.getDailyAggregate()}
                                heightSwiper={heightSwiper}
                                onToggleSwitch={this.props.toggleForecast}
                            />
                        </View>
                        <View>
                            <Text>{"Grafico a torta"}</Text>
                        </View>
                    </Swiper>
                </Content>
            </View>
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
