import React from 'react';
import { SafeAreaView, Text, StyleSheet, Dimensions } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '../Common/Button';
import customStyle from "../Common/styles";
import TextInputComponent from '../Common/TextInput';
import { sendOTPForgotPassword } from '../Service/ForgotPassword';
import { PlatFormData } from '../Constant/CustomPlatform';
import LoadingComponent from '../Components/LoadingComponent';
import { Color } from '../Constant/Color.Constant';

function ForgotPassword({navigation}) {
    const [email, set_email] = React.useState("");

    const [loading, set_loading] = React.useState(false);

    const _submit = async () => {
        set_loading(true);
        await AsyncStorage.setItem("forgot_password_email", email);
        // API Call to forgot password api
        let response = await sendOTPForgotPassword(email);
        if (response) {
            navigation.navigate("OTPScreen",{email: email});
        }
        set_loading(false);
    }

    const emailTextUpdate = React.useCallback((e) => set_email(e),[])

    return (
        <SafeAreaView style={[customStyle.mainframe, styles.mainframe]}>
            <Text style={styles.headingText}>Forgot Password</Text>
            <TextInputComponent onChangeText={emailTextUpdate} value={email} placeholder={"Enter Email"} width={Dimensions.get("screen").width - 20} borderWidth={1} keyboardType="email-address" borderRadius={7} borderBottomWidth={1} />
            <Button text={"Submit"} onPress={_submit} color={"#f84f38"} width={Dimensions.get('window').width - 20} borderRadius={7} />
            <LoadingComponent loading={loading} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    mainframe: {
        alignItems: "center",
        backgroundColor: Color.backgroundColor,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 50,
        color: PlatFormData.textPrimaryColor
    }
})
export default ForgotPassword;