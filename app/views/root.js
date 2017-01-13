import {Map} from "immutable";
import {equals, isEmpty, last} from "ramda";
import Drawer from "react-native-drawer";
import React, {Component, PropTypes} from "react";
import {Dimensions, Platform, StatusBar, StyleSheet, View} from "react-native";
import FCM from "react-native-fcm";
import {DefaultRenderer} from "react-native-router-flux";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {setNotificationsReaded} from "../actions/notifications";
import {selectSite} from "../actions/site";
import {generateSessionId} from "../actions/session-id";
import {onLogin, onLogout} from "../actions/user";
import Header from "../components/header";
import KeyboardSpacer from "../components/keyboard-spacer";
import SideMenu from "../components/side-menu";
import SurveyModal from "../components/survey-modal";
import {statusBarHeight} from "../lib/const";
import {primaryBlue, secondaryBlue} from "../lib/colors";
import getDeviceInfo from "../lib/get-device-info";
import Login from "./login";

const styles = StyleSheet.create({
    statusBarHeightIOS: {
        height: statusBarHeight,
        backgroundColor: primaryBlue
    }
});

class Root extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        collections: PropTypes.object.isRequired,
        generateSessionId: PropTypes.func.isRequired,
        navigationScene: PropTypes.arrayOf(PropTypes.string).isRequired,
        navigationState: PropTypes.shape({
            children: PropTypes.arrayOf(PropTypes.object).isRequired
        }).isRequired,
        onLogin: PropTypes.func.isRequired,
        onLogout: PropTypes.func.isRequired,
        onNavigate: PropTypes.func.isRequired,
        selectSite: PropTypes.func.isRequired,
        setNotificationsReaded: PropTypes.func.isRequired,
        site: PropTypes.object,
        survey: PropTypes.arrayOf(PropTypes.object),
        user: PropTypes.object
    }

    constructor () {
        super();
        this.state = {
            email: " ",
            open: false,
            surveyModalVisible: false,
            username: " ",
            notifications: 0,
            notificationsId: []
        };
    }

    componentDidMount () {
        const {asteroid} = this.props;
        asteroid.on("loggedIn", this.onLoginActions());
        asteroid.on("loggedOut", this.props.onLogout);
        asteroid.ddp.on("added", ({collection, fields, id}) => {
            if (collection == "sites" && (!this.props.site || this.props.site._id === id)) {
                this.props.selectSite({
                    _id: id,
                    title: fields.name,
                    ...fields
                });
            }
        });
        asteroid.subscribe("questions", {type: "survey"});
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.collections) {
            const survey = this.getSurvey(nextProps.collections);
            return this.setState({
                surveyModalVisible: (
                    !survey.isEmpty() &&
                    !nextProps.survey.find(objectSurvey => {
                        return objectSurvey.id === survey.get("_id");
                    }) &&
                    last(nextProps.navigationScene) !== "survey"
                )
            });
        }
    }

    componentWillUnmount () {
        const {asteroid} = this.props;
        asteroid.off("loggedIn", this.onLoginActions);
        asteroid.off("loggedOut", this.props.onLogout);
    }

    getMenuItems () {
        return [{
            icon: "overview",
            title: "Overview",
            navigateTo: "home"
        }, {
            icon: "chart",
            title: "Statistiche",
            navigateTo: "stats"
        }, {
            icon: "info",
            title: "Info",
            navigateTo: "info"
        }
        // coming soon™
        /*, {
            icon: "gauge",
            title: "Il mio smartmeter",
            navigateTo: "home"
        }, {
            icon: "badge",
            title: "Badgeboard",
            navigateTo: "home"
        }, {
            icon: "lightbulb",
            title: "Risparmio energetico",
            navigateTo: "home"
        }, {
            icon: "report",
            title: "Report",
            navigateTo: "home"
        }*/
        ];
    }

    getNavigationChildrenIndex () {
        const currentScene = last(this.props.navigationScene);
        const scenes = this.props.navigationState.children;
        return scenes.findIndex(scene => equals(scene.sceneKey, currentScene));
    }

    getNavigationState () {
        const sceneIndex = this.getNavigationChildrenIndex();
        return this.props.navigationState.children[sceneIndex];
    }

    getHeaderViews () {
        return [
            {view: "survey", header: "empty", disableDrawer: true},
            {view: "questionnaire", header: "back-arrow"},
            {view: "alarmsSettings", header: "back-arrow"},
            {view: "modifyProfile", header: "back-arrow"}
        ];
    }

    isDrawerDisabled () {
        const views = this.getHeaderViews();
        const selectedView = views.find(({view}) => view === last(this.props.navigationScene));
        return selectedView ? selectedView.disableDrawer : false;
    }

    onLoginActions () {
        const {asteroid, user} = this.props;
        return async (userId) => {
            this.props.onLogin(userId);
            this.props.generateSessionId(userId);
            if (user.username && user.email && user.name) {
                this.setState({
                    username: user.username,
                    email: user.email,
                    name: user.name
                });
            } else {
                asteroid.call("getUserInfo").then(userInfo => {
                    this.setState({
                        username: userInfo.username,
                        email: userInfo.mail[0],
                        name: userInfo.givenName[0]
                    });
                });
            }
            FCM.getFCMToken().then(token => {
                const deviceInfo = getDeviceInfo();
                // store fcm token in your server
                if (token) {
                    asteroid.call("saveFCMToken", token, deviceInfo);
                }
            });
            FCM.on("refreshToken", token => {
                // fcm token may not be available on first load, catch it here
                const deviceInfo = getDeviceInfo();
                if (token) {
                    asteroid.call("saveFCMToken", token, deviceInfo);
                }
            });
            asteroid.call("getUnreadNotifications").then(notifications => {
                this.setState({
                    notifications: notifications.length,
                    notificationsId: notifications.map(notification => notification._id)
                });
            });
        };
    }

    onCloseModal () {
        this.setState({surveyModalVisible: false});
    }

    toggleHamburger () {
        this.setState({
            open: !this.state.open
        });
    }

    closeHamburger () {
        this.setState({
            open: false
        });
    }

    getSites () {
        const {collections} = this.props;
        const sites = collections.get("sites") || new Map();
        return sites.map(value => {
            return {
                title: value.get("name"),
                ...value.toJS()
            };
        }).toArray();
    }

    getSurvey (collections) {
        const questions = collections.get("questions") || Map();
        return questions.find(question => question.get("type") === "survey") || Map();
    }

    resetNotifications () {
        if (!isEmpty(this.state.notificationsId)) {
            this.props.setNotificationsReaded(this.state.notificationsId);
        }
        this.setState({notifications: 0, notificationsId: []});
    }

    renderHeader () {
        const {username, email, notifications} = this.state;
        return (
            <Header
                headerViews={this.getHeaderViews()}
                notifications={notifications}
                notificationsAction={::this.resetNotifications}
                onToggleHamburger={::this.toggleHamburger}
                selectedView={this.props.navigationScene}
                userName={(username[0] || email[0] || "").toUpperCase()}
            />
        );
    }

    renderView () {
        const {asteroid, site, selectSite, user} = this.props;
        const {height, width} = Dimensions.get("window");
        return user.userId ? (
            <Drawer
                captureGestures={true}
                content={
                    <SideMenu
                        asteroid={asteroid}
                        menuItems={this.getMenuItems()}
                        onSelectSite={selectSite}
                        onTriggerClose={::this.closeHamburger}
                        optionItems={this.getSites()}
                        site={site}
                    />
                }
                disabled={this.isDrawerDisabled()}
                onClose={::this.closeHamburger}
                open={this.state.open}
                openDrawerOffset={0.35}
                panOpenMask={25}
                tapToClose={true}
                type="displace"
            >
                <View>
                    {this.renderHeader()}
                    <SurveyModal
                        onCloseModal={::this.onCloseModal}
                        survey={this.getSurvey(this.props.collections)}
                        visible={this.state.surveyModalVisible}
                    />
                    <View style={{height, width}}>
                        <DefaultRenderer
                            navigationState={this.getNavigationState()}
                            onNavigate={this.props.onNavigate}
                        />
                    </View>
                </View>
            </Drawer>
        ) :
        (<Login asteroid={asteroid} />);
    }

    render () {
        const {height, width} = Dimensions.get("window");
        return (
            <View style={{height, width}}>
                <View style={Platform.OS === "ios" ? styles.statusBarHeightIOS : null}/>
                <StatusBar
                    backgroundColor={secondaryBlue}
                    barStyle="light-content"
                />
                {this.renderView()}
                <KeyboardSpacer />
            </View>
        );
    }

}

function mapStateToProps (state) {
    return {
        collections: state.collections,
        navigationScene: state.navigation,
        site: state.site,
        survey: state.survey,
        user: state.user
    };
}

function mapDispatchToProps (dispatch) {
    return {
        generateSessionId: bindActionCreators(generateSessionId, dispatch),
        onLogin: bindActionCreators(onLogin, dispatch),
        onLogout: bindActionCreators(onLogout, dispatch),
        selectSite: bindActionCreators(selectSite, dispatch),
        setNotificationsReaded: bindActionCreators(setNotificationsReaded, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
