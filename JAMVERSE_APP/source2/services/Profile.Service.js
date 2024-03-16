import { makeAuthorizedRequest } from "./Client";

import Constant from '../constant/Constant'

const getFriendPost = (query, token) => {
    return makeAuthorizedRequest('GET', '/profile/search-users-profile-by-id' + query, null, token);
}

const searchUserProfile = (query, token) => {
    return makeAuthorizedRequest('GET', '/profile/search-users' + query, null, token);
}

const followUser = (body, token) => {
    return makeAuthorizedRequest('POST', '/followers/follow', body, token);
}

const unFollowUser = (body, token) => {
    return makeAuthorizedRequest('POST', '/followers/unfollow', body, token);
}

const getFollowerFollowing = (token) => {
    return makeAuthorizedRequest('GET', '/followers/followersandfollowinglist', null, token);
}

const updateProfile = (data, token) => {
    return makeAuthorizedRequest('POST', '/profile/update-profile-detail', data, token)
}

const userProfileUpdate = (token) => {
    return makeAuthorizedRequest('GET', '/setting/get-me', null, token)
}

const updateProfileImage = (image, token) => {
    let body = new FormData();
    let filename = Platform.OS === 'android' ? image.path : image.uri.replace('file://', '').split('/').pop();
    body.append('profileImage', { uri: Platform.OS === 'android' ? image.path : image.uri.replace('file://', ''), name: filename, type: 'image/jpg', });


    const header = {
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`
    }
    return fetch(`${Constant.BASE_URL}/profile/update-profile-image`, {
        method: 'POST',
        headers: header,
        body: body,
    })
}

export default { getFriendPost, searchUserProfile, followUser, unFollowUser, getFollowerFollowing, updateProfile, userProfileUpdate, updateProfileImage };