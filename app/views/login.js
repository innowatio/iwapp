import React, {Component, PropTypes} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import {partial} from "ramda";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    inputEmail: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1
    },
    inputPassword: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1
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
            <View style={styles.container}>
                <TextInput
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    onChangeText={partial(::this.onChangeText, ["email"])}
                    placeholder={"Email"}
                    style={styles.inputEmail}
                    value={this.state.email}
                />
                <TextInput
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    keyboardType={"default"}
                    onChangeText={partial(::this.onChangeText, ["password"])}
                    placeholder={"Password"}
                    secureTextEntry={true}
                    style={styles.inputPassword}
                    value={this.state.password}
                />
                <TouchableOpacity onPress={::this.onLogin}>
                    <Text>{"LOGIN"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
