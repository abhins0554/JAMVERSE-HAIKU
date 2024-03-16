import React from 'react';

/* Navigation Helper */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import moment from 'moment';

import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

import database from '@react-native-firebase/database';

/* Screens Import */
import SplashScreen from '../screen/Splash.Screen';
import LoginSignupScreen from '../screen/LoginSignup.Screen';
import OTPScreen from '../screen/OTP.Screen';
import ForgotPasswordScreen from '../screen/ForgotPassword.Screen';
import FeedScreen from '../screen/Feed.Screen';
import FeedLikeScreen from '../screen/FeedLike.Screen';
import FeedCommentScreen from '../screen/FeedComment.Screen';
import UserProfileScreen from '../screen/UserProfile.Screen';
import FriendProfileScreen from '../screen/FriendProfile.Screen';
import SettingScreen from '../screen/Setting.Screen';
import SearchScreen from '../screen/Search.Screen';
import FollowerFollowingScreen from '../screen/FollowerFollowing.Screen';
import NotificationScreen from '../screen/Notification.Screen';
import SinglePostScreen from '../screen/SinglePost.Screen';
import EditProfileScreen from '../screen/EditProfile.Screen';
import JammingScreen from '../screen/Jamming.Screen';

import ActivityScreen from '../screen/ActivityScreen';
import PrivacyPolicyScreen from '../screen/PrivacyPolicyScreen';



/* Service Helper */
import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";
import Constant from '../constant/Constant';
import AuthService from '../services/Auth.Service';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';


/* Redux Data */
import { useDispatch, useSelector } from 'react-redux';
import AuthGlobalAction from '../Redux/Action/AuthGlobalAction';
import Layout from '../components/Layout/index';

const interstitial = InterstitialAd.createForAdRequest('ca-app-pub-9265757158906430/4719923728');

function index() {

    const timingRef = React.useRef(0);
    React.useEffect(() => {
        database().ref('ads_interval').once('value').then(snapshot => {
            timingRef.current = snapshot.val();
        })
    }, []);


    const [loaded, setLoaded] = React.useState(false);

    React.useEffect(() => {
        if (timingRef.current === 0) return;
        setInterval(() => {
            const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
                setLoaded(true);
            });

            // Start loading the interstitial straight away
            interstitial.load();

            setTimeout(() => {
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
                try {
                    if (loaded) interstitial.show();
                } catch (error) {

                }
            }, 10 * 1000);

            // Unsubscribe from events on unmount
            return unsubscribe;
        }, timingRef.current);
    }, [loaded, timingRef.current]);



    const Stack = createStackNavigator();
    const dispatch = useDispatch();
    const AUTHENTICATION = useSelector(e => e.AUTHENTICATION.AUTHENTICATION.token);

    const [loading, setLoading] = React.useState(true);

    const getAuthenticationStatus = React.useCallback(async () => {
        let email = await Get_Encrypted_AsyncStorage('text', 'email', Constant.ENCRYPTION_KEY);
        if (!email) return setTimeout(() => {
            setLoading(false)
        }, 1000);;
        let password = await Get_Encrypted_AsyncStorage('text', 'password', Constant.ENCRYPTION_KEY);
        if (email && password) {
            try {
                let { data } = await AuthService.loginService({ email, password });
                dispatch(AuthGlobalAction({ token: data.token, data: data.userData }));
                return setLoading(false);
            } catch (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Some error occurred',
                    text2: "Try clear app storage once",
                })
            }
        }
        if (email && !password) {
            let user = await auth().currentUser;
            user.getIdToken().then(async function (idToken) {
                let { data } = await AuthService.googleLoginService({ googleToken: idToken, });
                dispatch(AuthGlobalAction({ token: data.token, data: data.userData }));
                return setLoading(false);
            });
        }
    }, [AUTHENTICATION]);

    React.useEffect(() => {
        getAuthenticationStatus();
    }, []);

    if (loading) return <SplashScreen />

    return (
        <>
            {
                AUTHENTICATION ?
                    <NavigationContainer>
                        {/* Private Route */}
                        <Layout>
                            <Stack.Navigator
                                screenOptions={{ headerShown: false }}
                                detachInactiveScreens={true}
                                initialRouteName={'FeedScreen'}>
                                <Stack.Screen name="FeedScreen" component={FeedScreen} />
                                <Stack.Screen name="FeedLikeScreen" component={FeedLikeScreen} />
                                <Stack.Screen name="FeedCommentScreen" component={FeedCommentScreen} />
                                <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
                                <Stack.Screen name="FriendProfileScreen" component={FriendProfileScreen} />
                                <Stack.Screen name="SettingScreen" component={SettingScreen} />
                                <Stack.Screen name="SearchScreen" component={SearchScreen} />
                                <Stack.Screen name="FollowerFollowingScreen" component={FollowerFollowingScreen} />
                                <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
                                <Stack.Screen name="SinglePostScreen" component={SinglePostScreen} />
                                <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                                <Stack.Screen name="JammingScreen" component={JammingScreen} />
                                <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                                <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
                            </Stack.Navigator>
                        </Layout>
                    </NavigationContainer>
                    :
                    <>
                        <NavigationContainer>
                            <Stack.Navigator
                                screenOptions={{ headerShown: false }}
                                detachInactiveScreens={true}
                                initialRouteName={'LoginSignupScreen'}>
                                <Stack.Screen name="LoginSignupScreen" component={LoginSignupScreen} />
                                <Stack.Screen name="OTPScreen" component={OTPScreen} />
                                <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </>
            }
        </>
    );
}

export default index;