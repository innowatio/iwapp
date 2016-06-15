import {Content} from "native-base";
import React, {Component} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Progress from "react-native-progress";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import Text from "../components/text-lato";

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
    contentUserWrp: {
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    iconsUserOptionsWrp: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    iconOptionsWrp: {
        flexDirection: "row",
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryBlue,
        marginTop: 6
    },
    userPhotoWrp: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    photoWrp: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center"
    },
    iconEditPhotoWrp: {
        position: "absolute",
        bottom: 0,
        left: 55,
        borderRadius: 20,
        width: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.secondaryBlue
    },
    textProfile: {
        color: colors.white,
        fontSize: 40,
        fontWeight: "bold"
    },
    userInfoWrp: {
        paddingLeft: 18
    },
    textUser: {
        fontSize: 16,
        padding: 0
    },
    textEmail: {
        fontSize: 12,
        padding: 0
    },

    // STYLE FOR PROFILE PERCENTAGE COMPLETED
    contentAnswerWrp: {
        padding: 20
    },
    titleComplete: {
        marginBottom: 5
    },
    progressBarStyleWrp: {
        marginBottom: 20
    },
    progressBarStyle: {
        width: 200
    },

    // STYLE FOR BUTTON PERCENTAGE OF ANSWER
    progressQuestionnairesWrp: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    progressQuestionnaire: {
        flexDirection: "column",
        alignItems: "stretch",
        marginTop: 20
    },
    iconQuestionnaireWrp: {
        position: "absolute",
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.transparent,
        top: 0,
        left: 0
    },
    titQuestionnaire: {
        fontSize: 14,
        padding: 0,
        textAlign: "center",
        marginTop: 3
    },
    percQuestionnaire: {
        fontSize: 11,
        padding: 0,
        textAlign: "center"
    }
});

class Profile extends Component {

    getQuestionnaires () {
        return [
            {color: colors.demographicsSection, name: "Demographics", key: "demographics", icon: "iw-demographics", value: 1, percentage: "100"},
            {color: colors.buildingsSection, name: "Buildings", key: "buildings", icon: "iw-buildings", value: 0.3, percentage: "30"},
            {color: colors.heatingSection, name: "Heating", key: "heating", icon: "iw-heating", value: 0.8, percentage: "80"},
            {color: colors.coolingSection, name: "Cooling", key: "cooling", icon: "iw-cooling", value: 1, percentage: "100"},
            {color: colors.statisticsSection, name: "Statistics", key: "statistics", icon: "iw-statistics", value: 0.5, percentage: "50"}
        ];
    }

    renderUserImage () {
        return (
            <View style={styles.userPhotoWrp}>
                <View style={styles.photoWrp}>
                    <Text style={styles.textProfile}>{"C"}</Text>
                </View>
                <TouchableOpacity style={styles.iconEditPhotoWrp} transparent={true}>
                    <Icon
                        color={colors.iconWhite}
                        name="iw-edit"
                        size={16}
                    />
                </TouchableOpacity>
                <View style={styles.userInfoWrp}>
                    <Text style={styles.textUser}>{"Username"}</Text>
                    <Text style={styles.textEmail}>{"username@email.com"}</Text>
                </View>
            </View>
        );
    }

    renderUserOption () {
        return (
            <View style={styles.iconsUserOptionsWrp}>
                <TouchableOpacity style={styles.iconOptionsWrp} transparent={true}>
                    <Icon
                        color={colors.iconWhite}
                        name="iw-edit"
                        size={23}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconOptionsWrp} transparent={true}>
                    <Icon
                        color={colors.iconWhite}
                        name="iw-gauge"
                        size={23}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderProfilePercentage () {
        return (
            <View style={styles.progressBarStyleWrp}>
                <Progress.Bar
                    borderColor={colors.secondaryBlue}
                    borderRadius={30}
                    borderWidth={1}
                    color={colors.secondaryBlue}
                    height={6}
                    progress={0.5}
                    style={styles.progressBarStyle}
                    unfilledColor={colors.white}
                />
            </View>
        );
    }

    renderQuestionnairesProgress (questionnaire) {
        return (
            <View key={questionnaire.key} style={styles.progressQuestionnaire}>
                <Progress.Circle
                    animating={false}
                    borderWidth={0}
                    color={questionnaire.color}
                    progress={questionnaire.value}
                    size={80}
                />
                <TouchableOpacity style={styles.iconQuestionnaireWrp} transparent={true}>
                    <Icon
                        color={questionnaire.color}
                        name={questionnaire.icon}
                        size={53}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titQuestionnaire}>
                        {questionnaire.name}
                    </Text>
                    <Text style={styles.percQuestionnaire}>
                        {questionnaire.percentage}
                        {"% completato"}
                    </Text>
                </View>
            </View>
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"MY PROFILE"}</Text>
                        </View>
                    </View>
                    <View style={[styles.contentUserWrp, {height: height * 0.2}]}>
                        {this.renderUserImage()}
                        {this.renderUserOption()}
                    </View>
                    <View style={[styles.contentAnswerWrp, {height: height * 0.8}]}>
                        <Text style={styles.titleComplete}>{"Completa il profilo"}</Text>
                        {this.renderProfilePercentage()}
                        <View style={styles.progressQuestionnairesWrp}>
                            {this.getQuestionnaires().map(this.renderQuestionnairesProgress)}
                        </View>
                    </View>
                </Content>
            </View>
        );
    }
}

export default Profile;
