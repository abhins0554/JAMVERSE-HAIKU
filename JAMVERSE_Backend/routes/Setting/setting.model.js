const mongoose = require("mongoose");
const userSchema = require("../../schema/users.schema");
const postSchema = require("../../schema/post.schema");

class settingModel {
    async updatePassword(email, password) {
        return await userSchema.findOneAndUpdate({email: email},{password: password});
    }
    async findUserData (_id) {
        return userSchema.find({_id: mongoose.Types.ObjectId(_id)}, 
        {
            full_name: 1,
            user_name: 1,
            email: 1,
            isBlocked: 1,
            isDeleted: 1,
            personalImage: 1,
            about: 1,
            followers: 1,
            following: 1,
        });
    }

    async findUserPostCount (_id) {
        return postSchema.find({createdBy:  mongoose.Types.ObjectId(_id)}).count();
    }

    async getNotificationStatus(_id,) {
        return userSchema.findById(mongoose.Types.ObjectId(_id), { _id: 1, isNotification: 1 });
    }

    async updateNotificationStatus(_id, status) {
        return userSchema.findById(mongoose.Types.ObjectId(_id), { isNotification: status });
    }
}

module.exports = new settingModel;