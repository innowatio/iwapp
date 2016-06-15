import {Content, List, ListItem} from "native-base";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";
import {Actions} from "react-native-router-flux";

import Icon from "./iwapp-icons";
import Text from "../components/text-lato";
import DropDown from "../components/drop-down";
import * as colors from "../lib/colors";

// FIXME: NativeBase problem
console.ignoredYellowBox = ['Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `ListItemNB`.'];

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

    getItemList () {
        return [
            {navigationTo: "home", icon: "iw-overview", text: "Overview"},
            {navigationTo: "stats", icon: "iw-chart", text: "Statistiche"}
        ];
    }

    renderItemList (item, index) {
        return (
            <ListItem key={index} style={{borderColor: colors.primaryBlue}}>
                <TouchableOpacity onPress={() => Actions[item.navigationTo]()} style={styles.rightIcon}>
                    <Icon name={item.icon} size={24} style={styles.itemIcon} />
                    <Text style={styles.itemText}>{item.text}</Text>
                </TouchableOpacity>
            </ListItem>
        );
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

                <View style={{height: (height * .78), backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem key={"overview"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity onPress={() => Actions.home()} style={styles.rightIcon}>
                                    <Icon name={"iw-overview"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Overview"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem key={"chart"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity onPress={() => Actions.stats()} style={styles.rightIcon}>
                                    <Icon name={"iw-chart"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Statistiche"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem key={"gauge"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-gauge"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Il mio smartmeter"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem key={"badge"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-badge"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Badgeboard"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem key={"lightbulb"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-lightbulb"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Risparmio energetico"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                            <ListItem key={"report"} style={{borderColor: colors.primaryBlue}}>
                                <TouchableOpacity style={styles.rightIcon}>
                                    <Icon name={"iw-report"} size={24} style={styles.itemIcon} />
                                    <Text style={styles.itemText}>{"Report"}</Text>
                                </TouchableOpacity>
                            </ListItem>
                        </List>
                    </Content>
                </View>
                <View style={{height: (height * .22) - (74), backgroundColor: colors.primaryBlue}}>
                    <Content>
                        <List>
                            <ListItem key={"logout"} style={{borderColor: colors.primaryBlue}}>
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
