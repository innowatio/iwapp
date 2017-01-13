import {Map} from "immutable";
import {Content} from "native-base";
import {equals} from "ramda";
import React, {Component, PropTypes} from "react";
import {Dimensions, Linking, StyleSheet, TouchableOpacity, View} from "react-native";
import {Actions} from "react-native-router-flux";
import * as Progress from "react-native-progress";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {questionnaireStatus} from "../actions/questionnaire";
import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
import QuestionnaireProgress from "../components/questionnaire-progress";
import Text from "../components/text-lato";
import {getQuestionnairesDecorator, roundTwoDecimals} from "../lib/questionnaire";
import getQuestionnaireItems from "../lib/questionnaire";

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
        backgroundColor: colors.secondaryBlue
    },
    titleBar: {
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderBottomColor: colors.buttonPrimary
    },
    title: {
        color: colors.white,
        fontSize: 12
    },
    contentUserWrp: {
        justifyContent: "center",
        alignItems: "center",
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1
    },
    contentUser: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconsUserOptionsWrp: {
        flexDirection: "column",
        alignItems: "flex-end"
    },
    iconOptionsWrp: {
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primaryBlue
    },
    userPhotoWrp: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    photoWrp: {
        backgroundColor: colors.buttonPrimary,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center"
    },
    textPhoto: {
        color: colors.white,
        fontSize: 34,
        fontWeight: "bold"
    },
    userInfoWrp: {
        paddingLeft: 10
    },
    textUser: {
        overflow: "hidden",
        fontSize: 16,
        padding: 0,
        color: colors.textGrey
    },
    textEmail: {
        overflow: "hidden",
        fontSize: 10,
        padding: 0,
        color: colors.textGrey
    },

    // STYLE FOR PROFILE PERCENTAGE COMPLETED
    contentAnswerWrp: {
        justifyContent: "center",
        alignItems: "center"
    },
    contentAnswer: {
        alignItems: "center"
    },
    titleComplete: {
        fontSize: 10,
        alignSelf: "flex-start",
        marginBottom: 5,
        color: colors.textGrey
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
        questionnaireState: PropTypes.object.isRequired,
        questionnaireStatus: PropTypes.func.isRequired,
        site: PropTypes.object,
        user: PropTypes.shape({
            userId: PropTypes.string.isRequired,
            username: PropTypes.string,
            name: PropTypes.string,
            email: PropTypes.string
        }).isRequired,
    }

    constructor (props) {
        super(props);
        this.state = {
            avatarSource: {}
        };
    }

    componentDidMount () {
        this.doSubscriptions(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.doSubscriptions(nextProps);
        const answers = nextProps.collections.get("answers") || Map();
        const questions = nextProps.collections.get("questions") || Map();
        const questionnaireItemDefault = getQuestionnaireItems(questions, Map(), nextProps.site._id);
        if ((
            answers.filter(agg => agg.get("siteId") === nextProps.site._id).size > 0 &&
            equals(nextProps.questionnaireState.status, questionnaireItemDefault)
        ) || nextProps.questionnaireState.status.length < 1
        ) {
            const questionnaireItem = getQuestionnaireItems(questions, answers, nextProps.site._id);
            this.props.questionnaireStatus(questionnaireItem);
        }
    }

    doSubscriptions (props) {
        if (props.site) {
            this.props.asteroid.subscribe("users");
            this.subscribeToCategories(props.site._id);
        }
    }

    subscribeToCategories (siteId) {
        getQuestionnairesDecorator().map(questionnaire => {
            const category = questionnaire.key;
            this.props.asteroid.subscribe("answers", {
                siteId: siteId,
                category,
                type: "questionnaire"
            });
            this.props.asteroid.subscribe("questions", {
                type: "questionnaire",
                category
            });
        });
    }

    showImagePicker () {
        // TODO waiting for SSO support for images
        // also de-comment the unit test about this

        /*
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
        */
    }

    renderUserImage () {
        const {width, height} = Dimensions.get("window");
        const {username = " ", email = " "} = this.props.user;
        return (
            <View style={[styles.userPhotoWrp, {width: width * .76}]}>
                <TouchableOpacity
                    className="userImage"
                    onPress={() => this.showImagePicker()}
                    style={[styles.photoWrp, {width: height * .11, height: height * .11}]}
                    transparent={true}
                >
                    <Text style={styles.textPhoto}>{(username[0] || email[0] || "").toUpperCase()}</Text>
                </TouchableOpacity>
                <View style={[styles.userInfoWrp, {width: width * .56}]}>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.textUser}>{username}</Text>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.textEmail}>{email}</Text>
                </View>
            </View>
        );
    }

    renderUserOption () {
        const {width, height} = Dimensions.get("window");
        return (
            <View style={[styles.iconsUserOptionsWrp, {width: width * .13}]}>
                <TouchableOpacity
                    onPress={() => Linking.openURL("http://sso.innowatio.it")}
                    style={[styles.iconOptionsWrp, {height: height * .055, width: height * .055, marginBottom: height * .05}]}
                    transparent={true}
                >
                    <Icon
                        color={colors.iconWhite}
                        name="iw-edit"
                        size={height * .04}
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

    renderProfilePercentage (questionnairePercentages) {
        const {width, height} = Dimensions.get("window");
        const totalQuestionnairesProgress = roundTwoDecimals(
            questionnairePercentages.reduce((prev, curr) => {
                return prev + curr.value;
            }, 0) / questionnairePercentages.length);
        return (totalQuestionnairesProgress>0 ?
            <View style={[styles.progressBarStyleWrp, {marginVertical: height * .03}]}>
                <Text style={styles.titleComplete}>{"Completa il profilo"}</Text>
                <Progress.Bar
                    borderColor={colors.secondaryBlue}
                    borderRadius={30}
                    borderWidth={1}
                    color={colors.secondaryBlue}
                    height={6}
                    progress={totalQuestionnairesProgress}
                    unfilledColor={colors.white}
                    width={width * 0.9}
                />
            </View>
        :null);
    }

    renderQuestionnairesProgress (questionnaire) {
        return (
            <QuestionnaireProgress
                key={questionnaire.key}
                onQuestionnairePress={selectedQuestionnaire => Actions.questionnaire({selectedQuestionnaire})}
                questionnaire={questionnaire}
            />
        );
    }

    render () {
        const {height, width} = Dimensions.get("window");
        const {questionnaireState} = this.props;
        return (
            <View style={styles.container}>
                <Content style={{backgroundColor: colors.background, height}}>
                    <View style={[styles.titleBarWrp, {height: height * .045}]}>
                        <View style={styles.titleBar}>
                            <Text style={styles.title}>{"IL MIO PROFILO"}</Text>
                        </View>
                    </View>
                    <View style={[styles.contentUserWrp, {width, height: height * 0.18}]}>
                        <View style={[styles.contentUser, {width: width * .9}]}>
                            {this.renderUserImage()}
                            {this.renderUserOption()}
                        </View>
                    </View>
                    <View ContentContainerStyle={styles.contentAnswerWrp}>
                        <View style={styles.contentAnswer}>
                            {this.renderProfilePercentage(questionnaireState.status)}
                            <View style={[styles.progressQuestionnairesWrp, {height: height * .56}]}>
                                {questionnaireState.status.map(::this.renderQuestionnairesProgress)}
                            </View>
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
        questionnaireState: state.questionnaire,
        site: state.site,
        user: state.user
    };
}

function mapDispatchToProps (dispatch) {
    return {
        questionnaireStatus: bindActionCreators(questionnaireStatus, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
