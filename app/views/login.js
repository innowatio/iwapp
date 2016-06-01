import React, {Component, PropTypes} from "react";
import {Image, Linking, StyleSheet, TextInput, View} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import {partial} from "ramda";

import Text from "../components/text-lato";

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
        alignSelf: "cover",
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
    inputEmailWrp: {
        borderWidth: 1,
        borderColor: "#979fd1",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 4
    },
    inputPasswordWrp: {
        borderWidth: 1,
        borderColor: "#979fd1",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 4
    },
    inputEmail: {
        height: 40,
        color: "white",
        fontFamily: "lato"
    },
    inputPassword: {
        height: 40,
        color: "white",
        fontFamily: "lato"
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
            password: undefined
        };
    }

    onLogin () {
        const credentials = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.asteroid.loginWithPassword(credentials)
            .then(Actions.logged)
            .catch(Actions.errorLogin);
    }

    onChangeText (textType, text) {
        this.setState({[textType]: text});
    }

    render () {
        return (
            <Image source={require("../assets/img/bg_login.png")} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <Text style={styles.logoTitle}>{"e-coach"}</Text>
                    <Text style={styles.logoDescription}>{"innowatio"}</Text>
                    <View style={styles.inputEmailWrp}>
                        <TextInput
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            keyboardType={"email-address"}
                            onChangeText={partial(::this.onChangeText, ["email"])}
                            placeholder={"Email"}
                            placeholderTextColor={"white"}
                            style={styles.inputEmail}
                            value={this.state.email}
                        />
                    </View>
                    <View style={styles.inputPasswordWrp}>
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
                    <Text style={styles.linkText}
                        onPress={() => Linking.openURL("#")}
                    >
                        {"Hai dimenticato la password?"}
                    </Text>
                    <Button
                        containerStyle={styles.buttonLogin}
                        onPress={::this.onLogin}
                    >
                        <Text style={styles.buttonLoginText}>{"ACCEDI"}</Text>
                    </Button>
                    <View style={styles.linkSignupWrp}>
                        <Text style={styles.linkText}
                            onPress={() => Linking.openURL("#")}
                        >
                            {"Non hai un account? Registrati!"}
                        </Text>
                    </View>
                </View>
            </Image>
        );
    }
}
