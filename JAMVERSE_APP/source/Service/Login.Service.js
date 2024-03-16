import axios from "axios";
import Toast from 'react-native-toast-message';
import { Get_Encrypted_AsyncStorage, Set_Encrypted_AsyncStorage } from "react-native-encrypted-asyncstorage";

import { BASE_URL, EKey } from "../Constant/Default";

import AuthGlobalAction from "../Redux/Action/AuthGlobalAction";

import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RNRestart from 'react-native-restart';

const login = async (email, password, navigation, dispatch) => {
    await axios.post(`${BASE_URL}auth/login`, { email, password })
        .then(async response => {
            if (response.status === 200) {
                await Set_Encrypted_AsyncStorage("text", "token", response.data.token, EKey);
                await Set_Encrypted_AsyncStorage("text", "time", moment.utc().format("YYYY-MM-DD H:m:s"), EKey);
                await Set_Encrypted_AsyncStorage("object", "userData", response.data.userData, EKey);
                await Set_Encrypted_AsyncStorage("text", "email", email, EKey);
                await Set_Encrypted_AsyncStorage("text", "password", password, EKey);
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
        })
        .catch(error => {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Email or Password Incorrect',
                text2: error.response.data.message
            });
        })
}

export default login;