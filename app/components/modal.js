import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, Modal, TouchableOpacity, View} from "react-native";
import Button from "react-native-button";

import Icon from "./iwapp-icons";
import Text from "./text-lato";
import * as colors from "../lib/colors";

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: colors.backgroundModal
    },
    modalTitleWrp: {
        backgroundColor: colors.buttonPrimary,
        paddingVertical: 5
    },
    modalContentWrp: {
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "stretch",
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: colors.borderModal
    },
    titleModal: {
        color: colors.white,
        fontSize: 14,
        textAlign: "center"
    },
    modalButtonsWrp: {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "center"
    },
    modalButton: {
        backgroundColor: colors.buttonPrimary,
        width: 180,
        height: 30,
        borderRadius: 50,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    modalResetButton: {
        justifyContent: "center",
        alignItems: "center"
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 14,
        backgroundColor: colors.transparent,
        fontWeight: "400",
        fontFamily: "lato"
    }
});

export default class DefaultModal extends Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        modalButtons: PropTypes.bool.isRequired,
        modalTitle: PropTypes.string,
        onRequestClose: PropTypes.func.isRequired
    }

    renderButton () {
        return (
            <View style={styles.modalButtonsWrp}>
                <Button
                    containerStyle={styles.modalButton}
                    onPress={this.props.onRequestClose}
                    style={styles.modalButtonText}
                >
                   {"SALVA"}
                </Button>
                <TouchableOpacity
                    onPress={this.props.onRequestClose}
                    style={styles.modalResetButton}
                >
                    <Icon
                        color={colors.textGrey}
                        name={"iw-reset"}
                        size={30}
                        style={{backgroundColor: colors.transparent}}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const {
            children,
            modalButtons,
            modalTitle
        } = this.props;
        return (
            <Modal {...this.props}>
                <View style={[styles.modalBackground, {height: height, width: width}]}>
                    <View style={styles.modalTitleWrp}>
                        <Text style={styles.titleModal}>{modalTitle.toUpperCase()}</Text>
                    </View>
                    <View style={[styles.modalContentWrp]}>
                        {children}
                        {modalButtons ? this.renderButton() : null}
                    </View>
                </View>
            </Modal>
        );
    }
}
