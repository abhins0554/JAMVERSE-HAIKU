import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native';

import OtpInputs from '../Components/OTP.Component';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Button from '../Common/Button';

import customStyle from "../Common/styles";
import TextInputComponent from '../Common/TextInput';
import { PlatFormData } from '../Constant/CustomPlatform';
import { validateOTP } from '../Service/ForgotPassword';
import { Color } from '../Constant/Color.Constant';

function OTPScreen({ route, navigation }) {
    const [password, set_password] = React.useState("");
    const [otp, set_otp] = React.useState("");

    const _submit = async () => {
        if (otp.length !== 4) Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Enter OTP"
        })
        if (password.length > 6 && route.params.type != "signup") Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: "Password must be of 6 character"
        })
        await validateOTP({ email: route?.params?.email, password: route.params.type == "signup" ? route.params.password : password, otp, navigation });
    }

    const updatePasswordText = React.useCallback((e) => set_password(e), [password])

    return (
        <SafeAreaView style={[customStyle.mainframe, {backgroundColor: Color.backgroundColor}]}>
            <View style={styles.containerStyle}>
                <Text style={styles.headingText}>Enter OTP</Text>
                <Text style={styles.subheadingText}>Enter OTP send to your mail id :- {route?.params?.email}</Text>
                <OtpInputs
                    inputCount={4}
                    handleTextChange={e => set_otp(e)}
                    containerStyle={styles.textInputContainer}
                    textInputStyle={[styles.roundedTextInput, { borderRadius: 100 }]}
                    tintColor="#f84f38"
                    offTintColor={PlatFormData.textSecondaryColor}
                />
                {route.params.type != "signup" ? <TextInputComponent onChangeText={updatePasswordText} value={password} placeholder={"Enter New password"} width={Dimensions.get("screen").width - 20} borderWidth={1} keyboardType="email-address" borderRadius={7} borderBottomWidth={1} /> : <></>}
                <Button text={"Submit"} onPress={_submit} color={"#f84f38"} width={Dimensions.get('window').width - 20} borderRadius={7} />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center",
        backgroundColor: Color.backgroundColor
    },
    textInputContainer: {
        marginBottom: 20,

    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
        color: PlatFormData.textPrimaryColor,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 50,
        color: PlatFormData.textPrimaryColor,
    },
    subheadingText: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 35,
        color: PlatFormData.textPrimaryColor,
    },
})
export default OTPScreen;