import { makeAuthorizedRequest } from "./Client"

const get_feed_data = (query, token) => {
    
    return makeAuthorizedRequest('GET', '/post/find_post_group-completed-new' + query, null, token);
}

const get_feed_likes = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/get-likes-post-group' + query, null, token);
}

const get_feed_comments = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/get-group-post-comment-by-id' + query, null, token);
}

const add_feed_comments = (data, token) => {
    return makeAuthorizedRequest('POST', '/profile/add-comment-post', data, token);
}

const get_user_feed = (token) => {
    return makeAuthorizedRequest('GET', '/post/get-group-post-created-by-me-new', null, token);
}

const get_friend_feed = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/get-group-post-created-by-me-new' + query, null, token);
}

const get_feed_by_id = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/find_post_group-completed' + query, null, token);
}

const get_incomplete_post_feed = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/find_post_group-semi-completed-new' + query, null, token);
}

const skip_incomplete_post_feed = (query, token) => {
    return makeAuthorizedRequest('GET', '/post/group-post-skip' + query, null, token);
}

const submit_for_collab_feed = (body, token) => {
    return makeAuthorizedRequest('POST', '/post/create_post_group', body, token);
}

const submit_for_new_feed = (body, token) => {
    return makeAuthorizedRequest('POST', '/post/create_post_group', body, token);
}

const like_post = (body, token) => {
    return makeAuthorizedRequest('POST', '/post/add-like-unlike', body, token);
}

export default { like_post, get_feed_data, get_feed_likes, get_feed_comments, add_feed_comments, get_user_feed, get_friend_feed, get_feed_by_id, get_incomplete_post_feed, skip_incomplete_post_feed, submit_for_collab_feed, submit_for_new_feed };