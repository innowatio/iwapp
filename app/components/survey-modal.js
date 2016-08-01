import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Modal, StyleSheet, View} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";

import * as colors from "../lib/colors";
import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";

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
    logoInnowatio: {
        padding: 0,
        margin: 0,
        height: 80
    },
    titleModal: {
        color: colors.white,
        textAlign: "center"
    },
    textBold: {
        fontWeight: "bold",
        fontSize: 16
    },
    modalContentWrp: {
        backgroundColor: colors.secondaryBlue,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    descriptionModal: {
        color: colors.white,
        textAlign: "center",
        marginTop: 10
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: colors.buttonPrimary,
        width: 200,
        paddingVertical: 8,
        borderRadius: 50
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 14,
        backgroundColor: colors.transparent,
        fontWeight: "300"
    }
});

export default class SurveyModal extends Component {

    static propTypes = {
        onCloseModal: PropTypes.func.isRequired,
        survey: IPropTypes.map,
        visible: PropTypes.bool.isRequired
    }

    render () {
        const title = this.props.survey.get("title") || "";
        return (
            <Modal
                onRequestClose={this.props.onCloseModal}
                transparent={true}
                visible={this.props.visible}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalTitleWrp}>
                        <Text style={styles.titleModal}>{" "}</Text>
                    </View>
                    <View style={styles.modalContentWrp}>

                        <View style={styles.badgeIconActive}>
                            <Icon
                                color={colors.iconWhite}
                                name={"iw-innowatio-logo"}
                                size={100}
                                style={styles.logoInnowatio}
                            />
                        </View>
                        <Text style={styles.descriptionModal}>
                            <Text style={styles.textBold}>{title.toUpperCase()}</Text>
                            {"\n\n"}
                            {this.props.survey.get("description")}
                        </Text>
                        <Button
                            containerStyle={styles.modalButton}
                            onPress={() => {
                                this.props.onCloseModal();
                                Actions.survey({survey: this.props.survey});
                            }}
                            style={styles.modalButtonText}
                        >
                            {"VAI AL QUESTIONARIO"}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

}
