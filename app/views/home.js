import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, StyleSheet, Switch, View, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {Content} from "native-base";
import Swiper from "react-native-swiper";
import moment from "moment";

import Text from "../components/text-lato";
import Highcharts from "../components/highchart";
import {background} from "../lib/colors";

const styles = StyleSheet.create({
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
            <Content style={{backgroundColor: background}}>
                <View style={{height: height * 0.35}}>
                    <Text>{"Home page"}</Text>
                    <TouchableOpacity onPress={this.onLogout.bind(this)}>
                        <Text>{"logout"}</Text>
                    </TouchableOpacity>
                </View>
                <Swiper height={height * 0.55} index={0} loop={false} showButtons={true}>
                    <View>
                        <View style={{height: height * 0.2}}>
                            <Text>{"Altro"}</Text>
                        </View>
                        <Highcharts height={height * 0.2} />
                        <View>
                            <Switch style={styles.switch} />
                        </View>
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
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Home);
