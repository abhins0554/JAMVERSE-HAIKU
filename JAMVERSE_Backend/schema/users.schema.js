const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    isNotification: {
        type: Boolean,
        enum : [true, false],
        default: true,
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
    },
    mobile: {
        type: Number,
        minlength: 10,
        maxlength: 10,
    },
    personalImage: {
        pI1: { type: String, },
        pI2: { type: String, },
    },
    location: [{
        longitude: { type: String, },
        latitude: { type: String, },
    }],
    ip: { type: String },
    login_type: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        required: true,
        enum : [true, false],
        default : false
    },
    isDeleted: {
        type: Boolean,
        required: true,
        enum : [true, false],
        default : false
    },
    blockList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    saved_post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    about: {
        type: String
    },
    device: {
        type: String,
        required: true,
        enum : ['Mobile', 'Website'],
        default : 'Mobile'
    },
    otp: {
        type: Number,
    },
    is_verify: {
        type: Boolean,
        default: false,
    },
    notification_token: {
        type: String
    }
}, { timestamps: true });

userModel.index({ email: 1 });
userModel.index({ user_name: 1 });
userModel.index({ user_name: 1, email: 1 });

const model = mongoose.model('user', userModel);
module.exports = model;