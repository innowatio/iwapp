import {Content, List, ListItem} from "native-base";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

import Icon from "./iwapp-icons";
import Text from "../components/text-lato";
import DropDown from "../components/dropdown";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
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

    static propTypes = {
        asteroid: PropTypes.object.isRequired
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    onSelectionChanged (event) {
        console.log(event);
    }

    render () {
        const {height} = Dimensions.get("window");
        const items = [{
            title: "Progetto XYZ"
        }, {
            title: "Progetto XYZ"
        }, {
            title: "Progetto XYZ"
        }, {
            title: "Progetto XYZ"
        }];
        return (
            <Content>
                <DropDown onSelectionChanged={this.onSelectionChanged.bind(this)} optionItems={items} titlePlaceholder={"Progetto XYZ"} />

                <View style={{height: height * .78, backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem>
                                <TouchableOpacity onPress={() => Actions.home()} style={styles.rightIcon}>
                                    <Icon name={"iw-overview"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Overview"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity onPress={() => Actions.stats()} style={styles.rightIcon}>
                                    <Icon name={"iw-chart"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Statistiche"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-gauge"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Il mio smartmeter"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-badge"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Badgeboard"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-lightbulb"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Risparmio energetico"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-report"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Report"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                        </List>
                    </Content>
                </View>

                <View style={{height: height * .22, backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem>
                                <TouchableOpacity onPress={this.onLogout.bind(this)} style={styles.rightIcon}>
                                    <Icon name={"iw-logout"} size={24} style={styles.itemIcon} />
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
