import React from 'react';

import { BackHandler } from "react-native";

import Navigator from "./Navigation/index";
import Toast from 'react-native-toast-message';
import firebase from '@react-native-firebase/app';

import firebaseConfig from './Constant/Firebase.Constant';
import NotificationServices from "./Service/Notification.Service";
import LogBox from "./Service/LogBox.Service";
import { useDispatch } from 'react-redux';


import mobileAds, { BannerAdSize, MaxAdContentRating } from 'react-native-google-mobile-ads';
import { check, request, PERMISSIONS, RESULTS, requestNotifications } from 'react-native-permissions';


function index(props) {

    const dispatch = useDispatch();


    NotificationServices.pushNotificationConfigure(dispatch);

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

    React.useEffect(() => {
        if (!firebase.apps.length) {
            const app = firebase.initializeApp(firebaseConfig); // FIREBASE INITILIZE
        }
    });

    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', () => true);
    }, []);



    return (
        <>
            <Navigator />
            <Toast />
        </>
    );
}

export default index;