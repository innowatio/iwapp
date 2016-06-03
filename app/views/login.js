import React, {Component, PropTypes} from "react";
import {Image, StatusBar, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import {partial} from "ramda";

import Text from "../components/text-lato";
import TextInput from "../components/text-input-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        flexDirection: "column",
        padding: 20
    },
    backgroundImage: {
        width: null,
        height: null,
        flex: 1
    },
    logoTitle: {
        color: "white",
        marginBottom: 0,
        fontSize: 26
    },
    logoDescription: {
        color: "white",
        marginBottom: 30,
        fontSize: 14
    },
    inputWrp: {
        borderWidth: 1,
        borderColor: "#979fd1",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: "stretch"
    },
    inputSeparator: {
        borderTopWidth: 1,
        borderColor: "#979fd1"
    },
    inputEmail: {
        height: 40,
        color: "white",
        fontFamily: "lato",
        margin: 4
    },
    inputPassword: {
        height: 40,
        color: "white",
        fontFamily: "lato",
        margin: 4
    },
    buttonLogin: {
        padding:10,
        width:200,
        height:40,
        overflow:"hidden",
        borderRadius:15,
        backgroundColor: "#E2417D",
        marginTop: 25
    },
    buttonLoginText: {
        color: "white",
        fontSize: 16,
        textAlign: "center"
    },
    linkSignupWrp: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
    linkText: {
        color: "white",
        marginTop: 8
    },
    errorLoginContainer: {
        borderWidth: 1,
        borderColor: colors.borderErrorLogin,
        backgroundColor: colors.backgroundErrorLogin,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: "stretch",
        marginBottom: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    errorLogin: {
        fontWeight: "bold",
        alignSelf: "center",
        margin: 20
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
        const credentials = {
            email: this.state.email,
            password: this.state.password
        };
        this.setLoginError(null);
        this.props.asteroid.loginWithPassword(credentials).catch(::this.setLoginError);
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
        return this.state.loginError ? (
            <View style={styles.errorLoginContainer}>
                <Text style={styles.errorLogin}>
                    {"Login non riuscito: email o password errate"}
                </Text>
            </View>
        ) : null;
    }

    render () {
        return (
            <Image source={require("../assets/img/bg_login.png")} style={styles.backgroundImage}>
                <StatusBar hidden={true} />
                <View style={styles.container}>
                    <Text style={styles.logoTitle}>{"e-coach"}</Text>
                    <Text style={styles.logoDescription}>{"innowatio"}</Text>
                    {this.renderErrorLogin()}
                    <View style={styles.inputWrp}>
                        <TextInput
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            keyboardType={"email-address"}
                            onChangeText={partial(::this.onChangeText, ["email"])}
                            placeholder={"Email"}
                            placeholderTextColor={"white"}
                            style={styles.inputEmail}
                            underlineColorAndroid={"transparent"}
                            value={this.state.email}
                        />
                        <View style={styles.inputSeparator} />
                        <TextInput
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            keyboardType={"default"}
                            onChangeText={partial(::this.onChangeText, ["password"])}
                            placeholder={"Password"}
                            placeholderTextColor={"white"}
                            secureTextEntry={true}
                            style={styles.inputPassword}
                            underlineColorAndroid={"transparent"}
                            value={this.state.password}
                        />
                    </View>
                    <Text style={styles.linkText}>
                        {"Hai dimenticato la password?"}
                    </Text>
                    <Button
                        containerStyle={styles.buttonLogin}
                        onPress={::this.onLogin}
                    >
                        <Text style={styles.buttonLoginText}>{"ACCEDI"}</Text>
                    </Button>
                    <View style={styles.linkSignupWrp}>
                        <Text style={styles.linkText}>
                            {"Non hai un account? Registrati!"}
                        </Text>
                    </View>
                </View>
            </Image>
        );
    }
}
