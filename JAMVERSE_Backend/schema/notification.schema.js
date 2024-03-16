const mongoose = require("mongoose");

const notificationModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    from_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post-groups'
    },
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post-groups'
    },
    to_user_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }],
    dateTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum : ["like", "comment"]
    }
}, { timestamps: true });

notificationModel.index({ from_user_id: 1 });
notificationModel.index({ to_user_id: 1 });
notificationModel.index({ from_user_id: 1, to_user_id: 1 });
notificationModel.index( { "createdAt": 1 }, { expireAfterSeconds: 864000 } ); //10 days


const model = mongoose.model('notification', notificationModel);
module.exports = model;