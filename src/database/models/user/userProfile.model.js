const { Schema, default: mongoose } = require("mongoose");

const userProfileSchema = new Schema({
	userId: String,
	avatar: String,
	description: String,
	vkId: String,
	tgId: String,
	shikiId: String,
});

const UserProfileModel = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfileModel;
