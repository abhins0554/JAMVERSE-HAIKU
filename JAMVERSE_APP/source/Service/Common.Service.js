import { BackHandler, Alert } from "react-native";

import axios from 'axios';
import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage, } from "react-native-encrypted-asyncstorage";
import moment from 'moment';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import { BASE_URL, EKey } from '../Constant/Default';
import AuthGlobalAction from "../Redux/Action/AuthGlobalAction";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';


export const commonuserProfileUpdate = async (token, dispatch) => {
    await axios.get(`${BASE_URL}setting/get-me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(async response => {
            if (response.data.code === 200) {
                await Set_Encrypted_AsyncStorage("text", "token", response.data.token, EKey);
                await Set_Encrypted_AsyncStorage("text", "time", moment.utc(), EKey);
                await Set_Encrypted_AsyncStorage("object", "userData", response.data.userData, EKey);
                if (dispatch) dispatch(AuthGlobalAction({ token: response.data.token, data: JSON.stringify(response.data.userData) }));
            }
        })
        .catch(error => {
            console.log(error)
        })
}


export const google_auth = async (navigation, dispatch) => {
    let jwtToken = "";
    try {
        GoogleSignin.configure({
            webClientId:
                '367682473783-l1nrks0t5co8usdhornm339l4uvqgdhl.apps.googleusercontent.com',
            offlineAccess: true,
            hostedDomain: '',
            loginHint: '',
            forceConsentPrompt: true,
            accountName: '',
        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const credential = auth.GoogleAuthProvider.credential(
            userInfo.idToken,
            userInfo.accessToken,
        );
        const firebaseUserCredential = await auth().signInWithCredential(credential);
        auth().onAuthStateChanged(function (user) {
            if (user) {
                user.getIdToken().then(async function (idToken) {  // <------ Check this line
                    if (firebaseUserCredential.additionalUserInfo.isNewUser == true) {
                        await google_signup({ googleToken: idToken, navigation: navigation, dispatch: dispatch });
                    }
                    else if (firebaseUserCredential.additionalUserInfo.isNewUser == false) {
                        await google_login({ googleToken: idToken, navigation: navigation, dispatch: dispatch });
                    }
                });
            }
        });
        // await AsyncStorage.setItem('email', String(firebaseUserCredential.additionalUserInfo.profile.email + ''),);
        // await AsyncStorage.setItem('gname', String(firebaseUserCredential.additionalUserInfo.profile.given_name + ' ' + firebaseUserCredential.additionalUserInfo.profile.family_name),);

    } catch (error) {
        // alert(error)
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            Alert.alert('Please Sign-In to Continue', '', [
                {
                    text: 'Sign-in',
                    onPress: () => {
                        google_auth();
                    },
                },
                {
                    text: 'Exit',
                    onPress: () => {
                        BackHandler.exitApp();
                    },
                },
            ]);
        } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (f.e. sign in) is in progress already
            // alert('success')
            // this.props.navigation.navigate('Main');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            // alert('Play service')
        } else {
            // some other error happened
            alert(error);
        }
    }
}


export const google_login = async ({ googleToken, navigation, dispatch }) => {
    try {
        let response = await axios.post(`${BASE_URL}auth/login-google`, { googleToken: googleToken },);
        if (response.status === 200) {
            let password = response.data.userData.profile.map((i, index) => String.fromCharCode(i)).join('');
            await Set_Encrypted_AsyncStorage("text", "token", response.data.token, EKey);
            await Set_Encrypted_AsyncStorage("text", "time", moment.utc().format("YYYY-MM-DD H:m:s"), EKey);
            await Set_Encrypted_AsyncStorage("object", "userData", response.data.userData, EKey);
            await Set_Encrypted_AsyncStorage("text", "email", response.data.userData.email, EKey);
            await Set_Encrypted_AsyncStorage("text", "password", password, EKey);
            await Set_Encrypted_AsyncStorage('googleToken', googleToken);
            Toast.show({
                type: 'success',
                text1: 'Welcome Back',
                text2: response.data.message
            });
            if (dispatch) dispatch(AuthGlobalAction({ token: response.data.token, data: JSON.stringify(response.data.userData) }));
            if (navigation) navigation.navigate("FeedScreen");
            if (!navigation) RNRestart.restart();
            return true;
        }
        if (response.status === 201 && response.data.message === "Verification Required") {
            Toast.show({
                type: 'error',
                text1: 'Email not verified',
                text2: "Try forgot password from login screen"
            });
            await AsyncStorage.clear();
            return true;
        }
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: error.message
        });
    }
}


const google_signup = async ({ googleToken, navigation, dispatch }) => {
    try {
        let response = await axios.post(`${BASE_URL}auth/signup-google`, { googleToken: googleToken },);
        if (response.status === 200 && response?.data) {
            console.log("here");
            await google_login({ googleToken, navigation, dispatch });
        }
    } catch (error) {
        console.log(error.response.data.message);
        Toast.show({ type: 'error', text1: 'Something went wrong', text2: error.response.data.message });
    }
}