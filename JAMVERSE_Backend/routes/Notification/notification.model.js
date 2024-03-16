const admin = require("firebase-admin");
const userModel = require("../../schema/users.schema");
const notificationModelSchema = require("../../schema/notification.schema");
const mongoose = require("mongoose");

class NotificationModel {
    notificationSendBody({ tokensArray, title, description, image, data }) {
        let notification = {
            title: title,
            body: description,
        };
        if (image) notification.imageUrl = image;
        return admin.messaging().sendMulticast({
            // tokens: result, // ['token_1', 'token_2', ...]
            tokens: tokensArray, // ['token_1', 'token_2', ...]
            notification: notification,
            data: data,
        });
    }

    getFriendData(_id) {
        return userModel.find({ _id: _id });
    }

    updateToken({ _id, token }) {
        return userModel.findOneAndUpdate({ _id: _id, }, { token: token });
    }

    getAllNoitification(_id) {
        return notificationModelSchema.aggregate([
            {
                $match: {
                    to_user_id: mongoose.Types.ObjectId(_id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "from_user_id",
                    foreignField: "_id",
                    as: 'hostData'
                }
            },
            {
                $unwind: "$hostData"
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    post_id: 1,
                    createdAt: 1,
                    "hostData.full_name": 1,
                    "hostData.user_name": 1,
                    "hostData.personalImage": 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
    }
}

module.exports = new NotificationModel;