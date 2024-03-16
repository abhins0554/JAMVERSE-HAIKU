const notificationModel = require("./notification.model");


class notificationHelper {
    async sendNotification({ req, _id, message, type, post_id }) {
        let { _id: userId, full_name } = req.decoded;
        try {
            let [userData] = await notificationModel.getFriendData(_id);
            await notificationModel.notificationSendBody({
                title: `${full_name} ${message}`,
                description: "Press to know more",
                image: null,
                tokensArray: [userData.token],
                data: JSON.stringify({ type: type, post_id, user_id: userId })
            })
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new notificationHelper;