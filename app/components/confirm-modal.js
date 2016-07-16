import React, {Component, PropTypes} from "react";
import {Dimensions, Modal, StyleSheet, View} from "react-native";
import Button from "react-native-button";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    modalBackground: {
        backgroundColor: colors.secondaryBlue,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 30
    },
    titleModal: {
        color: colors.white,
        padding: 30,
        fontSize: 20,
        textAlign: "center"
    },
    modalIconWrp: {
        backgroundColor: colors.primaryBlue,
        borderRadius: 100,
        width: 140,
        height: 140,
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 40
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
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        width: 150,
        paddingVertical: 5
    },
    modalButtonText: {
        marginHorizontal: 10,
        fontSize: 15,
        color: colors.white,
        fontWeight: "normal"
    }
});

export default class ConfirmModal extends Component {

    static propTypes = {
        onPressButton: PropTypes.func.isRequired,
        onRequestClose: PropTypes.func.isRequired,
        textButton: PropTypes.string,
        titleModal: PropTypes.string,
        visible: PropTypes.bool.isRequired
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <Modal
                onRequestClose={this.props.onRequestClose}
                transparent={false}
                visible={this.props.visible}
            >
                <View style={[styles.modalBackground, {height}]}>
                    <View style={styles.modalTitleWrp}>
                        <View style={styles.modalIconWrp}>
                            <Icon
                                color={colors.iconWhite}
                                name={"iw-check"}
                                size={100}
                                style={styles.modalIcon}
                            />
                        </View>
                        <Text style={styles.titleModal}>{this.props.titleModal || ""}</Text>
                    </View>
                    <View style={styles.modalButtonWrp}>
                        <Button
                            containerStyle={styles.modalButton}
                            onPress={this.props.onPressButton}
                            style={styles.modalButtonText}
                        >
                            {this.props.textButton || "Confirm"}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

}
