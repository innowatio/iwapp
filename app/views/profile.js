import {Content} from "native-base";
import React, {Component, PropTypes} from "react";
import {Dimensions, Linking, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import * as Progress from "react-native-progress";
import {connect} from "react-redux";
import {List, Map} from "immutable";
import {uniq} from "ramda";
import {Actions} from "react-native-router-flux";

import Icon from "../components/iwapp-icons";
import * as colors from "../lib/colors";
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
        marginBottom: 40
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
        padding: 0,
        color: colors.textGrey
    },
    textEmail: {
        fontSize: 12,
        padding: 0,
        color: colors.textGrey
    },

    // STYLE FOR PROFILE PERCENTAGE COMPLETED
    contentAnswerWrp: {
        padding: 20
    },
    titleComplete: {
        marginBottom: 5,
        color: colors.textGrey
    },
    progressBarStyleWrp: {
        marginBottom: 20
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
        site: PropTypes.object,
        userId: PropTypes.string
    }

    constructor (props) {
        super(props);
        this.state = {
            avatarSource: {},
            username: " ",
            email: " ",
            name: " "
        };
    }

    componentWillMount () {
        this.props.asteroid.call("getUserInfo").then(userInfo => {
            this.setState({
                username: userInfo.username,
                email: userInfo.mail[0],
                name: userInfo.givenName[0]
            });
        });
    }

    componentDidMount () {
        this.doSubscriptions(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this.doSubscriptions(nextProps);
    }

    doSubscriptions (props) {
        if (props.site) {
            this.props.asteroid.subscribe("users");
            this.subscribeToCategories(props.site._id);
        }
    }

    subscribeToCategories (siteId) {
        this.getQuestionnairesDecorator().map(questionnaire => {
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

    countQuestionsByCategoryAndType (questionsCollection, category, type) {
        const questions = questionsCollection.find((question) => {
            return question.get("type") === type && question.get("category") === category;
        }) || Map({questions: []});
        return questions.get("questions").size || 0;
    }

    countAnswersByCategoryTypeAndSiteId (answersCollection, category, type, siteId) {
        const key = `${type}-${category}-${siteId}`;
        const answers = answersCollection.getIn([key, "answers"]) || List();
        return uniq(answers.map((answer) => {
            return answer.get("id");
        }).toJS()).length;
    }

    getQuestionnairesDecorator () {
        return [
            {color: colors.demographicsSection, name: "Demographics", key: "demographics", icon: "iw-demographics"},
            {color: colors.buildingsSection, name: "Building", key: "building", icon: "iw-buildings"},
            {color: colors.heatingSection, name: "Heating", key: "heating", icon: "iw-heating"},
            {color: colors.coolingSection, name: "Cooling", key: "cooling", icon: "iw-cooling"},
            {color: colors.statisticsSection, name: "Statistics", key: "statistics", icon: "iw-statistics"}
        ];
    }

    getQuestionnaires () {
        return this.getQuestionnairesDecorator().map((questionnaire) => {

            var questionnareItem = questionnaire;

            if (this.props.site) {
                const type = "questionnaire";
                const siteId = this.props.site._id;
                const answers = this.props.collections.get("answers") || Map();
                const questions = this.props.collections.get("questions") || Map();

                const {percentage, totalQuestions, totalAnswers} = questions ?
                    this.getPercentage(questions, answers, questionnaire.key, type, siteId) :
                    {percentage: 0, totalQuestions: 0, totalAnswers: 0};
                questionnareItem = {
                    ...questionnaire,
                    value: percentage || 0,
                    totalQuestions,
                    totalAnswers,
                    text: (percentage || 0) * 100 + "% completato"
                };
                // selectedQuestionnaires don't have onPress method
                return {
                    ...questionnareItem,
                    onPress: () => Actions.questionnaire({selectedQuestionnaire: questionnareItem})
                };
            }

            return questionnareItem;
        });

    }

    getPercentage (questions, answers, category, type, siteId) {
        const totalQuestions = this.countQuestionsByCategoryAndType(questions, category, type);
        const totalAnswers = this.countAnswersByCategoryTypeAndSiteId(answers, category, type, siteId);
        const percentage = this.roundTwoDecimals(totalAnswers / totalQuestions);
        return {percentage, totalQuestions, totalAnswers};
    }

    roundTwoDecimals (number) {
        return Math.round((number) * 100) / 100;
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
        const {username, email} = this.state;
        return (
            <View style={styles.userPhotoWrp}>
                <TouchableOpacity
                    className="userImage"
                    onPress={() => this.showImagePicker()}
                    style={styles.photoWrp}
                    transparent={true}
                >
                    <Text style={styles.textPhoto}>{(username[0] || email[0] || "").toUpperCase()}</Text>
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
                <TouchableOpacity onPress={() => Linking.openURL("http://sso.innowatio.it")} style={styles.iconOptionsWrp} transparent={true}>
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

    renderProfilePercentage (questionnairePercentages) {
        const {width} = Dimensions.get("window");
        const totalQuestionnairesProgress = this.roundTwoDecimals(
            questionnairePercentages.reduce((prev, curr) => {
                return prev + curr.value;
            }, 0) / questionnairePercentages.length);

        return (
            <View style={styles.progressBarStyleWrp}>
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
        );
    }

    renderQuestionnairesProgress (questionnaire) {

        // FIXME: on android you can get only full circle or none circle at all
        // to be removed when this get fixed:
        // https://github.com/oblador/react-native-progress/issues/3
        if (Platform.OS === "android") {
            questionnaire = {
                ...questionnaire,
                value: questionnaire.value === 1 ? 1 : 0
            };
        }

        return (
            <QuestionnaireProgress key={questionnaire.key} questionnaire={questionnaire} />
        );
    }

    render () {
        const {height} = Dimensions.get("window");
        const questionnairePercentages = this.getQuestionnaires();
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
                        {this.renderProfilePercentage(questionnairePercentages)}
                        <View style={styles.progressQuestionnairesWrp}>
                            {questionnairePercentages.map(::this.renderQuestionnairesProgress)}
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
        site: state.site,
        userId: state.userId
    };
}
export default connect(mapStateToProps)(Profile);
