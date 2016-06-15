import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
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


    userAccessWrp: {
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    inputUserWrp: {
        flexDirection: "row"
    },
    labelInput: {
        height: 25,
        alignSelf: "flex-end"
    },
    textInput: {
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        color: colors.grey,
        height: 35
    },


    // STYLE FOR PROFILE PERCENTAGE COMPLETED
    titleModifyWrp: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
        backgroundColor: colors.titleLightBackground,
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    titleModify: {
        padding: 0,
        alignSelf: "center"
    },

    modifyPasswordWrp: {
    },
    passwordRowWrp: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey
    },
    iconModifyPassword: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        width: 32,
        height: 32,
        backgroundColor: colors.primaryBlue
    },
    inputModifyPassword: {
        color: colors.grey,
        height: 35
    }
});

class ModifyProfile extends Component {

    renderUserAccess () {
        const {width} = Dimensions.get("window");
        return (
            <View style={styles.iconsUserOptionsWrp}>
                <View style={styles.inputUserWrp}>
                    <Text style={[styles.labelInput, {width: width * 0.25}]}>{"Email"}</Text>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={"username@email.com"}
                        placeholder={"username@email.com"}
                        placeholderTextColor={colors.grey}
                        style={[styles.textInput, {width: width * 0.65}]}
                        underlineColorAndroid={colors.lightGrey}
                        value={"username@email.com"}
                    />
                </View>
                <View style={styles.inputUserWrp}>
                    <Text style={[styles.labelInput, {width: width * 0.25}]}>{"Username"}</Text>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={"Username"}
                        placeholder={"Username"}
                        placeholderTextColor={colors.lightGrey}
                        style={[styles.textInput, {width: width * 0.65}]}
                        underlineColorAndroid={colors.lightGrey}
                        value={"Username"}
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
                    <View style={styles.iconModifyPassword}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-lock"
                            size={23}
                        />
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={"password"}
                        placeholder={"Password Attuale"}
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.75}]}
                        underlineColorAndroid={"transparent"}
                        value={"Password Attuale"}
                    />
                </View>
                <View style={styles.passwordRowWrp}>
                    <View style={styles.iconModifyPassword}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-lock"
                            size={23}
                        />
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={"nuova-password"}
                        placeholder={"Nuova Password"}
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.75}]}
                        underlineColorAndroid={"transparent"}
                        value={"Nuova Password"}
                    />
                </View>
                <View style={styles.passwordRowWrp}>
                    <View style={styles.iconModifyPassword}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-lock"
                            size={23}
                        />
                    </View>
                    <TextInput
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        keyboardType={"default"}
                        onChangeText={"ripeti-password"}
                        placeholder={"Ripeti nuova Password"}
                        placeholderTextColor={"white"}
                        secureTextEntry={true}
                        style={[styles.inputModifyPassword, {width: width * 0.75}]}
                        underlineColorAndroid={"transparent"}
                        value={"Ripeti nuova Password"}
                    />
                </View>
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
                    <View style={[styles.userAccessWrp, {height: height * 0.2}]}>
                        {this.renderUserAccess()}
                    </View>
                    <View style={styles.titleModifyWrp}>
                        <Text style={styles.titleModify}>{"Modifica Password"}</Text>
                        <FaIcons name={"angle-down"} size={26} />
                    </View>
                    <View style={{height: height * 0.7}}>
                        {this.renderModifyPassword()}
                    </View>
                    <View style={{height: height * 0.1}}>
                        <Button containerStyle={styles.buttonLogin}>
                            <Text style={styles.buttonLoginText}>{"SALVA"}</Text>
                        </Button>
                        <Button>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-reset"
                                size={23}
                            />
                        </Button>
                    </View>
                </Content>
            </View>
        );
    }
}

export default ModifyProfile;
