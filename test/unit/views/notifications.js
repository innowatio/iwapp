import {shallow} from "enzyme";
import {fromJS, Map} from "immutable";

import Notifications from "views/notifications";
import {ListView} from "react-native";

import Text from "components/text-lato";
import * as colors from "lib/colors";


describe("`Notifications` view", () => {
    const NotificationsView = Notifications.__get__("Notifications");
    const asteroid = {
        subscribe: sinon.spy()
    };

    const collections = fromJS({
        notifications: {
            notificationId1: {
                _id: "notificationId1",
                type: "type1",
                date: "2015-06-11",
                title: "Titolo 1",
                message: "Notification message 1"
            },
            notificationId2: {
                _id: "notificationId2",
                type: "type2",
                date: "2015-06-12",
                title: "Titolo 2",
                message: "Notification message 2"
            }
        }
    });

    it("renders `ListView` component", () => {
        const notification = shallow(
            <NotificationsView
                asteroid={asteroid}
                collections={collections}
            />
        );
        expect(notification.find(ListView)).to.have.length(1);
    });

    describe("`getNotifications`", () => {
        const getNotifications = NotificationsView.prototype.getNotifications;

        it("returns the correct array of notifications", () => {
            const props = {collections: collections};
            const getNotificationText = sinon.spy();
            const getNotificationIcon = sinon.spy();
            const getNotificationBackgroundColor = sinon.spy();
            const instance = {
                getNotificationText,
                getNotificationIcon,
                getNotificationBackgroundColor
            };

            const result = getNotifications.call(instance, props, "1");

            expect(result).to.have.length(2);
            expect(result).to.deep.equals([
                {
                    key: 0,
                    text: (<Text />),
                    icon: undefined,
                    bgcolor: undefined,
                    date: "2015-06-11"
                }, {
                    key: 1,
                    text: (<Text />),
                    icon: undefined,
                    bgcolor: undefined,
                    date: "2015-06-12"
                }
            ]);

            expect(getNotificationText).to.have.callCount(2);
            expect(getNotificationIcon).to.have.callCount(2);
            expect(getNotificationBackgroundColor).to.have.callCount(2);

            expect(getNotificationText.args).to.deep.equals([[
                Map({
                    _id: "notificationId1",
                    type: "type1",
                    date: "2015-06-11",
                    title: "Titolo 1",
                    message: "Notification message 1"
                }),
                0,
                1
            ], [
                Map({
                    _id: "notificationId2",
                    type: "type2",
                    date: "2015-06-12",
                    title: "Titolo 2",
                    message: "Notification message 2"
                }),
                1,
                1
            ]]);
            expect(getNotificationIcon.args).to.deep.equals([["type1"], ["type2"]]);
            expect(getNotificationBackgroundColor.args).to.deep.equals([["type1"], ["type2"]]);

        });
    });

    describe("`getNotificationText`", () => {
        const getNotificationText = NotificationsView.prototype.getNotificationText;
        const result1 = getNotificationText(collections.getIn(["notifications", "notificationId1"]), 1, undefined);
        const result2 = getNotificationText(collections.getIn(["notifications", "notificationId1"]), 1, 1);
        const result3 = getNotificationText(collections.getIn(["notifications", "notificationId1"]), 1, 2);

        it("returns the expected object if rowID is undefined", () => {
            expect(result1).to.deep.equal({
                ellipsizeMode: "tail",
                numberOfLines: 2,
                style: {color: colors.textGrey, fontSize: 13},
                children: "Notification message 1"
            });
        });
        it("returns the expected object if it renders the selected row", () => {
            expect(result2).to.deep.equal({
                ellipsizeMode: "tail",
                numberOfLines: undefined,
                style: {color: colors.textGrey, fontSize: 13},
                children: "Notification message 1"
            });
        });
        it("returns the expected object if it renders a non selected row", () => {
            expect(result3).to.deep.equal({
                ellipsizeMode: "tail",
                numberOfLines: 2,
                style: {color: colors.textGrey, fontSize: 13},
                children: "Notification message 1"
            });
        });

    });

    describe("`getNotificationIcon`", () => {
        it("returns the expected String values", () => {
            const getNotificationIcon = NotificationsView.prototype.getNotificationIcon;

            expect(getNotificationIcon("alarm")).to.deep.equals("iw-alarms-tip");
            expect(getNotificationIcon("notification")).to.deep.equals("iw-like");
            expect(getNotificationIcon("tip")).to.deep.equals("iw-energetic-tip");
            expect(getNotificationIcon("")).to.deep.equals("iw-welcome");
        });
    });

    describe("`getNotificationBackgroundColor`", () => {
        it("returns the expected object", () => {
            const getNotificationBackgroundColor = NotificationsView.prototype.getNotificationBackgroundColor;

            expect(getNotificationBackgroundColor("alarm")).to.deep.equals(colors.acidGreen);
            expect(getNotificationBackgroundColor("notification")).to.deep.equals(colors.alarmDailyEnergy);
            expect(getNotificationBackgroundColor("tip")).to.deep.equals(colors.aquaGreen);
            expect(getNotificationBackgroundColor("")).to.deep.equals(colors.badgeNotification);
        });
    });
});
