const notificationModel = require("./notification.model");

class NotificationController {
    async sendNotification(req, res) {
        try {
            let { title, description, image, tokensArray } = req.body;
            let response = await notificationModel.notificationSendBody({ tokensArray, title, description, image });
            return res.json({
                message: "Notification Send",
                code: 200,
                response
            });
        } catch (error) {
            return res.status(401).json({ message: error.message, code: 401, data: null });
        }
    }

    async updateToken(req, res) {
        try {
            let { _id } = req.decoded;
            let token = req.body.token;
            let result = await notificationModel.updateToken({ _id, token });
            return res.status(200).json({ message: "Token Updated", code: 200, data: result });

        } catch (error) {
            return res.status(401).json({ message: error.message, code: 401, data: null });
        }
    }

    async getNotification(req, res) {
        try {
            let { _id } = req.decoded;
            let result = await notificationModel.getAllNoitification(_id);

            return res.status(200).json({ message: "Sucess", code: 200, data: result });
        } catch (error) {
            return res.status(401).json({ message: error.message, code: 401, data: null });
        }
    }
}

module.exports = new NotificationController;