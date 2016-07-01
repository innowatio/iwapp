import React, {Component} from "react";
import {Dimensions, ListView, Modal, View, StyleSheet} from "react-native";
import Button from "react-native-button";
import {connect} from "react-redux";
import {Content} from "native-base";

import Icon from "../components/iwapp-icons";
import Text from "../components/text-lato";
import * as colors from "../lib/colors";

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

    badgeButtonsWrp: {
        justifyContent: "center",
        alignItems: "center"
    },
    badgeButton: {
        backgroundColor: colors.backgroundBageboard,
        width: 150,
        height: 150,
        margin: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    badge: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    badgeIconActive: {
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: colors.borderIconGreen,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5
    },
    badgeTextActive: {
        fontSize: 12
    },

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
        padding: 20
    },
    descriptionModal: {
        color: colors.white,
        textAlign: "center",
        marginTop: 10
    },
    modalButton: {
        marginTop: 10,
        backgroundColor: colors.buttonPrimary,
        width: 100,
        paddingVertical: 5,
        borderRadius: 50
    },
    modalButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: "300"
    },




    list: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap"
    }
});

class Badgeboard extends Component {

    constructor (props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            animationType: "none",
            modalVisible: false,
            transparent: true,
            dataSource: ds.cloneWithRows(this.genRows({}))
        };
    }

    setModalVisible (visible) {
        this.setState({modalVisible: visible});
    }

    setAnimationType (type) {
        this.setState({animationType: type});
    }

    toggleTransparent () {
        this.setState({transparent: !this.state.transparent});
    }

    genRows (pressData: {[key: number]: boolean}) {
        var dataBlob = [];
        for (var ii = 0; ii < 100; ii++) {
            var pressedText = pressData[ii] ? " (X)" : "";
            dataBlob.push("Cell " + ii + pressedText);
        }
        return dataBlob;
    }

    pressRow (rowID: number) {
        this.pressData[rowID] = !this.pressData[rowID];
        this.setState({dataSource: this.state.dataSource.cloneWithRows(
            this.genRows(this.pressData)
        )});
    }

    hashCode (str) {
        var hash = 15;
        for (var ii = str.length - 1; ii >= 0; ii--) {
            hash = ((hash << 5) - hash) + str.charCodeAt(ii);
        }
        return hash;
    }

    renderRow (rowData, sectionID, rowID) {
        return (
            <View style={styles.badgeButtonsWrp}>
                <View key={rowID} style={styles.badgeButton}>
                    <Button containerStyle={styles.badgeButton} onPress={this.setModalVisible.bind(this, true)}>
                        <View style={styles.badge}>
                            <View style={styles.badgeIconActive}>
                                <Icon color={colors.iconGreen} name={"iw-badge-green"} size={72} style={styles.iconGreen} />
                            </View>
                            <Text style={styles.badgeTextActive}>{"Super User"}</Text>
                        </View>
                    </Button>
                </View>
            </View>
        );
    }

    renderContentBadgeboard () {
        return (
            <ListView contentContainerStyle={styles.list}
                dataSource={this.state.dataSource}
                renderRow={::this.renderRow}
            />
        );
    }

    renderModal () {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalTitleWrp}>
                        <Text style={styles.titleModal}>{"SUPER USER"}</Text>
                    </View>
                    <View style={styles.modalContentWrp}>

                        <View style={styles.badgeIconActive}>
                            <Icon color={colors.iconGreen} name={"iw-badge-green"} size={72} style={styles.iconGreen} />
                        </View>
                        <Text style={styles.descriptionModal}>
                            <Text style={styles.textBold}>{"BRAVO!"}</Text>
                            {"\n\nPer ottenere questo badge hai superato questa prova: Un accesso al giorno per 10 Giorni di seguito!"}
                        </Text>
                        <Button
                            containerStyle={styles.modalButton}
                            onPress={this.setModalVisible.bind(this, false)}
                            style={styles.modalButtonText}
                        >
                            {"CLOSE"}
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View>
                        <View style={styles.titleBarWrp}>
                            <View style={styles.titleBar}>
                                <Text style={styles.title}>{"BADGEBOARD"}</Text>
                            </View>
                        </View>
                    </View>
                    {this.renderContentBadgeboard()}
                    {this.renderModal()}
                </Content>

            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}
export default connect(mapStateToProps)(Badgeboard);
