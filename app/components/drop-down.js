import {List, ListItem} from "native-base";
import React, {Component, PropTypes} from "react";
import {Animated, Dimensions, StyleSheet, View, TouchableOpacity} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome";

import Text from "./text-lato";
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
    view: {
        borderTopWidth: 1,
        borderTopColor: colors.white,
        backgroundColor: colors.secondaryBlue
    },
    projectContainer: {
        borderColor: colors.secondaryBlue,
        padding: 0,
        paddingLeft: 20
    },
    projectItem: {
        alignItems: "center",
        flexDirection: "row",
        height: 50
    },
    projectText: {
        color: colors.white
    }
});

export default class DropDown extends Component {

    static propTypes = {
        onSelectionChanged: PropTypes.func.isRequired,
        onToggleItems: PropTypes.func.isRequired,
        optionItems: PropTypes.array.isRequired,
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
        const {onToggleItems} = this.props;
        onToggleItems(this.state.showItems);

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
            this.toggleItems();
        };
    }

    renderOptionItems () {
        const {optionItems} = this.props;
        return optionItems.map((item, index) => (
            <ListItem key={index} style={styles.projectContainer}>
                <TouchableOpacity onPress={this.selectionChanged({index: index, selection: item})} style={styles.projectItem}>
                    <Text style={styles.projectText}>{item.title}</Text>
                </TouchableOpacity>
            </ListItem>
        ));
    }

    renderDropDown () {
        const {height} = Dimensions.get("window");
        return this.state.showItems ? (
            <Animated.View style={[
                styles.view,
                {
                    height: height - 74,
                    transform: [{
                        translateY: this.state.slidingAnimationValue
                    }]
                }
            ]}
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
                        <FaIcons name={this.state.showItems ? "angle-up" : "angle-down"} size={26} style={styles.itemIcon} />
                    </View>
                </TouchableOpacity>
                {this.renderDropDown()}
            </View>
        );
    }
}
