import axios from "axios"
import { BASE_URL } from "../Constant/Default"

export const followerFollowingList = async (token) => {
    try {
        let {data} = await axios.get(`${BASE_URL}followers/followersandfollowinglist`, {headers: { Authorization: `Bearer ${token}` }})
        return data?.data ?? {};
    } catch (error) {
        return [];
    }
}