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

    constructor () {
        super();
        this.state = {
            showMenuItems: true
        };
    }

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        onTriggerClose: PropTypes.func
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    onSelectionChanged () {
        this.triggerClose();
    }

    onToggleItems (showItems) {
        this.setState({
            showMenuItems: showItems
        });
    }

    navigateTo (item) {
        return () => {
            this.triggerClose();
            Actions[item.navigateTo]();
        };
    }

    triggerClose () {
        const {onTriggerClose} = this.props;
        onTriggerClose();
    }

    renderMenuItems () {
        const items = [
            {
                icon: "overview",
                title: "Overview",
                navigateTo: "home"
            }, {
                icon: "chart",
                title: "Statistiche",
                navigateTo: "stats"
            }, {
                icon: "gauge",
                title: "Il mio smartmeter",
                navigateTo: "home"
            }, {
                icon: "badge",
                title: "Badgeboard",
                navigateTo: "home"
            }, {
                icon: "lightbulb",
                title: "Risparmio energetico",
                navigateTo: "home"
            }, {
                icon: "report",
                title: "Report",
                navigateTo: "home"
            }
        ];
        return items.map(item => (
            <ListItem key={item.icon} style={{borderColor: colors.primaryBlue}}>
                <TouchableOpacity onPress={this.navigateTo(item)} style={styles.rightIcon}>
                    <Icon name={`iw-${item.icon}`} size={24} style={styles.itemIcon} />
                    <Text style={styles.itemText}>{item.title}</Text>
                </TouchableOpacity>
            </ListItem>
        ));
    }

    renderMenu () {
        const {height} = Dimensions.get("window");
        const {showMenuItems} = this.state;
        return showMenuItems ? (
            <View>
                <View style={{height: (height * .78), backgroundColor: colors.primaryBlue}}>
                    <List>
                        {this.renderMenuItems()}
                    </List>
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
            </View>
        ) : null;
    }

    render () {
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
            <View>
                <DropDown
                    onSelectionChanged={::this.onSelectionChanged}
                    onToggleItems={::this.onToggleItems}
                    optionItems={items}
                    titlePlaceholder={"Progetto XYZ"}
                />

                {this.renderMenu()}
            </View>
        );
    }
}
