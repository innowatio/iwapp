import {List, ListItem} from "native-base";
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
        flexDirection: "row"
    },
    logoutItemWrp: {
    },
    menuItem: {
        borderColor: colors.primaryBlue,
        padding: 0,
        paddingLeft: 10
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
        asteroid: PropTypes.object.isRequired,
        menuItems: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            navigateTo: React.PropTypes.string.isRequired
        })),
        onSelectSite: PropTypes.func.isRequired,
        onTriggerClose: PropTypes.func,
        optionItems: PropTypes.array.isRequired,
        site: PropTypes.object
    }

    static defaultProps = {
        menuItems: []
    }

    constructor () {
        super();
        this.state = {
            showMenuItems: true
        };
    }

    onLogout () {
        this.props.asteroid.logout();
    }

    onSelectionChanged (event) {
        this.props.onSelectSite(event.selection);
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

    renderMenuItems (items) {
        const {height} = Dimensions.get("window");
        return items.map(item => (
            <ListItem key={item.icon} style={styles.menuItem}>
                <TouchableOpacity onPress={this.navigateTo(item)} style={[styles.rightIcon, {marginTop: height * .04}]}>
                    <Icon name={`iw-${item.icon}`} size={height * .045} style={styles.itemIcon} />
                    <Text style={styles.itemText}>{item.title}</Text>
                </TouchableOpacity>
            </ListItem>
        ));
    }

    renderMenu () {
        const {height} = Dimensions.get("window");
        const {showMenuItems} = this.state;
        return showMenuItems ? (
            <View style={{height, backgroundColor: colors.primaryBlue}}>
                <View style={{justifyContent: "flex-start", height: height * .62}}>
                    <List>
                        {this.renderMenuItems(this.props.menuItems)}
                    </List>
                </View>
                <View style={[styles.logoutItemWrp, {justifyContent: "flex-end", height: height * .2}]}>
                    <List>
                        <ListItem key={"logout"} style={styles.menuItem}>
                            <TouchableOpacity
                                onPress={this.onLogout.bind(this)}
                                style={[styles.rightIcon, {marginTop: height * .04}]}
                            >
                                <Icon name={"iw-logout"} size={height * .045} style={styles.itemIcon} />
                                <Text style={styles.itemText}>{"Logout"}</Text>
                            </TouchableOpacity>
                        </ListItem>
                    </List>
                </View>
            </View>
        ) : null;
    }

    render () {
        const {site, optionItems} = this.props;
        const titlePlaceholder = site ? site.title : "Progetti";
        return (
            <View>
                <DropDown
                    onSelectionChanged={::this.onSelectionChanged}
                    onToggleItems={::this.onToggleItems}
                    optionItems={optionItems}
                    titlePlaceholder={titlePlaceholder}
                />
                {this.renderMenu()}
            </View>
        );
    }
}
