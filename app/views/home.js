import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, Image, StyleSheet, Switch, View} from "react-native";
import {connect} from "react-redux";
import {Content} from "native-base";
import Swiper from "react-native-swiper";
import moment from "moment";

import Icon from "../components/iwwa-icons";
import Text from "../components/text-lato";
import Highcharts from "../components/highchart";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.transparent,
        flexDirection: "row"
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null
    },
    textHello: {
        color: colors.white,
        backgroundColor: colors.transparent,
        marginTop: 5,
        marginBottom: 45,
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: colors.backgroundBlackOpacity
    },
    weatherWrp: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.backgroundBlackOpacity
    },
    iconWrp: {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "space-around",
        paddingVertical: 10
    },
    climateVariablesWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    climateVariables: {
        paddingHorizontal: 10
    },
    labelPercentage: {
        color: colors.white,
        fontSize: 10,
        textAlign: "center"
    },
    textPercentage: {
        color: colors.white,
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center"
    },
    textDegreesWrp: {
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center"
    },
    textDegrees: {
        color: colors.white,
        fontSize: 66,
        textAlign: "center",
        fontWeight: "bold"
    },
    textDescDegrees: {
        color: colors.white,
        fontSize: 14,
        marginRight: 16,
        textAlign: "center"
    },
    switch: {
        alignSelf: "flex-start"
    }
});

class Home extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired
    }

    componentDidMount () {
        this.props.asteroid.subscribe("sites");
        this.subscribeToMisure(this.props);
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    subscribeToMisure (props) {
        const sensor = "IT001";
        const day = moment.utc().format("YYYY-MM-DD");
        const measurementType = "activeEnergy";
        const sources = ["reading", "forecast"];
        sources.forEach(source => {
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensor,
                day,
                day,
                source,
                measurementType
            );
        });
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={{height: height * 0.34}}>
                        <Image source={require("../assets/img/bg_meteo.png")} style={styles.backgroundImage}>
                            <Text style={styles.textHello}>{"Buongiorno!"}</Text>
                            <View style={styles.weatherWrp}>
                                <View>
                                    <View style={styles.iconWrp}>
                                        <Icon
                                            color="#fff"
                                            name="iw-calendar"
                                            size={55}
                                        />
                                    </View>
                                    <View style={styles.climateVariablesWrp}>
                                        <View style={styles.climateVariables}>
                                            <Text style={styles.labelPercentage}>
                                                {"UMIDITA'"}
                                            </Text>
                                            <Text style={styles.textPercentage}>{"100%"}</Text>
                                        </View>
                                        <View style={styles.climateVariables}>
                                            <Text style={styles.labelPercentage}>
                                                {"NUVOLOSITA'"}
                                            </Text>
                                            <Text style={styles.textPercentage}>{"100%"}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.textDegreesWrp}>
                                    <Text style={styles.textDegrees}>{"20°"}</Text>
                                    <Text style={styles.textDescDegrees}>
                                        {"TEMPERATURA \n ESTERNA"}
                                    </Text>
                                </View>
                            </View>
                        </Image>
                    </View>
                    <Swiper height={height * 0.56} index={0} loop={false} showButtons={true}>
                        <View>
                            <View style={{height: height * 0.1}}>
                                <Text>{"Altro"}</Text>
                            </View>
                            <Highcharts height={height * 0.25} />
                            <View>
                                <Switch style={styles.switch} />
                            </View>
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
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Home);
