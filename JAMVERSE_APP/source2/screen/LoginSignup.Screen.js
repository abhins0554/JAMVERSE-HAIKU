import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native'


import { GoogleSigninButton, } from "@react-native-google-signin/google-signin";
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

/* Import Default App Theme */
import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json'

/* Import Components */
import TextCore from '../components/core/Text.Core';
import TextInputComponent from '../components/core/TextInput.Core';
import ButtonComponent from '../components/core/Button.Core';

import SplashScreen from './Splash.Screen';

/* Services */
import AuthServices from '../services/Auth.Service';
import { Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";
import Constant from '../constant/Constant';

/* Google Signup Auth Handler Imports */
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

/* Redux Action and other Handlers */
import { useDispatch } from 'react-redux';
import AuthGlobalAction from '../Redux/Action/AuthGlobalAction';

export default function Login_Signup({ navigation }) {
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        bgImage: {
            width: wp(100),
            height: hp(60),
            top: -hp(30),
            borderRadius: 180,
            alignSelf: "center",
            position: 'absolute'
        },
        cardView: {
            elevation: 2,
            shadowRadius: 2,
            backgroundColor: Color.white,
            width: wp(90),
            alignSelf: "center",
            borderRadius: 2,
            shadowColor: '#52006A',
            zIndex: 1,
            marginTop: hp(5),
            padding: 10
        },
        switchPage: {
            flexDirection: "row",
            alignSelf: "center",
            marginTop: 50,
            marginBottom: 50,
            backgroundColor: "#D0D0D0",
            borderRadius: 20,
            width: wp(100) / 2
        },
        switchBtn: {
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 20,
            flex: 1
        },
        switchBtnTxt: {
            textAlign: "center",
            padding: 10,
            color: Color.textPrimary
        },
        fpText: {
            textAlign: "right",
            marginVertical: 10,
            color: Color.textPrimary
        },
    });

    const [roles, set_roles] = useState("login");
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [full_name, set_full_name] = useState("");
    const [username, set_username] = useState("");

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    const [loading, set_loading] = useState(false);

    /* Login Service */
    const _login = React.useCallback(async () => {
        if (!ValidateEmail(email)) return Toast.show({
            type: "error",
            text1: "Invalid Email",
            text2: "The email address provided is not valid. Please enter a correct email address."
        })
        if (!password) return Toast.show({
            type: "error",
            text1: "Invalid Password",
            text2: "The password provided is not valid. Please enter a correct password."
        })
        set_loading(true);
        try {
            let { data } = await AuthServices.loginService({ email, password });
            await Set_Encrypted_AsyncStorage("text", "email", email, Constant.ENCRYPTION_KEY);
            await Set_Encrypted_AsyncStorage("text", "password", password, Constant.ENCRYPTION_KEY);
            // Save Data to Redux
            dispatch(AuthGlobalAction({ token: data.token, data: data.userData }));
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error.response.data.message,
                text2: "The email or password provided is not valid."
            })
        }
        set_loading(false);
    }, [loading, email, password]);

    /* Signup Service */
    const _signup = React.useCallback(async () => {
        if (!ValidateEmail(email)) return Toast.show({
            type: "error",
            text1: "Invalid Email",
            text2: "The email address provided is not valid. Please enter a correct email address."
        })
        if (!password) return Toast.show({
            type: "error",
            text1: "Invalid Password",
            text2: "The password provided is not valid. Please enter a correct password."
        })
        if (!full_name) return Toast.show({
            type: "error",
            text1: "Invalid Fullname",
            text2: "The Fullname provided is not valid. Please enter a correct Fullname."
        })
        if (!username) return Toast.show({
            type: "error",
            text1: "Invalid username",
            text2: "The username provided is not valid. Please enter a correct username."
        })
        set_loading(true);
        try {
            let { data } = await AuthServices.signupService({ email, password, user_name: username, full_name, login_type: 'normal' });
            // Navigation to OTP Validation Screen
            navigation.navigate('OTPScreen', {email: email, password: password, type: "signup"})
        } catch (error) {
            Toast.show({
                type: "error",
                text1: error.response.data.message,
                text2: ""
            })
        }
        set_loading(false);
    }, [loading, email, password, full_name, username]);

    const _googleSignIn = React.useCallback(async () => {
        set_loading(true);
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
                            try {
                                let { data } = await AuthServices.googleSignupService({ googleToken: idToken, });
                                let { data: loginData } = await AuthServices.googleLoginService({ googleToken: idToken, });
                                await Set_Encrypted_AsyncStorage("text", "email", user.email, Constant.ENCRYPTION_KEY);
                                dispatch(AuthGlobalAction({ token: loginData.token, data: loginData.userData }));
                                // save data to redux & navigate
                                set_loading(false);
                            } catch (error) {
                                Toast.show({
                                    type: "error",
                                    text1: error.response.data.message,
                                    text2: ""
                                })
                                set_loading(false);
                            }
                        }
                        else if (firebaseUserCredential.additionalUserInfo.isNewUser == false) {
                            try {
                                let { data } = await AuthServices.googleLoginService({ googleToken: idToken, });
                                await Set_Encrypted_AsyncStorage("text", "email", user.email, Constant.ENCRYPTION_KEY);
                                dispatch(AuthGlobalAction({ token: data.token, data: data.userData }));
                                // save data to redux & navigate
                                set_loading(false);
                            } catch (error) {
                                Toast.show({
                                    type: "error",
                                    text1: error.response.data.message,
                                    text2: ""
                                })
                                set_loading(false);
                            }
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
    }, [loading])

    const updateEmailText = React.useCallback((e) => set_email(e.toLowerCase()), [email]);
    const updatePasswordText = React.useCallback((e) => set_password(e), [password]);
    const updateFullNameText = React.useCallback((e) => set_full_name(e), [full_name]);
    const updateUserNameText = React.useCallback((e) => set_username(e), [username]);

    const updateRoles = React.useCallback((e) => set_roles(e), [roles]);


    if(loading) return <SplashScreen />

    return (
        <View style={Styles.screenMainFrame}>
            <Image source={{ uri: "https://www.w3schools.com/css/img_lights.jpg" }} style={styles.bgImage} />
            <View style={{ flex: 1 }}>
                <View style={styles.cardView}>
                    <ScrollView>
                        <View style={styles.switchPage}>
                            <TouchableOpacity style={[styles.switchBtn, { backgroundColor: roles === "login" ? Color.primary : Color.lightgrey }]} onPress={() => updateRoles("login")}>
                                <TextCore style={[styles.switchBtnTxt, { color: roles === "login" ? Color.white : Color.black }]}>Login</TextCore>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.switchBtn, { backgroundColor: roles === "signup" ? Color.primary : Color.lightgrey }]} onPress={() => updateRoles("signup")}>
                                <TextCore style={[styles.switchBtnTxt, { color: roles === "signup" ? Color.white : Color.black }]}>SignUp</TextCore>
                            </TouchableOpacity>
                        </View>
                        {
                            roles === "login" ?
                                <>
                                    <TextInputComponent value={email} onChangeText={updateEmailText} keyboardType={"email-address"} secureTextEntry={false} placeholder={"Email"} borderBottomWidth={1} borderRadius={7} />
                                    <TextInputComponent value={password} onChangeText={updatePasswordText} keyboardType={"default"} secureTextEntry={true} placeholder={"Password"} borderBottomWidth={1} borderRadius={7} />
                                    <ButtonComponent onPress={_login} >LogIn</ButtonComponent>
                                    <TouchableOpacity onPress={() => navigation.navigate("ForgotPasswordScreen")}>
                                        <TextCore style={styles.fpText}>Forgot Password ?</TextCore>
                                    </TouchableOpacity>
                                    <TextCore style={[styles.fpText, { textAlign: "center", }]}>or</TextCore>
                                    <GoogleSigninButton size={GoogleSigninButton.Size.Icon} style={{ alignSelf: "center", marginBottom: 35 }} onPress={_googleSignIn} />
                                </>
                                :
                                <>
                                    <TextInputComponent value={full_name} onChangeText={updateFullNameText} keyboardType={"default"} secureTextEntry={false} placeholder={"Full Name"} borderBottomWidth={1} borderRadius={7} />
                                    <TextInputComponent value={username} onChangeText={updateUserNameText} keyboardType={"default"} secureTextEntry={false} placeholder={"Username"} borderBottomWidth={1} borderRadius={7} />
                                    <TextInputComponent value={email} onChangeText={updateEmailText} keyboardType={"email-address"} secureTextEntry={false} placeholder={"Email"} borderBottomWidth={1} borderRadius={7} />
                                    <TextInputComponent value={password} onChangeText={updatePasswordText} keyboardType={"default"} secureTextEntry={true} placeholder={"Password"} borderBottomWidth={1} borderRadius={7} />
                                    <ButtonComponent onPress={_signup} >SignUp</ButtonComponent>
                                    <TouchableOpacity onPress={() => Linking.openURL('https://jamverse.in/privacy-policy')}>
                                        <TextCore style={styles.fpText}>Read terms & conditions before signup ***</TextCore>
                                    </TouchableOpacity>
                                    <TextCore style={[styles.fpText, { textAlign: "center" }]}>or</TextCore>
                                    <GoogleSigninButton size={GoogleSigninButton.Size.Icon} style={{ alignSelf: "center", marginBottom: 35 }} onPress={_googleSignIn} />
                                </>
                        }
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}