const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    writer: String,
    images: {
        type: [String],
        default: undefined,
    },
    desc: String,
}, { timestamps: true });

PostSchema.virtual("date").get(function () {
    return this.createdAt.toISOString();
});
PostSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model('Post', PostSchema);