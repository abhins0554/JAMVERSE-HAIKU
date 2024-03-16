import axios from "axios"
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { BASE_URL } from "../Constant/Default"

export const sendOTPForgotPassword = async (email) => {
    // /auth/forgot-password
    try {
        let {data} = await axios.get(`${BASE_URL}auth/forgot-password?email=${email}`);
        if (data.message == "OTP has been sent") {
            return true;
        }
        return false;
    } catch (error) {
        Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: error?.response?.data?.message ?? ""
        })
        return false;
    }
}

export const validateOTP = async ({email, password, otp, navigation}) => {
    try {
        let {data} = await axios.get(`${BASE_URL}auth/validate-otp-password?email=${email}&otp=${otp}&password=${password}`);
        if (data?.message === "Password Reset Successfully") {
            Toast.show({
                type: "success",
                text1: data?.message ?? "",
                text2: "Please login back"
            })
            navigation. navigate("Login_Signup");
        }
    } catch (error) {
        Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: error?.response?.data?.message ?? ""
        })
    }
}