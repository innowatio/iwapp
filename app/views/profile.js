import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import {Dimensions, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Progress from "react-native-progress";
import {Actions} from "react-native-router-flux";
import ImagePicker from "react-native-image-picker";
import {connect} from "react-redux";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import {getEmail, getUsername} from "../lib/get-user-info";
import QuestionnaireProgress from "../components/questionnaire-progress";
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
    textPhoto: {
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
        justifyContent: "space-around",
        alignItems: "center"
    }
});

class Profile extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: PropTypes.object.isRequired,
        userId: PropTypes.string
    }

    constructor (props) {
        super(props);
        this.state = {
            avatarSource: {}
        };
    }

    componentDidMount () {
        this.props.asteroid.subscribe("users");
    }

    getQuestionnaires () {
        return [
            {color: colors.demographicsSection, name: "Demographics", key: "demographics", icon: "iw-demographics", value: 1, percentage: "100"},
            {color: colors.buildingsSection, name: "Buildings", key: "buildings", icon: "iw-buildings", value: 0.3, percentage: "30"},
            {color: colors.heatingSection, name: "Heating", key: "heating", icon: "iw-heating", value: 0.8, percentage: "80"},
            {color: colors.coolingSection, name: "Cooling", key: "cooling", icon: "iw-cooling", value: 1, percentage: "100"},
            {color: colors.statisticsSection, name: "Statistics", key: "statistics", icon: "iw-statistics", value: 0.5, percentage: "50"}
        ];
    }

    showImagePicker () {
        const options = {
            title: null, // specify null or empty string to remove the title
            cancelButtonTitle: "Cancella",
            takePhotoButtonTitle: "Dalla fotocamera", // specify null or empty string to remove this button
            chooseFromLibraryButtonTitle: "Dalla galleria", // specify null or empty string to remove this button
            cameraType: "front", // "front" or "back"
            mediaType: "photo", // "photo" or "video"
            maxWidth: 80, // photos only
            maxHeight: 80, // photos only
            aspectX: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
            aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
            quality: 1, // 0 to 1, photos only
            angle: 0, // android only, photos only
            allowsEditing: true, // Built in functionality to resize/reposition the image after selection
            noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
            // if this key is provided, the image will get saved in the documents directory on ios,
            // and the pictures directory on android (rather than a temporary directory)
            storageOptions: {
                skipBackup: true, // ios only - image will NOT be backed up to icloud
                path: "images" // ios only - will save image at /Documents/images rather than the root
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else {
                // uri (on android)
                const source = {uri: response.uri, isStatic: true};

                this.setState({
                    avatarSource: source
                });
            }
        });
    }

    renderUserImage () {
        const username = getUsername(this.props.userId, this.props.collections);
        const email = getEmail(this.props.userId, this.props.collections);
        return (
            <View style={styles.userPhotoWrp}>
                <View style={styles.photoWrp}>
                    <Text style={styles.textPhoto}>{(username[0] || email[0] || "").toUpperCase()}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => this.showImagePicker()}
                    style={styles.iconEditPhotoWrp}
                    transparent={true}
                >
                    <Icon
                        color={colors.iconWhite}
                        name="iw-edit"
                        size={16}
                        style={{backgroundColor: colors.transparent}}
                    />
                </TouchableOpacity>
                <View style={styles.userInfoWrp}>
                    <Text style={styles.textUser}>{username}</Text>
                    <Text style={styles.textEmail}>{email}</Text>
                </View>
            </View>
        );
    }

    renderUserOption () {
        return (
            <View style={styles.iconsUserOptionsWrp}>
                <TouchableOpacity onPress={Actions.modifyProfile} style={styles.iconOptionsWrp} transparent={true}>
                    <Icon
                        color={colors.iconWhite}
                        name="iw-edit"
                        size={23}
                        style={{backgroundColor: colors.transparent}}
                    />
                </TouchableOpacity>
                {
                    /*<TouchableOpacity style={styles.iconOptionsWrp} transparent={true}>
                        <Icon
                            color={colors.iconWhite}
                            name="iw-gauge"
                            size={23}
                            style={{backgroundColor: colors.transparent}}
                        />
                    </TouchableOpacity>*/
                }
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
            <QuestionnaireProgress key={questionnaire.key} questionnaire={questionnaire} />
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height: height}}>
                    <View style={styles.titleBarWrp}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"IL MIO PROFILO"}</Text>
                        </View>
                    </View>
                    <View style={[styles.contentUserWrp, {height: height * 0.2}]}>
                        {this.renderUserImage()}
                        {this.renderUserOption()}
                    </View>
                    <View style={[styles.contentAnswerWrp, {height: height * 0.7}]}>
                        <Text style={styles.titleComplete}>{"Completa il profilo"}</Text>
                        {this.renderProfilePercentage()}
                        <View style={styles.progressQuestionnairesWrp}>
                            {this.getQuestionnaires().map(::this.renderQuestionnairesProgress)}
                        </View>
                    </View>
                </Content>
            </View>
        );
    }
}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        userId: state.userId
    };
}
export default connect(mapStateToProps)(Profile);
