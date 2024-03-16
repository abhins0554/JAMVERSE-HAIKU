const mongoose = require("mongoose");

const storyModel = mongoose.Schema({
    mediaLink: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    dateTime: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        enum: [true, false],
        default: false
    },
    view: [{
        type: String,
    }],
}, { timestamps: true });

storyModel.index({ user_id: 1 });


const model = mongoose.model('story', storyModel);
module.exports = model;