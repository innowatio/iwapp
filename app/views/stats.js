import React, {Component} from "react";
import {Dimensions, View, StyleSheet} from "react-native";
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
    tabWrp: {

    },
    tabWrpActive: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    tab: {
        color: colors.white
    },

    contentStatsWrp: {
        padding: 20,
        alignItems: "center"
    },
    titleSwiper: {
        color: colors.primaryBlue,
        textAlign: "center"
    },
    consumptionWrp: {
        backgroundColor: colors.primaryBlue,
        width: 120,
        height: 120,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5
    },
    consumptionValue: {
        color: colors.white,
        fontSize: 60,
        fontWeight: "bold"
    },
    consumptionMeasure: {
        color: colors.white,
        fontSize: 20
    }
});

class Stats extends Component {

    renderTab1 () {
        return (
            <View style={styles.contentStatsWrp}>
                <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
                <View style={styles.consumptionWrp}>
                    <Text style={styles.consumptionValue}>{"48"}</Text>
                    <Text style={styles.consumptionMeasure}>{"kWh"}</Text>
                </View>
                <Icon
                    color={colors.white}
                    name={"iw-alert"}
                    size={52}
                />
            </View>
        );
    }

    renderTabs () {
        return (
            <View style={styles.tabsContainer}>
                <View style={styles.tabWrpActive}>
                    <Text style={styles.tab}>{"GIORNO"}</Text>
                </View>
                <View style={styles.tabWrp}>
                    <Text style={styles.tab}>{"SETTIMANA"}</Text>
                </View>
                <View style={styles.tabWrp}>
                    <Text style={styles.tab}>{"MESE"}</Text>
                </View>
                <View style={styles.tabWrp}>
                    <Text style={styles.tab}>{"ANNO"}</Text>
                </View>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        const heightSwiper = height * 0.8;
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
                    <Swiper height={heightSwiper} index={1} loop={false} showButtons={true}>
                        <View>
                            {this.renderTab1()}
                        </View>
                        <View>
                            <Text style={styles.titleSwiper}>{"OGGI HAI UTILIZZATO"}</Text>
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
export default connect(mapStateToProps)(Stats);
