import axios from "axios";
import Toast from 'react-native-toast-message';
import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";

import { BASE_URL, EKey } from "../Constant/Default";

import AuthGlobalAction from "../Redux/Action/AuthGlobalAction";

import moment from "moment";

const signup = async (email, password, full_name, username, navigation, dispatch) => {
    await axios.post(`${BASE_URL}auth/signup`, { email, password, full_name, user_name: username, login_type: 'normal' })
        .then(async response => {
            navigation.navigate("OTPScreen",{email: email, password: password, type: "signup"});
            Toast.show({
                type: 'success',
                text1: 'Signup Successful.',
                text2: "Please Login Back !"
            });
        })
        .catch(error => {
            // console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Email already exist',
                text2: error?.response?.data?.message
            });
        })
}

export default signup;