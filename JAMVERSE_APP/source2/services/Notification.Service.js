import { makeAuthorizedRequest } from "./Client"

const getNotification = (token) => {
    return makeAuthorizedRequest('GET', '/notification/get-notification', null, token);
}

const saveNotificationToken = (ntoken, token) => {
    return makeAuthorizedRequest('POST', '/notification/update-token', {token: ntoken}, token)
}

export default { getNotification, saveNotificationToken };