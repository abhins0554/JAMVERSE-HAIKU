import axios from "axios"
import { BASE_URL } from "../Constant/Default"

export const follow = async (AuthGlobalDataToken, _id) => {
    try {
        let {data} = await axios.post(`${BASE_URL}followers/follow`,{following: _id} , {headers: { Authorization: `Bearer ${AuthGlobalDataToken}` }});
        return data
    } catch (error) {
        console.log(error);
        return error;
    }
}

export const unfollow = async (AuthGlobalDataToken, _id) => {
    try {
        let {data} = await axios.post(`${BASE_URL}followers/unfollow`,{following: _id} , {headers: { Authorization: `Bearer ${AuthGlobalDataToken}` }});
        return data;
    } catch (error) {
        return error;
    }
}