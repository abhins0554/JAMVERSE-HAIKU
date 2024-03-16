import axios from "axios"
import { BASE_URL } from "../Constant/Default"

export const getSearchData = async (text, AuthGlobalDataToken) => {
    try {
        let response = await axios.get(`${BASE_URL}profile/search-users?search=${text}&skip=0&limit=150`, {headers: { Authorization: `Bearer ${AuthGlobalDataToken}` }});
        if(response.data.message == "Found !") {
            return response.data.data ?? [] ;
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const userSearchSingle = async (_id, AuthGlobalDataToken) => {
    try {
        let response = await axios.get(`${BASE_URL}profile/search-users-profile-by-id?_id=${_id}`, {headers: { Authorization: `Bearer ${AuthGlobalDataToken}` }});
        if(response.data.message == "Found !") {
            return response.data.data ?? [] ;
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}


export const getSuggestionData = async ({skip, limit, AuthGlobalDataToken}) => {
    try {
        let response = await axios.get(`${BASE_URL}profile/get-user-suggestion?skip=${skip}&limit=${limit}`, {headers: { Authorization: `Bearer ${AuthGlobalDataToken}` }});
        if(response.data.message == "Data Found !") {
            return response.data.data ?? [] ;
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}