import React, {Component, PropTypes} from "react";
import IPropTypes from "react-immutable-proptypes";
import {Dimensions, Modal, StyleSheet, View} from "react-native";
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
        fontSize: 13,
        color: colors.white,
        textAlign: "center"
    },
    modalButton: {
        backgroundColor: colors.buttonPrimary,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 11,
        textAlign: "center",
        backgroundColor: colors.transparent
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
        const {height, width} = Dimensions.get("window");
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
                        <View style={{height: height * .18}}>
                            <Icon
                                color={colors.iconWhite}
                                name={"iw-innowatio-logo"}
                                size={height * .18}
                            />
                        </View>
                        <View style={{}}>
                            <Text style={styles.descriptionModal}>
                                <Text style={styles.textBold}>{title.toUpperCase()}{"\n"}</Text>
                                {this.props.survey.get("description")}
                            </Text>
                        </View>
                        <Button
                            containerStyle={[styles.modalButton,
                                {width: width * .6, height: height * .05, marginTop: height * .03}
                            ]}
                            onPress={() => {
                                this.props.onCloseModal();
                                Actions.survey({survey: this.props.survey});
                            }}
                        >
                            <Text style={styles.modalButtonText}>{"VAI AL QUESTIONARIO"}</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

}
