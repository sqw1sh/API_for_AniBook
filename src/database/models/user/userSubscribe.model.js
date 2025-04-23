const { Schema, default: mongoose } = require("mongoose");

const userSubscribeSchema = new Schema({
	authorId: String,
	followerId: String,
});

const UserSubscribeModel = mongoose.model("UserSubscribe", userSubscribeSchema);

module.exports = UserSubscribeModel;
