import React, {Component, PropTypes} from "react";
import {Dimensions, Modal, StyleSheet, View} from "react-native";
import {identity} from "ramda";
import Button from "react-native-button";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: colors.backgroundModalError,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    titleModal: {
        color: colors.white,
        fontSize: 16,
        textAlign: "center"
    },
    modalIconWrp: {
        backgroundColor: colors.backgroundIconModalError,
        borderRadius: 100,
        alignSelf: "center",
        justifyContent: "center",
    },
    modalIcon: {
        textAlign: "center",
        backgroundColor: colors.transparent
    },
    modalButtonWrp: {
        marginTop: 20,
        justifyContent: "center"
    },
    modalButton: {
        backgroundColor: colors.secondaryBlue,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    modalButtonText: {
        fontSize: 12,
        textAlign: "center",
        color: colors.white,
        fontWeight: "normal"
    }
});

export default class ErrorModal extends Component {

    static propTypes = {
        onPressButton: PropTypes.func.isRequired,
        onRequestClose: PropTypes.func,
        textButton: PropTypes.string,
        titleModal: PropTypes.string,
        visible: PropTypes.bool.isRequired
    }

    render () {
        const {height, width} = Dimensions.get("window");
        return (
            <Modal
                onRequestClose={this.props.onRequestClose || identity}
                transparent={false}
                visible={this.props.visible}
            >
                <View style={[styles.modalBackground, {height}]}>
                    <View style={styles.modalTitleWrp}>
                        <View style={[styles.modalIconWrp, {width: height * .25, height: height * .25}]}>
                            <Icon
                                color={colors.iconWhite}
                                name={"iw-alert"}
                                size={height * .16}
                                style={styles.modalIcon}
                            />
                        </View>
                        <View style={{paddingHorizontal: width * .2, paddingVertical: height * .06}}>
                            <Text style={styles.titleModal}>{this.props.titleModal || ""}</Text>
                        </View>
                    </View>
                    <View style={styles.modalButtonWrp}>
                        <Button
                            containerStyle={[styles.modalButton, {height: height * .05, width: width * .4}]}
                            onPress={this.props.onPressButton}
                        >
                            <Text style={styles.modalButtonText}>{this.props.textButton || "RIPROVA"}</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

}
