import React, {Component, PropTypes} from "react";
import {Dimensions, Image, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import {partial} from "ramda";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import TextInput from "../components/text-input-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.transparent,
        flexDirection: "column"
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        justifyContent: "center",
        alignItems: "center"
    },
    logoIcon: {
        height: 110,
        marginLeft: 20
    },
    logoTitle: {
        color: colors.white,
        margin: 0,
        fontSize: 20
    },
    logoDescription: {
        color: colors.white,
        fontSize: 14
    },
    errorLoginContainer: {
        borderWidth: 1,
        borderColor: colors.borderErrorLogin,
        backgroundColor: colors.backgroundErrorLogin,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    errorLogin: {
        fontSize: 13,
        fontWeight: "bold",
        color: colors.white
    },
    inputWrp: {
        borderWidth: 1,
        borderColor: colors.loginTextBorder,
        backgroundColor: colors.loginTextBackground,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: "stretch"
    },
    inputSeparator: {
        borderTopWidth: 1,
        borderColor: colors.loginTextBorder
    },
    inputIcon: {
        left: 10,
        width: 26,
        height: 26
    },
    textInputWrp: {
        top: 15
    },
    textInput: {
        height: 35,
        color: colors.white,
        fontSize: 14,
        paddingLeft: 45,
        top: -28
    },
    buttonLogin: {
        width: 200,
        height: 34,
        overflow: "hidden",
        borderRadius: 15,
        backgroundColor: colors.buttonPrimary,
        justifyContent: "center"
    },
    buttonLoginText: {
        color: colors.white,
        fontSize: 14,
        textAlign: "center"
    }
});

export default class Login extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired
    };

    constructor (props) {
        super(props);
        this.state = {
            email: undefined,
            password: undefined,
            errorLogin: false
        };
    }

    onLogin () {
        this.setLoginError(null);
        this.props.asteroid.login({
            sso: {
                username: this.state.email,
                password: this.state.password
            }
        }).catch(::this.setLoginError);
    }

    setLoginError (error) {
        this.setState({
            loginError: error ? true : false
        });
    }

    onChangeText (textType, text) {
        this.setState({[textType]: text});
    }

    renderErrorLogin () {
        const {height, width} = Dimensions.get("window");
        return this.state.loginError ? (
            <View style={[styles.errorLoginContainer, {width: width * .9, marginBottom: height * .02}]}>
                <Text style={[styles.errorLogin, {marginVertical: height * .02, marginHorizontal: width * .02}]}>
                    {"Login non riuscito: email o password errate"}
                </Text>
            </View>
        ) : null;
    }

    render () {
        const {width, height} = Dimensions.get("window");
        return (
            <Image source={require("../assets/img/bg_login.png")} style={styles.backgroundImage}>
                <View style={[styles.container, {width: width * .9}]}>
                    <Icon
                        color={colors.iconWhite}
                        name="iw-innowatio-logo"
                        size={height * .25}
                        style={[styles.logoIcon, {height: height * .21}]}
                    />
                    <Text style={styles.logoTitle}>{"Lucy"}</Text>
                    <Text style={[styles.logoDescription, {marginBottom: height * .05}]}>{"innowatio"}</Text>
                    {this.renderErrorLogin()}
                    <View style={styles.inputWrp}>
                        <View style={styles.textInputWrp}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-user"
                                size={26}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                keyboardType={"email-address"}
                                onChangeText={partial(::this.onChangeText, ["email"])}
                                placeholder={"Email"}
                                placeholderTextColor={colors.white}
                                style={[styles.textInput, {width: width * 0.9}]}
                                underlineColorAndroid={colors.transparent}
                                value={this.state.email}
                            />
                        </View>
                        <View style={styles.inputSeparator} />
                        <View style={styles.textInputWrp}>
                            <Icon
                                color={colors.iconWhite}
                                name="iw-lock"
                                size={26}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                keyboardType={"default"}
                                onChangeText={partial(::this.onChangeText, ["password"])}
                                placeholder={"Password"}
                                placeholderTextColor={colors.white}
                                secureTextEntry={true}
                                style={styles.textInput}
                                underlineColorAndroid={colors.transparent}
                                value={this.state.password}
                            />
                        </View>
                    </View>
                    <Button
                        containerStyle={[styles.buttonLogin, {marginVertical: height * .04}]}
                        onPress={::this.onLogin}
                    >
                        <Text style={[styles.buttonLoginText, {padding: height * .04}]}>{"ACCEDI"}</Text>
                    </Button>
                </View>
            </Image>
        );
    }
}
