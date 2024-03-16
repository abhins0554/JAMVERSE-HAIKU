const userSchema = require("../../schema/users.schema");

const postGroupSchema = require('../../schema/postGroup.schema');

const mongoose = require("mongoose");
class chatModel {
    async getUserFromEmail(email) {
        return await userSchema.find({ email: email });
    }

    async getUserFromUserName(username) {
        return await userSchema.find({ user_name: username });
    }


    async createUser(email, password, full_name, user_name, mobile, login_type, ip, email_verified) {
        return await userSchema.create({ email, password, full_name, user_name, mobile, login_type, isBlocked: false, isDeleted: false, ip, is_verify: email_verified ?? false });
    }


    async updatePassword(email, password) {
        return await userSchema.findOneAndUpdate({ email: email }, { password: password });
    }

    async updateIp(_id, ip) {
        return await userSchema.findByIdAndUpdate({_id: mongoose.Types.ObjectId(_id)}, { ip: ip });
    }


    async validateUser(userId) {
        return await userSchema.findOne({
            _id: userId,
            isDeleted: false,
            isBlocked: false
        })
    }

    async findUserPostCount(user_id) {
        user_id = mongoose.Types.ObjectId(user_id)
        return postGroupSchema.aggregate([
            {
                $match: {
                    '$or': [
                        { "created_by": user_id },
                        { "second_line_details.created_by": user_id },
                        { "third_line_details.created_by": user_id }
                    ]
                }
            },
            {
                $count: "number"
            },
        ]);
    }


    async findByIdandUpdateOTP(_id, otp, is_verify) {
        return await userSchema.findByIdAndUpdate(mongoose.Types.ObjectId(_id), { otp: otp, is_verify });
    }
}

module.exports = new chatModel;
