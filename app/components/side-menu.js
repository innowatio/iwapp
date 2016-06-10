import {Content, List, ListItem} from "native-base";
import React, {Component} from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

import IconIwwa from "./iwwa-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.secondaryBlue,
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        height: 50
    },
    rightIcon: {
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        paddingRight: 10
    },
    itemIcon: {
        color: colors.white,
        marginRight: 10
    },
    itemText: {
        color: colors.white
    }
});

export default class SideMenu extends Component {

    render () {
        const {height} = Dimensions.get("window");
        return (
            <Content>
                <View style={styles.header}>
                    <Text>{"Progetto XYZ"}</Text>
                </View>

                <View style={{height: height * .78, backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem>
                                <TouchableOpacity onPress={() => Actions.home()} style={styles.rightIcon}>
                                    <IconIwwa name={"iw-dashboard"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Overview"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity onPress={() => Actions.stats()} style={styles.rightIcon}>
                                    <IconIwwa name={"iw-chart-style1"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Statistiche"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <IconIwwa name={"iw-gauge"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Il mio smartmeter"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <IconIwwa name={"iw-assign"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Badgeboard"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <IconIwwa name={"iw-lightbulb"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Risparmio energetico"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                        </List>
                    </Content>
                </View>

                <View style={{height: height * .22, backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <IconIwwa name={"iw-logout"} size={20} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Logout"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                        </List>
                    </Content>
                </View>
            </Content>
        );
    }
}
