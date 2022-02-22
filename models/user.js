const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: String,
    nickname: String,
    password: String,
});
// UserSchema.virtual("userId").get(function () {
//     return this._id.toHexString();
// });
// UserSchema.set("toJSON", {
//     virtuals: true,
// });
// const User = mongoose.model("User", UserSchema);
// module.exports = { User };

module.exports = mongoose.model("User", UserSchema);