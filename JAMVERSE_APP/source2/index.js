import React from 'react';
import { SafeAreaView, } from 'react-native';

// Layout Helper
import Toast from 'react-native-toast-message';

import firebase from '@react-native-firebase/app';
import mobileAds, { BannerAdSize, MaxAdContentRating } from 'react-native-google-mobile-ads';

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

import {requestNotifications} from 'react-native-permissions';

/* Constant Contain Firebase Configs */
import Constant  from './constant/Constant';

/* Navigation and Its Routes */
import Navigation from './navigations/index';

/* Import Theme Component */
import Styles from "./theme/styles/defaultStyle";

import { useDispatch } from 'react-redux';
import NotificationAction from './Redux/Action/NotificationAction';

function index() {

    const dispatch = useDispatch();

    /* Initialization of Firebase APP */
    React.useEffect(() => {
        if (!firebase.apps.length) {
            const app = firebase.initializeApp(Constant.FIREBASE_CONSTANT); // FIREBASE INITILIZE
        }
    });

    /* Initialization of Google Ads Mob */
    const askAdsPermissionAndSetup = async () => {
        // const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        // if (result === RESULTS.DENIED) {
        //   // The permission has not been requested, so request it.
        //   await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        // }
    
        mobileAds()
            .setRequestConfiguration({
                // Update all future requests suitable for parental guidance
                maxAdContentRating: MaxAdContentRating.MA,
            })
            .then(() => {
                // Request config successfully set!
            });
    
        mobileAds()
            .initialize()
            .then(adapterStatuses => {
                // Initialization complete!
            });
    }
    askAdsPermissionAndSetup();


    /* Configure and Initialization of Notification */
    requestNotifications(['alert', 'sound']).then(({status, settings}) => {
        console.log({status})
    });

    PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
            dispatch(NotificationAction(token));
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

    return (
        <SafeAreaView style={Styles.appBackground}>
            <Navigation />
            <Toast />
        </SafeAreaView>
    );
}

export default index;
