const mongoose = require("mongoose");
Schema=mongoose.Schema;

const postModel = mongoose.Schema({
    font_size: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    alignment: {
        type: String,
        required: true
    },
    letter_spacing: {
        type: String,
        required: true
    },
    font_family: {
        type: String,
        required: true
    },
    background: {
        bg_type: {
            type: String,
            required: true,
            enum: ['color', 'image'],
        },// color or image
        bg_info: {
            type: String,
            required: true
        }//if background_type contain color then this feild contain color code or else image link
    },
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
        enum : [true, false],
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            _id : mongoose.ObjectId,
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            commentedAt: {
                type: Date,
                default: Date.now()
            },
        },
    ],
    p_type: {
        type: String,
        required: true,
        enum : ["3-line-single", "story", "image", "3-line-group"] //! 3-line-single is user himself, story for long paragraphs
                                                                    //! image like 1:1 image share, 3-line-group for user with global
    }
}, { timestamps: true });

postModel.index({ createdBy: 1 });


const model = mongoose.model('post', postModel);
module.exports = model;