import {Map} from "immutable";
import moment from "moment";
import {Content} from "native-base";
import Button from "react-native-button";
import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, Modal, StyleSheet, View} from "react-native";
import {connect} from "react-redux";
import Swiper from "react-native-swiper";
import {bindActionCreators} from "redux";

import ChartConsumption from "../components/chart-consumption";
import InfoConsumption from "../components/info-consumption";
import Weather from "../components/weather";
import Text from "../components/text-lato";
import Icon from "../components/iwapp-icons";
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
    },

    modalBackground: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.backgroundModal
    },
    modalTitleWrp: {
        backgroundColor: colors.buttonPrimary,
        paddingVertical: 5
    },
    logoInnowatio: {
        padding: 0,
        margin: 0,
        height: 80
    },
    titleModal: {
        color: colors.white,
        textAlign: "center"
    },
    textBold: {
        fontWeight: "bold",
        fontSize: 16
    },

    modalContentWrp: {
        backgroundColor: colors.secondaryBlue,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    descriptionModal: {
        color: colors.white,
        textAlign: "center",
        marginTop: 10
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: colors.buttonPrimary,
        width: 200,
        paddingVertical: 5,
        borderRadius: 50
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "300"
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

    constructor (props) {
        super(props);
        this.state  = {
            animationType: "none",
            modalVisible: false,
            transparent: false,
        };
    }

    componentDidMount () {
        this.props.asteroid.subscribe("sites");
        this.subscribeToMeasure(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.subscribeToMeasure(nextProps);
    }

    setModalVisible (visible) {
        this.setState({modalVisible: visible});
    }

    setAnimationType (type) {
        this.setState({animationType: type});
    }

    toggleTransparent () {
        this.setState({transparent: !this.state.transparent});
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

    getInfoConsumptionsData () {
        if (this.props.site) {
            const yearConsumptions = this.getConsumptionAggregate().get(`${this.props.site._id}-${moment().year()}-reading-activeEnergy`);
            if (yearConsumptions) {
                const measurements = yearConsumptions.get("measurementValues").split(",") ;
                const measurementsTotal = measurements.reduce((prev, current) => {
                    return prev + parseFloat(current);
                }, 0);
                return {
                    consumptionsMean: (measurementsTotal / measurements.length).toFixed(2),
                    consumptionsMeanUnit: yearConsumptions.get("unitOfMeasurement"),
                    consumptionsSimilar: (measurementsTotal / measurements.length - 2.8).toFixed(2),
                    consumptionsSimilarUnit: yearConsumptions.get("unitOfMeasurement")
                };
            }
        }
        return {
            consumptionsMean: "0",
            consumptionsMeanUnit: "kWh",
            consumptionsSimilar: "0",
            consumptionsSimilarUnit: "kWh"
        };
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

    renderSurveyModal () {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalTitleWrp}>
                        <Text style={styles.titleModal}>{"SUPER USER"}</Text>
                    </View>
                    <View style={styles.modalContentWrp}>

                        <View style={styles.badgeIconActive}>
                            <Icon color={colors.iconWhite} name={"iw-innowatio-logo"} size={100} style={styles.logoInnowatio} />
                        </View>
                        <Text style={styles.descriptionModal}>
                            <Text style={styles.textBold}>{"BENVENUTO SU LUCY!"}</Text>
                            {"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a posuere magna."}
                        </Text>
                        <Button
                            containerStyle={styles.modalButton}
                            onPress={this.setModalVisible.bind(this, false)}
                            style={styles.modalButtonText}
                        >
                            {"VAI AL QUESTIONARIO"}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }


    render () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.54;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={{height: height * 0.34}}>
                        <Weather
                            {...this.getWeatherData()}
                        />
                    </View>
                    <Button
                        onPress={this.setModalVisible.bind(this, true)}
                        style={{backgroundColor: colors.buttonPrimary, color: colors.white}}
                    >
                        {"APRI MODALE"}
                    </Button>
                    <Swiper height={heightSwiper} index={1} loop={false} showButtons={true}>
                        <View>
                            <InfoConsumption
                                heightSwiper={heightSwiper}
                                {...this.getInfoConsumptionsData()}
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
                    {this.renderSurveyModal()}
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
