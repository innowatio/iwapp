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
import {mapWeatherIcon, mapWeatherBackground} from "../lib/weather-mapper";

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
        site: PropTypes.object,
        toggleForecast: PropTypes.func.isRequired
    }

    componentDidMount () {
        this.props.asteroid.subscribe("sites");
        if (this.props.site) {
            this.subscribeToMeasure(this.props);
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.site) {
            this.subscribeToMeasure(nextProps);
        }
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
            "dailyMeasuresBySensor",
            charts[0].sensorId,
            moment.utc().format("YYYY-MM-DD"),
            moment.utc().format("YYYY-MM-DD"),
            "reading",
            "maxPower"
        );
        props.asteroid.subscribe(
            "yearlyConsumptions",
            charts[0].sensorId,
            moment.utc().format("YYYY"),
            "reading",
            "activeEnergy"
        );
        props.asteroid.subscribe(
            "yearlyConsumptions",
            `${charts[0].sensorId}-peers-avg`,
            moment.utc().format("YYYY"),
            "reading",
            "activeEnergy"
        );
        props.asteroid.subscribe(
            "yearlyConsumptions",
            `${charts[0].sensorId}-standby`,
            moment.utc().format("YYYY"),
            "reading",
            "activeEnergy"
        );
    }

    getConsumptionAggregate () {
        return this.props.collections.get("consumptions-yearly-aggregates") || Map();
    }

    getDailyAggregate () {
        return this.props.collections.get("readings-daily-aggregates") || Map();
    }

    getYearlyAggregate (sensorId) {
        const aggregate = this.getConsumptionAggregate().get(sensorId);
        if (aggregate) {
            const measurements = aggregate.get("measurementValues").split(",") ;
            const measurementsTotal = measurements.reduce((prev, current) => {
                return prev + (parseFloat(current) || 0);
            }, 0);
            return {
                days: measurements.length,
                total: measurementsTotal,
                unit: aggregate.get("unitOfMeasurement")
            };
        }
    }

    getPeersData () {
        return this.getYearlyAggregate(`${this.props.site._id}-peers-avg-${moment().year()}-reading-activeEnergy`);
    }

    getConsumptionData () {
        return this.getYearlyAggregate(`${this.props.site._id}-${moment().year()}-reading-activeEnergy`);
    }

    getInfoConsumptionData () {
        return this.props.site ? {
            consumptions: this.getConsumptionData(),
            peersConsumptions: this.getPeersData(),
        } : null;
    }

    getWeatherData () {
        if (this.props.site) {
            this.props.asteroid.subscribe("readingsRealTimeAggregatesBySite", this.props.site._id);
            const realtime = this.props.collections.get("readings-real-time-aggregates");
            if (realtime) {
                const weatherId = realtime.find(x => x.get("measurementType") === "weather-id");
                const weatherCloudness = realtime.find(x => x.get("measurementType") === "weather-cloudness");
                const weatherHumidity = realtime.find(x => x.get("measurementType") === "weather-humidity");
                const weatherTemperature = realtime.find(x => x.get("measurementType") === "weather-temperature");
                return {
                    cloudness: weatherCloudness ? weatherCloudness.get("measurementValue") : 0,
                    cloudnessUnit: weatherCloudness ? weatherCloudness.get("unitOfMeasurement") : "%",
                    humidity: weatherHumidity ? weatherHumidity.get("measurementValue") : 0,
                    humidityUnit: weatherHumidity ? weatherHumidity.get("unitOfMeasurement") : "%",
                    temperature: weatherTemperature ? weatherTemperature.get("measurementValue") : 0,
                    temperatureUnit: weatherTemperature ? weatherTemperature.get("unitOfMeasurement") : "°C",
                    icon: weatherId ? mapWeatherIcon(weatherId.get("measurementValue")) : "iw-clouds",
                    background: weatherId ? mapWeatherBackground(weatherId.get("measurementValue")) : require("../assets/img/day_scattered-clouds.gif"),
                };
            }
        }
        return {
            cloudness: 0,
            cloudnessUnit: "%",
            humidity: 0,
            humidityUnit: "%",
            temperature: 0,
            temperatureUnit: "°C",
            background: require("../assets/img/day_scattered-clouds.gif")
        };
    }

    render () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.58;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={{height: height * 0.32}}>
                        <Weather
                            {...this.getWeatherData()}
                        />
                    </View>
                    <Swiper height={heightSwiper} index={0} loop={false} showButtons={true}>
                        <View>
                            <InfoConsumption
                                heightSwiper={heightSwiper}
                                {...this.getInfoConsumptionData()}
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
                            <Text style={{color: colors.textGrey}}>{"Grafico a torta"}</Text>
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
        home: state.home,
        site: state.site
    };
}
function mapDispatchToProps (dispatch) {
    return {
        toggleForecast: bindActionCreators(toggleForecast, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
