import axios from "axios";

import { BASE_URL } from "../Constant/Default";

import Toast from "react-native-toast-message";

export const cretePost = async (reduxData, navigation, reduxDataBG) => {
    let data = {
        "font_size": reduxData?.fontSize,
        "color": reduxData?.color,
        "alignment": reduxData?.alignment,
        "letter_spacing": reduxData?.letterSpacing,
        "font_family": reduxData?.fontFamily,
        "bg_type": reduxDataBG?.type,
        "bg_info": reduxDataBG?.bg,
        "text": reduxData?.title,
        "type": "3-line-single"
    }


    if (data.text.length === 0 && data.text.length < 10 && data.text.length > 80) return true;
    if (data.text.length < 10) Toast.show({ type: "error", text1: "Validation Error", text2: "Please Add more text" })
    if (data.text.length > 80) Toast.show({ type: "error", text1: "Validation Error", text2: "Text cant be more than 80 characters" })
    if (data.font_size < 7) data.font_size = 8;

    await axios.post(`${BASE_URL}post/create_post`, data, { headers: { Authorization: `Bearer ${reduxData?.AuthGlobalReducer?.AuthGlobalData?.token}` } })
        .then(response => {
            // console.log(response.data);
            navigation.push("Home", { isReload: true });
        })
        .catch(error => {
            console.log(error.response.data);
        })
}

export const fetchPost = async (reduxData, query = '?skip=0&limit=10') => {
    try {
        let url = `${BASE_URL}post/get_post${query}`
        let response = await axios.get(url, { headers: { Authorization: `Bearer ${reduxData?.AuthGlobalReducer?.AuthGlobalData?.token}` } })
        return response.data.data ?? [];
    } catch (error) {
        return [];
    }
}

export const fetchGroupPost = async (reduxData, query = '?skip=0&limit=10') => {
    try {
        let url = `${BASE_URL}post/find_post_group-completed${query}`
        let response = await axios.get(url, { headers: { Authorization: `Bearer ${reduxData?.token}` } })
        return response.data.result ?? [];
    } catch (error) {
        return [];
    }
}

export const likeUnlikePost = async (reduxData, likes, post_id, post_type) => {
    try {
        let url = `${BASE_URL}post/add-like-unlike`;
        let response = await axios.post(url, {
            "post_id": post_id,
            "type": likes ? "unlike" : "like",
            post_type: post_type ?? "single"
        }, { headers: { Authorization: `Bearer ${reduxData?.token}` } })
        return true;
    } catch (error) {
        console.log(error);
        console.log(error?.response?.data);
        return false;
    }
}

export const get_user_post = async (_id, token) => {
    try {
        let url = `${BASE_URL}profile/search-users-profile-by-id?_id=${_id}`;
        let response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
        return response?.data;
    } catch (error) {
        return {};
    }
}

export const getSemiCompletedGroupPost = async (page, token) => {
    try {
        let response = await axios.get(`${BASE_URL}post/find_post_group-semi-completed?page=${page}`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data ?? {};
    } catch (error) {
        return {};
    }
}


export const submitGroupPost = async (token, text, lineNumber, post_id) => {
    try {
        let response = await axios.post(`${BASE_URL}post/create_post_group`, {
            line: lineNumber,
            text: text,
            post_id: post_id
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            });
        return response.data.data._id ?? null
    } catch (error) {
        return null;
    }
}


export const addPostToSkip = async (post_id, token) => {
    try {
        await axios.get(`${BASE_URL}post/group-post-skip?_id=${post_id}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (error) {
        
    }
}

export const createGroupPostNew = async (line = 1, text = "", font_family = "Robot", color = "#FFFFFF", bg_info, token, line1) => {
    try {
        let {data} = await axios.post(`${BASE_URL}post/create_post_group`, { line, text, font_family, color, bg_info, title: line1 }, { headers: { Authorization: `Bearer ${token}` } })
        return data;
    } catch (error) {
        Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: error.response.data.message === "BG Info is required" ? "Select background image from camera icon" : error.response.data.message
        })
        return error.response.data ?? {};
    }
}


export const postLikeinGroupById = async (_id, token) => {
    try {
        let { data } = await axios.get(`${BASE_URL}post/get-likes-post-group?_id=${_id}`, { headers: { Authorization: `Bearer ${token}` } })
        return data.data;
    } catch (error) {
        return null;
    }
}


export const getCommentByPostId = async (_id, token) => {
    try {
        let { data } = await axios.get(`${BASE_URL}post/get-group-post-comment-by-id?_id=${_id}`, { headers: { Authorization: `Bearer ${token}` } })
        return data.data;
    } catch (error) {
        return null;
    }
}

export const addCommentByPostId = async (token, post_id, comment_id, text) => {
    // /profile/add-comment-post
    try {
        let { data } = await axios.post(`${BASE_URL}profile/add-comment-post`, {
            post_id, 
            comment_id, 
            text
        }, { headers: { Authorization: `Bearer ${token}` } })
        return data.data;
    } catch (error) {
        return null;
    }
}


export const fetchGroupPostByID = async (token, query = '?skip=0&limit=10') => {
    try {
        let url = `${BASE_URL}post/find_post_group-completed${query}`
        let response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
        return response.data.result ?? [];
    } catch (error) {
        return [];
    }
}