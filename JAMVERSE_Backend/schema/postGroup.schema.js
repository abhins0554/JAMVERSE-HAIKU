const mongoose = require("mongoose");
const moment = require("mongoose")

const postGroupModel = mongoose.Schema({
    mediaLink: {
        type: String,
        required: true
    },
    font_family: {
        type: String,
        required: true,
        default: "Robot"
    },
    color: {
        type: String,
        required: true,
        default: "#FFFFFF"
    },
    title: {
        type: String,
    },
    first_line_text:{
        type: String,
        required: true
    },
    second_line_details:{
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        second_line_text:{
            type: String,
        }
    },
    third_line_details:{
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        third_line_text:{
            type: String,
        }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isDeleted: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    skips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comment: [
        {
            initial_user_id: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            initial_comment_text : {
                type: String,
            },
            reply: [
                {
                    reply_user_id: { 
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'user'
                    },
                    reply_comment_text : {
                        type: String,
                    },
                }
            ]
        }
    ],
    is_done: {
        type: Boolean,
    }
}, { timestamps: true });

postGroupModel.index({ user_id: 1 });


const model = mongoose.model('post-groups', postGroupModel);
module.exports = model;