import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import Button from "react-native-button";
import FaIcons from "react-native-vector-icons/FontAwesome";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import Text from "../components/text-lato";
import TextInput from "../components/text-input-lato";

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

    // STYLE FOR CHANGE USER AND EMAIL
    userAccessWrp: {
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: colors.lightGreyBorder,
        borderBottomWidth: 0.5
    },
    inputUserWrp: {
        flexDirection: "row"
    },
    labelInput: {
        height: 25,
        alignSelf: "flex-end",
        color: colors.textDarkGrey
    },
    textInput: {
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightGreyBorder,
        color: colors.grey,
        height: 35
    },


    // STYLE FOR CHANGE PASSWORD
    titleModifyWrp: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.titleLightBackground,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightGreyBorder
    },
    titleModify: {
        padding: 0,
        alignSelf: "center"
    },
    modifyPasswordWrp: {
    },
    passwordRowWrp: {
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.lightGreyBorder
    },
    passwordRow1Wrp: {
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderBottomColor: colors.lightGreyBorder,
        borderTopColor: colors.lightGreyBorder,
        marginTop: 22
    },
    iconModifyPassword: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        width: 40,
        height: 40,
        backgroundColor: colors.secondaryBlue
    },
    inputModifyPassword: {
        color: colors.grey,
        height: 30,
        marginTop: 4,
        padding: 0
    },

    // ERRORS ON TOP //
    errorPassword: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        backgroundColor: colors.backgroundErrorPassword
    },
    iconAlertWrp: {
        backgroundColor: colors.backgroundIconErrorPassword,
        borderRadius: 100,
        width: 35,
        height: 35,
        marginLeft: 15,
        marginVertical: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    textErrors: {
        color: colors.white,
        margin: 5
    },

    // BUTTON SAVE
    buttonSaveWrp: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonSave: {
        width: 150,
        height: 30,
        marginHorizontal: 10,
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        justifyContent: "center"
    },
    buttonReset: {

    },
    textButtonSave: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "normal"
    }
});

class ModifyProfile extends Component {

    constructor (props) {
        super(props);
        this.state = {
            newEmail: "",
            newUsername: "",
            oldPassword: "",
            newPassword: "",
            newPasswordCheck: ""
        };
    }

    renderUserAccess () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.iconsUserOptionsWrp}>
                <View style={styles.inputUserWrp}>
                    <Text style={[styles.labelInput, {width: width * 0.25}]}>{"Email"}</Text>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"email-address"}
                        onChangeText={newEmail => this.setState({newEmail})}
                        placeholder={"Inserire la nuova email"}
                        placeholderTextColor={colors.grey}
                        style={[styles.textInput, {width: width * 0.65}]}
                        underlineColorAndroid={colors.lightGreyBorder}
                        value={this.state.newEmail}
                    />
                </View>
                <View style={styles.inputUserWrp}>
                    <Text style={[styles.labelInput, {width: width * 0.25}]}>{"Username"}</Text>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={newUsername => this.setState({newUsername})}
                        placeholder={"Inserire il nuovo username"}
                        placeholderTextColor={colors.grey}
                        style={[styles.textInput, {width: width * 0.65}]}
                        underlineColorAndroid={colors.lightGreyBorder}
                        value={this.state.newUsername}
                    />
                </View>
            </View>
        );
    }

    renderModifyPassword () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.modifyPasswordWrp}>
                <View style={styles.passwordRowWrp}>
                    <View style={{width: width * 0.15}}>
                        <View style={styles.iconModifyPassword}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-lock"
                                size={26}
                            />
                        </View>
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={oldPassword => this.setState({oldPassword})}
                        placeholder={"Password Attuale"}
                        placeholderTextColor={colors.grey}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.85}]}
                        underlineColorAndroid={"transparent"}
                        value={this.state.oldPassword}
                    />
                </View>
                <View style={styles.passwordRow1Wrp}>
                    <View style={{width: width * 0.15}}>
                        <View style={styles.iconModifyPassword}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-lock"
                                size={26}
                            />
                        </View>
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={newPassword => this.setState({newPassword})}
                        placeholder={"Nuova Password"}
                        placeholderTextColor={colors.grey}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.85}]}
                        underlineColorAndroid={"transparent"}
                        value={this.state.newPassword}
                    />
                </View>
                <View style={styles.passwordRowWrp}>
                    <View style={{width: width * 0.15}}>
                        <View style={styles.iconModifyPassword}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-lock"
                                size={26}
                            />
                        </View>
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={newPasswordCheck => this.setState({newPasswordCheck})}
                        placeholder={"Ripeti nuova Password"}
                        placeholderTextColor={colors.grey}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.85}]}
                        underlineColorAndroid={"transparent"}
                        value={this.state.newPasswordCheck}
                    />
                </View>
            </View>
        );
    }

    renderPasswordError () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.errorPassword}>
                <View style={{width: width * 0.15}}>
                    <View style={styles.iconAlertWrp}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-alert"
                            size={23}
                        />
                    </View>
                </View>
                <Text style={[styles.textErrors, {width: width * 0.85}]}>
                    {"Attenzione, le password non coincidono"}
                </Text>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"MODIFICA PROFILO"}</Text>
                        </View>
                    </View>
                    {this.renderPasswordError()}
                    <View style={[styles.userAccessWrp, {height: height * 0.18}]}>
                        {this.renderUserAccess()}
                    </View>
                    <View style={styles.titleModifyWrp}>
                        <Text style={styles.titleModify}>{"Modifica Password"}</Text>
                        <FaIcons name={"angle-down"} size={26} />
                    </View>
                    <View style={{height: height * 0.22}}>
                        {this.renderModifyPassword()}
                    </View>
                    <View style={[styles.buttonSaveWrp, {height: height * 0.3}]}>
                        <Button
                            containerStyle={[styles.buttonSave]}
                            style={styles.textButtonSave}
                        >
                            {"SALVA"}
                        </Button>
                        <TouchableOpacity style={[styles.buttonReset]}>
                            <Icon
                                color={colors.primaryBlue}
                                name="iw-reset"
                                size={23}
                            />
                        </TouchableOpacity>
                    </View>
                </Content>
            </View>
        );
    }
}

export default ModifyProfile;
