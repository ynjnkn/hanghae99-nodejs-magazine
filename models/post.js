const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema(
    {
        writer: String,
        images: {
            type: [String],
            default: undefined,
        },
        desc: String,
    }, { timestamps: true });

module.exports = mongoose.model('Post', PostsSchema);