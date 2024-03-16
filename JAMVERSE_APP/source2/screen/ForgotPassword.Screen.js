import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { Toast } from 'react-native-toast-message/lib/src/Toast';

import Button from '../components/core/Button.Core';
import TextInputComponent from '../components/core/TextInput.Core';
import TextCore from '../components/core/Text.Core';

import Styles from '../theme/styles/defaultStyle';
import Color from '../theme/color/defaultColor.json'
import AuthService from '../services/Auth.Service';

function ForgotPassword({ navigation }) {
    const [email, set_email] = React.useState("");
    const [loading, set_loading] = React.useState(false);

    const _submit = React.useCallback(async () => {
        set_loading(true);
        try {
            let { data } = await AuthService.forgotPasswordService(`?email=${email}`);
            if (data) {
                navigation.navigate("OTPScreen", { email: email });
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.response.data.message
            })
        }
        set_loading(false);
    }, [email, loading])

    const emailTextUpdate = React.useCallback((e) => set_email(e), [])

    return (
        <View style={[Styles.screenMainFrame, { padding: 10 }]}>
            <TextCore style={styles.headingText}>Forgot Password</TextCore>
            <TextInputComponent onChangeText={emailTextUpdate} value={email} placeholder={"Enter Email"} width={Dimensions.get("screen").width - 20} borderWidth={1} keyboardType="email-address" borderRadius={7} borderBottomWidth={1} />
            <Button onPress={_submit} >Submit</Button>
        </View>
    );
}
const styles = StyleSheet.create({
    headingText: {
        fontSize: 25,
        marginTop: 25,
        marginBottom: 50,
        color: Color.textPrimary
    }
})


export default ForgotPassword;