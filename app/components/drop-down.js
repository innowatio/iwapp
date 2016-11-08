import {ListItem} from "native-base";
import {isEmpty} from "ramda";
import React, {Component, PropTypes} from "react";
import {Animated, Dimensions, StyleSheet, ScrollView, View, TouchableOpacity, TextInput} from "react-native";
import FaIcons from "react-native-vector-icons/FontAwesome";
import {heightWithoutHeader} from "../lib/const";

import Text from "./text-lato";
import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import Scroll from "./scroll";

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.secondaryBlue,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        paddingHorizontal: 18
    },
    itemIcon: {
        color: colors.white
    },
    view: {
        borderTopWidth: 1,
        borderTopColor: colors.white,
        backgroundColor: colors.secondaryBlue
    },
    projectContainer: {
        borderColor: colors.secondaryBlue,
        padding: 0,
    },
    projectItem: {
        alignItems: "center",
        flexDirection: "row"
    },
    projectText: {
        color: colors.white
    },
    textInputWrp: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 100,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 15,
        marginVertical: 10
    },
    textInput: {
        padding: 2,
        fontSize: 12,
        color: colors.white
    },
    inputIcon: {
        backgroundColor: colors.transparent,
        marginLeft: 10,
        marginRight: 5
    },
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
            slidingAnimationValue: new Animated.Value(0),
            beforeScroll: true,
            toScroll: false,
            searchText: "",
        };
    }

    onChangeText (searchText) {
        this.setState({searchText});
    }

    onContentSizeChange (contentWidth, contentHeight) {
        const {height} = Dimensions.get("window");
        // FIXME: to search the exact height when to scroll
        this.setState({toScroll: (heightWithoutHeader(height) * 80 / 100) < contentHeight});
    }

    onScroll () {
        if (this.state.beforeScroll) {
            this.setState({beforeScroll: false});
        }
    }

    toggleItems () {
        this.setState({
            showItems: !this.state.showItems,
            beforeScroll: true
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

    renderOptionItems (filtered) {
        const {width, height} = Dimensions.get("window");
        return filtered.map((item, index) => (
            <ListItem key={index} style={styles.projectContainer}>
                <TouchableOpacity
                    onPress={this.selectionChanged({index, selection: item})}
                    style={[styles.projectItem, {alignItems: "center", justifyContent: "flex-start", height: height * .08}]}
                >
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={[styles.projectText, {width: width * .56}]}>{item.title}</Text>
                </TouchableOpacity>
            </ListItem>
        ));
    }

    renderList () {
        const self = this;
        const filtered = this.props.optionItems.filter(function (d) {
            return d.title.toLowerCase().indexOf(self.state.searchText.toLowerCase())>-1;
        });
        return isEmpty(filtered)
        ? null : (
        <ScrollView
            onContentSizeChange={::this.onContentSizeChange}
            onScroll={::this.onScroll}
            scrollEventThrottle={1000}
        >
            {this.renderOptionItems(filtered)}
        </ScrollView>
        );
    }

    renderDropDown () {
        const {height, width} = Dimensions.get("window");
        return this.state.showItems ? (
            <View>
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
                    <View style={[styles.textInputWrp]}>
                        <Icon
                            color={colors.white}
                            name={"iw-search"}
                            size={width * .05}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            autoCorrect={false}
                            keyboardType={"default"}
                            onChangeText={(searchText) => this.onChangeText(searchText)}
                            placeholder="Cerca un sito"
                            placeholderTextColor={colors.white}
                            style={[styles.textInput, {height: height * .046, width: width * .46}]}
                            underlineColorAndroid={colors.transparent}
                            value={this.state.searchText}
                        />
                    </View>
                    {this.renderList()}
                    <Scroll
                        style={{margin: height * .02, top: height * .75, alignItems: "flex-end"}}
                        visible={this.state.toScroll && this.state.beforeScroll}
                    />
                </Animated.View>
            </View>
        ) : null;
    }

    render () {
        const {width} = Dimensions.get("window");
        const {titlePlaceholder} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.toggleItems.bind(this)}>
                    <View style={styles.header}>
                        <Text
                            ellipsizeMode={"tail"}
                            numberOfLines={1}
                            style={{color: colors.white, width: width * .46}}
                        >
                            {titlePlaceholder ? titlePlaceholder : "Select an item"}
                        </Text>
                        <FaIcons
                            name={this.state.showItems ? "angle-up" : "angle-down"}
                            size={width * .07}
                            style={styles.itemIcon}
                        />
                    </View>
                </TouchableOpacity>
                {this.renderDropDown()}
            </View>
        );
    }
}
