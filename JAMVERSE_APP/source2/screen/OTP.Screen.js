import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import { Toast } from "react-native-toast-message/lib/src/Toast";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import RNRestart from 'react-native-restart';

/* Components Import */
import OtpInputs from '../components/core/OtpInput.core';
import Button from '../components/core/Button.Core';
import TextInputComponent from '../components/core/TextInput.Core';
import TextCore from '../components/core/Text.Core';

/* Import Default App Theme */
import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json';

/* Services */
import AuthServices from '../services/Auth.Service';
import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";
import Constant from '../constant/Constant';

function OTPScreen({ route, navigation }) {
    const [password, set_password] = React.useState("");
    const [otp, set_otp] = React.useState("");

    const _submit = React.useCallback(async () => {
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
        try {
            let { data } = await AuthServices.validateOTPService(`?email=${route?.params?.email}&otp=${otp}&password=${password}`);
            if (password) await Set_Encrypted_AsyncStorage('text', 'password', password, Constant.ENCRYPTION_KEY);
            if (route?.params?.email) await Set_Encrypted_AsyncStorage('text', 'email', route?.params?.email, Constant.ENCRYPTION_KEY);
            // Navigate to Login Screen
            RNRestart.restart();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "OTP Validation Failed",
                text2: "Invalid OTP"
            })
        }
    }, [password, otp])

    const updatePasswordText = React.useCallback((e) => set_password(e), [password])
    const updateOTPText = React.useCallback((e) => set_otp(e), [otp])

    return (
        <View style={styles.containerStyle}>
            <TextCore style={styles.headingText}>Enter OTP</TextCore>
            <TextCore style={styles.subheadingText}>Enter OTP send to your mail id :- {route?.params?.email}</TextCore>
            <OtpInputs
                inputCount={4}
                handleTextChange={updateOTPText}
                containerStyle={styles.textInputContainer}
                textInputStyle={[styles.roundedTextInput, { borderRadius: 10 }]}
                tintColor={Color.primary}
                offTintColor={Color.textSecondary}
            />
            {route?.params?.type != "signup" ? <TextInputComponent onChangeText={updatePasswordText} value={password} placeholder={"Enter New password"} keyboardType="email-address" borderBottomWidth={1} /> : <></>}
            <View style={{ marginBottom: hp(5) }} />
            <Button onPress={_submit}>Submit</Button>
        </View>
    );
}
const styles = StyleSheet.create({
    containerStyle: {
        alignItems: "center",
        width: wp(90),
        alignSelf: "center"
    },
    textInputContainer: {
        marginBottom: 20,

    },
    roundedTextInput: {
        borderRadius: 10,
        borderWidth: 4,
    },
    headingText: {
        fontSize: 25,
        marginTop: hp('5'),
        marginBottom: hp(2),
        color: Color.black
    },
    subheadingText: {
        fontSize: 14,
        marginTop: 0,
        marginBottom: hp('15'),
        color: Color.black
    },
})
export default OTPScreen;