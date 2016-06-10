import {List, ListItem} from "native-base";
import React, {Component, PropTypes} from "react";
import {Animated, Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";

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
    itemIcon: {
        color: colors.white,
        marginRight: 10
    },
    projectItem: {
        marginLeft: 15,
        color: colors.white
    }
});

export default class DropDown extends Component {

    static propTypes = {
        onSelectionChanged: PropTypes.func,
        optionItems: PropTypes.array,
        titlePlaceholder: PropTypes.string
    }

    constructor () {
        super();
        this.state = {
            showItems: false,
            slidingAnimationValue: new Animated.Value(0)
        };
    }

    toggleItems () {
        this.setState({
            showItems: !this.state.showItems
        });

        this.state.slidingAnimationValue.setValue(-25);

        Animated.spring(
            this.state.slidingAnimationValue,
            {
                toValue: 0,
                friction: 10,
                tension: 150
            }
        ).start();
    }

    selectionChanged (event) {
        const {onSelectionChanged} = this.props;
        return () => {
            onSelectionChanged(event);
        };
    }

    renderOptionItems () {
        const {optionItems} = this.props;
        return optionItems.map((item, index) => (
            <ListItem key={index}>
                <TouchableOpacity onPress={this.selectionChanged({index: index, selection: item})}>
                    <Text style={styles.projectItem}>{item.title}</Text>
                </TouchableOpacity>
            </ListItem>
        ));
    }

    renderDropDown () {
        const {height} = Dimensions.get("window");
        return this.state.showItems ? (
            <Animated.View style={{
                height: height,
                borderTopWidth: 1,
                borderTopColor: colors.white,
                backgroundColor: colors.secondaryBlue,
                transform: [
                    {translateY: this.state.slidingAnimationValue}
                ]
            }}
            >
                <List>
                    {this.renderOptionItems()}
                </List>
            </Animated.View>
        ) : null;
    }

    render () {
        const {titlePlaceholder} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.toggleItems.bind(this)}>
                    <View style={styles.header}>
                        <Text style={{color: colors.white}}>{titlePlaceholder ? titlePlaceholder : "Select an item"}</Text>
                        <IconIwwa name={this.state.showItems ? "iw-arrow-up" : "iw-arrow-down"} size={20} style={styles.itemIcon} />
                    </View>
                </TouchableOpacity>
                {this.renderDropDown()}
            </View>
        );
    }
}
