import {BASE_URL} from "../Constant/Default";
import axios from "axios";
import { Toast } from "react-native-toast-message/lib/src/Toast";

export const updateProfile = async (data, reduxData, navigation) => {
    await axios.post(`${BASE_URL}profile/update-profile-detail`, data, {headers: { Authorization: `Bearer ${reduxData?.token}` }})
    .then(response=> {
        if (response.data.message === "Updated Successfully") {
            navigation.push("UserProfileScreen");
        }
    })
    .catch(error => {
        console.log(error.response.data);
    })
}

export const updateProfileImage = async (image, token, navigation) => {
    let body = new FormData();
    let filename = Platform.OS === 'android' ? image.path : image.uri.replace('file://', '').split('/').pop();
    body.append('profileImage', { uri: Platform.OS === 'android' ? image.path : image.uri.replace('file://', ''), name: filename, type: 'image/jpg', });


    const header = {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`
    }
    fetch(`${BASE_URL}profile/update-profile-image`, {
        method: 'POST',
        headers: header,
        body: body,
    }).then(response => response.json())
        .then(res => {
            console.log(res)
            if (res.message === "Profile Updated") {
                Toast.show({
                    type: 'success',
                    text1: 'Profile Updated Successfully',
                });
                navigation.push("UserProfileScreen");
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                });
            }
        })
        .catch(err => console.log("err", err))

}


export const getGroupPostById = async ({skip, limit, user_id, token}) => {
    try {
        let { data } = await axios.get(`${BASE_URL}post/get-group-post-created-by-me?skip=${skip}&limit=${limit}&user_id=${user_id}`, {headers: { Authorization: `Bearer ${token}`}});
        return data.result;
    } catch (error) {
        return null;
    }
}