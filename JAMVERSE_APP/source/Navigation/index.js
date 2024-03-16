import React, { useState } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import Notification from "../Screens/Notification";
import Login_Signup from "../Screens/Login_Signup";

import EditProfileScreen from "../Screens/EditProfileScreen";
import ForgotPassword from "../Screens/ForgotPassword";
import OTPScreen from "../Screens/OTPScreen";
import FollowerFollowingScreen from "../Screens/FollowerFollowingScreen";
import ModerationScreen from "../Screens/ModerationScreen";
import PrivacyPolicyScreen from "../Screens/PrivacyPolicyScreen";
import ActivityScreen from "../Screens/ActivityScreen";

import { useSelector, useDispatch } from 'react-redux';

import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";

import { EKey } from "../Constant/Default";

import AuthGlobalAction from "../Redux/Action/AuthGlobalAction";
import SplashScreen from '../Screens/SplashScreen';

import moment from "moment";
import login from '../Service/Login.Service';

import RNRestart from 'react-native-restart';

/* New Update Screen Import */
import FeedScreen from '../Screens/Feed.Screen';
import FeedLikeScreen from '../Screens/FeedLike.Screen';
import FeedCommentScreen from '../Screens/FeedComment.Screen';
import UserProfileScreen from '../Screens/UserProfile.Screen';
import FriendsProfileScreen from '../Screens/FriendProfile.Screen';
import Search from "../Screens/Search";
import SettingScreen from "../Screens/Setting_Screen";
import JammingScreen from "../Screens/JammingScreen";
import SinglePostPage from "../Screens/SinglePostPage";
import { google_login } from '../Service/Common.Service';

const Stack = createStackNavigator();

function index() {
  const dispatch = useDispatch();

  const [loading, set_loading] = useState(true);
  const AuthGlobal = useSelector(e => e.AuthGlobalReducer.AuthGlobalData);

  const LoginAgain = React.useCallback(async () => {
    // await AsyncStorage.clear();
    const email = await Get_Encrypted_AsyncStorage("text", "email", EKey);
    const password = await Get_Encrypted_AsyncStorage("text", "password", EKey);
    const googleToken = await Get_Encrypted_AsyncStorage("text", "googleToken", EKey);
    if (!googleToken) {
      let resp = await login(email, password);
      if (resp) RNRestart.restart();
      else set_loading(false);
    }
    else {
      let resp = await google_login({ googleToken, dispatch });
      if (resp) RNRestart.restart();
      else set_loading(false);
    }
  }, [loading]);

  const _load_data = React.useCallback(async () => {
    const token = await Get_Encrypted_AsyncStorage("text", "token", EKey);
    const data = JSON.stringify(await Get_Encrypted_AsyncStorage("object", "userData", EKey));
    const time = await Get_Encrypted_AsyncStorage("text", "time", EKey);
    const date1 = moment(time, "YYYY-MM-DD H:m:s");
    const date2 = moment.utc();
    const hoursleft = date1.diff(date2, "hours");

    if (hoursleft < -8) return await LoginAgain();
    else dispatch(AuthGlobalAction({ token, data }));
    setTimeout(() => {
      set_loading(false);
    }, 1000);
  }, [loading])

  React.useEffect(() => {
    _load_data();
  }, []);

  return (
    <>
      {
        loading === false ?
          <>
            {
              AuthGlobal && AuthGlobal.data && AuthGlobal.token && JSON.parse(AuthGlobal.data ?? "{}")._id ?
                <NavigationContainer>
                  <StatusBar backgroundColor="#000000" />
                  <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={'FeedScreen'}>
                    {/* New Route Below */}
                    <Stack.Screen name="FeedScreen" component={FeedScreen} />
                    <Stack.Screen name="FeedLikeScreen" component={FeedLikeScreen} />
                    <Stack.Screen name="FeedCommentScreen" component={FeedCommentScreen} />
                    <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
                    <Stack.Screen name="FriendProfileScreen" component={FriendsProfileScreen} />
                    <Stack.Screen name="SettingScreen" component={SettingScreen} />
                    <Stack.Screen name="Search" component={Search} />
                    <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                    <Stack.Screen name="FollowerFollowingScreen" component={FollowerFollowingScreen} />
                    <Stack.Screen name="JammingScreen" component={JammingScreen} />
                    {/* New Route End */}
                    <Stack.Screen name="Notification" component={Notification} />
                    <Stack.Screen name="ModerationScreen" component={ModerationScreen} />
                    <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
                    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                    <Stack.Screen name="SinglePostPage" component={SinglePostPage} />
                  </Stack.Navigator>
                </NavigationContainer>
                :
                <NavigationContainer>
                  <StatusBar backgroundColor="#000000" />
                  <Stack.Navigator
                    screenOptions={{ headerShown: false }}
                    initialRouteName={'Login_Signup'}>
                    <Stack.Screen name="Login_Signup" component={Login_Signup} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <Stack.Screen name="OTPScreen" component={OTPScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
            }
          </>
          :
          <SplashScreen />
      }
    </>
  );
}

export default index;
