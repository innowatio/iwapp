import {Map} from "immutable";
import {getAverageByPeriod, subscribeDaily} from "iwwa-utils";
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
import {toggleForecast} from "../actions/home";
import {selectSite} from "../actions/site";
import * as colors from "../lib/colors";
import {mapWeatherIcon, mapWeatherBackground} from "../lib/weather-mapper";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
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
        selectSite: PropTypes.func.isRequired,
        site: PropTypes.object,
        toggleForecast: PropTypes.func.isRequired
    };

    constructor (props) {
        super(props);
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

    isForecastData () {
        const chart = this.props.home.charts[0];
        const day = moment.utc().format("YYYY-MM-DD");
        return !(this.props.collections.getIn(
                ["readings-daily-aggregates", `${chart.sensorId}-${day}-forecast-activeEnergy`]
            ) || Map()).isEmpty();
    }

    isStandbyData () {
        const chart = this.props.home.charts[0];
        const day = moment.utc().format("YYYY-MM-DD");
        return !(this.props.collections.getIn(
                ["readings-daily-aggregates", `${chart.sensorId}-standby-${day}-reading-activeEnergy`]
            ) || Map()).isEmpty();
    }

    subscribeToMeasure (props) {
        const chart = props.home.charts[0];
        if (chart.sensorId) {
            subscribeDaily(() => {
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    `${chart.sensorId}-standby`,
                    moment.utc().format("YYYY-MM-DD"),
                    moment.utc().add({day: 1}).format("YYYY-MM-DD"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    chart.sensorId,
                    moment.utc().subtract({week: 7}).format("YYYY-MM-DD"),
                    moment.utc().add({day: 1}).format("YYYY-MM-DD"),
                    "reading",
                    chart.measurementType
                );
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    chart.sensorId,
                    moment.utc().subtract({day: 1}).format("YYYY-MM-DD"),
                    moment.utc().add({day: 1}).format("YYYY-MM-DD"),
                    "forecast",
                    chart.measurementType
                );
                props.asteroid.subscribe(
                    "dailyMeasuresBySensor",
                    chart.sensorId,
                    moment.utc().subtract({day: 1}).format("YYYY-MM-DD"),
                    moment.utc().add({day: 1}).format("YYYY-MM-DD"),
                    "reading",
                    "maxPower"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    chart.sensorId,
                    moment.utc().format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    chart.sensorId,
                    moment.utc().subtract({year: 1}).format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    `${chart.sensorId}-peers-avg`,
                    moment.utc().format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    `${chart.sensorId}-peers-avg`,
                    moment.utc().subtract({year: 1}).format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    `${chart.sensorId}-standby`,
                    moment.utc().format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
                props.asteroid.subscribe(
                    "yearlyConsumptions",
                    `${chart.sensorId}-standby`,
                    moment.utc().subtract({year: 1}).format("YYYY"),
                    "reading",
                    "activeEnergy"
                );
            });
        }
    }

    getConsumptionAggregate () {
        return this.props.collections.get("consumptions-yearly-aggregates") || Map();
    }

    getDailyAggregate () {
        return this.props.collections.get("readings-daily-aggregates") || Map();
    }

    getYearlyAggregate (sensorId, measurementType) {
        const aggregate = this.getConsumptionAggregate().filter(agg => (
            agg.get("sensorId") === sensorId &&
            agg.get("measurementType") === measurementType)
        );
        if (aggregate.isEmpty()) {
            return null;
        }
        return {
            avg: getAverageByPeriod(aggregate, "day"),
            unit: aggregate.first().get("unitOfMeasurement")
        };
    }

    getPeersData () {
        return this.getYearlyAggregate(`${this.props.site._id}-peers-avg`, "activeEnergy");
    }

    getConsumptionData () {
        return this.getYearlyAggregate(this.props.site._id, "activeEnergy");
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
                const weatherCloudness = realtime.find(x => x.get("measurementType") === "weather-cloudeness");
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
        const heightSwiper = height * 0.6;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height}}>
                    <View>
                        <Weather
                            {...this.getWeatherData()}
                        />
                    </View>
                    <Swiper height={heightSwiper} index={1} loop={false} showButtons={true}>
                        <View>
                            <InfoConsumption
                                heightSwiper={heightSwiper}
                                site={this.props.site}
                                {...this.getInfoConsumptionData()}
                            />
                        </View>
                        <View>
                            <ChartConsumption
                                charts={this.props.home.charts}
                                consumptionAggregates={this.getConsumptionAggregate()}
                                dailyAggregates={this.getDailyAggregate()}
                                heightSwiper={heightSwiper}
                                isForecastData={this.isForecastData()}
                                isStandbyData={this.isStandbyData()}
                                onToggleSwitch={this.props.toggleForecast}
                            />
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
        selectSite: bindActionCreators(selectSite, dispatch),
        toggleForecast: bindActionCreators(toggleForecast, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
