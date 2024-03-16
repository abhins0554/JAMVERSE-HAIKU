const mongoose = require("mongoose");
const userSchema = require("../../schema/users.schema");
const postSchema = require("../../schema/post.schema");
const postGroupSchema = require('../../schema/postGroup.schema')
const notificationSchema = require('../../schema/notification.schema')
const moment = require('moment');

class profileModel {
    async updateProfile(_id, fileUrl) {
        return await userSchema.findByIdAndUpdate(mongoose.Types.ObjectId(_id), { "personalImage.pI1": fileUrl });
    }

    async updateAbout(_id, about, full_name) {
        let data = {};
        if (about) data.about = about;
        if (full_name) data.full_name = full_name;
        return await userSchema.findByIdAndUpdate(mongoose.Types.ObjectId(_id), data);
    }

    async searchUsers(search, skip, limit) {
        let query = [
            { $match: { $or: [{ full_name: { $regex: new RegExp(search, "i") } }, { user_name: { $regex: new RegExp(search, "i") } }] } },
            { $project: { full_name: 1, user_name: 1, personalImage: 1 } },
        ];
        if (limit) query.push({ "$limit": Number(skip) + Number(limit) })
        if (skip) query.push({ "$skip": Number(skip) })
        return await userSchema.aggregate(query)
    }

    async searchUsersProfileById(_id) {
        let query = [];
        let match = { $match: { _id: mongoose.Types.ObjectId(_id) } };
        query.push(match);
        let project = { $project: { followers: { $size: "$followers" }, following: { $size: "$following" }, full_name: 1, user_name: 1, personalImage: 1, about: 1, followers_list: "$followers" } }
        query.push(project);
        return await userSchema.aggregate(query)
    }

    async lastPost(_id) {
        return postSchema.aggregate([{ $match: { createdBy: mongoose.Types.ObjectId(_id) } }, { $sort: { createdAt: -1 } }]);
    }

    async getUserSavedPostIdFromUser(_id) {
        let query = [{ $match: { _id: mongoose.Types.ObjectId(_id) } }, { $project: { saved_post: 1 } }]
        return await userSchema.aggregate(query)
    }

    async getUserSavedPostById(ids) {
        ids = ids.map(i => mongoose.Types.ObjectId(i))
        let query = [{ $match: { _id: { $in: ids } } }]
        return await postSchema.aggregate(query)
    }

    async userFollowingList(_id) {
        let query = [{ $match: { _id: mongoose.Types.ObjectId(_id) } }, { $project: { following: 1 } }]
        return await userSchema.aggregate(query)
    }

    async getuserPostCount(_id) {
        return postSchema.find({ createdBy: mongoose.Types.ObjectId(_id) }).count();
    }

    async getUserSuggestion({ skip, limit, _id }) {
        let query = [
            { $match: { _id: { $nin: [mongoose.Types.ObjectId(_id)] } } },
            { $project: { personalImage: 1, full_name: 1, user_name: 1, email: 1 } },
            { "$limit": skip + limit },
            { "$skip": skip }
        ]
        return await userSchema.aggregate(query)
    }

    async addComment(user_id, text, comment_id, post_id) {

        let response;

        if (comment_id) {
            response = await postGroupSchema.findOne(
                { _id: mongoose.Types.ObjectId(post_id), "comment._id": mongoose.Types.ObjectId(comment_id) },
            );

            for (const com of response.comment) {
                if (String(com._id) === comment_id) {
                    com.reply.push({ reply_user_id: user_id, reply_comment_text: text })
                }
            }
            response.save();
        }
        else {
            response = await postGroupSchema.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(post_id) },
                { $push: { comment: [{ initial_comment_text: text, initial_user_id: user_id }] } }
            )
        }
    }

    async createNotificationData({ post_id, to_user_id, title, body, from_user_id }) {
        await new notificationSchema({ post_id, to_user_id, title, body, dateTime: moment().format('YYYY-MM-DD HH:MM:Ss A'), type: 'like', from_user_id }).save()
    }

    async getGroupPostCount(user_id) {
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
            }
        ]);
    }

}

module.exports = new profileModel;