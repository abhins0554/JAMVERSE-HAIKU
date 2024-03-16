import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import {requestNotifications} from 'react-native-permissions';

import NotificationTokenAction from "../Redux/Action/NotificationTokenAction";
import axios from "axios";
import { BASE_URL } from "../Constant/Default";

const pushNotificationConfigure = async (dispatch) => {
    
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
        console.log({status})
    });

    

    return PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            dispatch(NotificationTokenAction(token));
            // logToken(token.token);
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
            console.log("NOTIFICATION:", notification);

            // process the notification

            // (required) Called when a remote is received or opened, or local notification is opened
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
            console.log("ACTION:", notification.action);
            console.log("NOTIFICATION:", notification);

            // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
            console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
    });
}


const updateNotificationTokenAPI = async (token, userToken) => {
    try {
        let {data} = await axios.post(`${BASE_URL}/notification/update-token`, {
            token: token
        },
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            }
        }
        );
    } catch (error) {
        console.log("Notification Post Error", error.message);
    }
}

const getNewNotification = async (token) => {
    
    try {
        let {data} = await axios.get(`${BASE_URL}notification/get-notification`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        );
        return data
    } catch (error) {
        console.log("Notification Post Error", error.message);
        return [];
    }
}

export default { pushNotificationConfigure, updateNotificationTokenAPI, getNewNotification };