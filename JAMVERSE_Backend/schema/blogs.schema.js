const mongoose = require("mongoose");

const blogModel = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, { timestamps: true });




const model = mongoose.model('blog', blogModel);
module.exports = model;