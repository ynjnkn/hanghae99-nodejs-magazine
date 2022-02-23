const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const LikeSchema = new mongoose.Schema({
    likeUserId: String,
    likedPostId: String,
}, { timestamps: true });

module.exports = mongoose.model('Like', LikeSchema);