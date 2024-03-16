import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import TextInputComponent from '../Common/TextInput';

import Button from '../Common/Button';

import { GoogleSigninButton, } from "@react-native-google-signin/google-signin";

import loginService from '../Service/Login.Service';
import signupService from '../Service/Signup.Service';

import { useDispatch } from 'react-redux';
import { PlatFormData } from '../Constant/CustomPlatform';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { google_auth } from '../Service/Common.Service';
import LoadingComponent from '../Components/LoadingComponent';
import { Color } from '../Constant/Color.Constant';

export default function Login_Signup({ navigation }) {
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        mainframe: {
            flex: 1,
            backgroundColor: Color.backgroundColor
        },
        bgImage: {
            width: Dimensions.get('window').width * 1.5,
            height: Dimensions.get('window').width * 1.4,
            borderRadius: 360,
            alignSelf: "center",
            bottom: "50%"
        },
        cardView: {
            elevation: 20,
            shadowRadius:10,
            backgroundColor: Color.cardsColor,
            width: Dimensions.get('window').width - 40,
            alignSelf: "center",
            top: -Dimensions.get('window').width * 1.15,
            borderRadius: 25,
            shadowColor: '#52006A',
        },
        switchPage: {
            flexDirection: "row",
            alignSelf: "center",
            marginTop: 50,
            marginBottom: 50,
            backgroundColor: "#D0D0D0",
            borderRadius: 20,
            width: Dimensions.get('window').width / 2
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
            color: "#000000"
        },
        fpText: {
            textAlign: "right",
            marginHorizontal: 20,
            marginTop: 10,
            marginBottom: 10,
            color: PlatFormData.colorMode === 'dark' ? "lightgrey" : "darkgrey"
        },
        daText: {
            textAlign: "center",
            marginHorizontal: 40,
            marginTop: 30,
            color: "grey",
            marginBottom: 25
        }
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
        Toast.show({
            type: "error",
            text1: "Invalid Email",
            text2: "Invalid Email Entered Please enter correct email"
        })
        return (false)
    }

    const [loading, set_loading] = useState(false);

    const _login = async () => {
        if(!ValidateEmail(email)) return true;
        set_loading(true);
        await loginService(email, password, navigation, dispatch);
        set_loading(false);
    }

    const _signup = async () => {
        if(!ValidateEmail(email)) return true;
        set_loading(true);
        await signupService(email, password, full_name, username, navigation, dispatch);
        set_loading(false);
    }

    const _googleSignIn = async () => {
        set_loading(true);
        await google_auth(navigation, dispatch);
        set_loading(false);
    }

    const updateEmailText = React.useCallback((e) => set_email(e.toLowerCase()),[email]);
    const updatePasswordText = React.useCallback((e) => set_password(e),[password]);
    const updateFullNameText = React.useCallback((e) => set_full_name(e),[full_name]);
    const updateUserNameText = React.useCallback((e) => set_username(e),[username]);

    return (
        <SafeAreaView style={styles.mainframe}>
            <Image source={{ uri: "https://www.w3schools.com/css/img_lights.jpg" }} style={styles.bgImage} />
            <View style={styles.cardView}>
                <ScrollView>
                    <View style={styles.switchPage}>
                        <TouchableOpacity style={[styles.switchBtn, { backgroundColor: roles === "login" ? "#f84f38" : "#D0D0D0" }]} onPress={() => set_roles("login")}>
                            <Text style={[styles.switchBtnTxt, { color: roles === "login" ? "#FFFFFF" : "#000000" }]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.switchBtn, { backgroundColor: roles === "signup" ? "#f84f38" : "#D0D0D0" }]} onPress={() => set_roles("signup")}>
                            <Text style={[styles.switchBtnTxt, { color: roles === "signup" ? "#FFFFFF" : "#000000" }]}>SignUp</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        roles === "login" ?
                            <>
                                <TextInputComponent value={email} onChangeText={updateEmailText} keyboardType={"email-address"} secureTextEntry={false} placeholder={"Email"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <TextInputComponent value={password} onChangeText={updatePasswordText} keyboardType={"default"} secureTextEntry={true} placeholder={"Password"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <Button text={"Log In"} textColor="#FFFFFF" color="#f84f38" width={Dimensions.get('screen').width - 60} borderWidth={0} borderRadius={10} onPress={() => _login()} />
                                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                                    <Text style={styles.fpText}>Forgot Password ?</Text>
                                </TouchableOpacity>
                                <Text style={[styles.fpText, { textAlign: "center", }]}>or</Text>
                                <GoogleSigninButton size={GoogleSigninButton.Size.Icon} style={{ alignSelf: "center", marginBottom: 35 }} onPress={_googleSignIn} />
                            </>
                            :
                            <>
                                <TextInputComponent value={full_name} onChangeText={updateFullNameText} keyboardType={"default"} secureTextEntry={false} placeholder={"Full Name"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <TextInputComponent value={username} onChangeText={updateUserNameText} keyboardType={"default"} secureTextEntry={false} placeholder={"Username"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <TextInputComponent value={email} onChangeText={updateEmailText} keyboardType={"email-address"} secureTextEntry={false} placeholder={"Email"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <TextInputComponent value={password} onChangeText={updatePasswordText} keyboardType={"default"} secureTextEntry={true} placeholder={"Password"} borderBottomWidth={1} borderRadius={7} width={Dimensions.get('screen').width - 60} />
                                <Button text={"Sign Up"} textColor="#FFFFFF" color="#f84f38" width={Dimensions.get('screen').width - 60} borderBottomWidth={1} borderRadius={10} onPress={() => _signup()} />
                                <TouchableOpacity onPress={() =>Linking.openURL('https://jamverse.in/privacy-policy')}>
                                    <Text style={styles.fpText}>Read terms & conditions before signup ***</Text>
                                </TouchableOpacity>
                                <Text style={[styles.fpText, { textAlign: "center" }]}>or</Text>
                                <GoogleSigninButton size={GoogleSigninButton.Size.Icon} style={{ alignSelf: "center", marginBottom: 35 }} onPress={_googleSignIn} />
                            </>
                    }
                </ScrollView>
            </View>
            <LoadingComponent loading={loading} />
        </SafeAreaView>
    )
}