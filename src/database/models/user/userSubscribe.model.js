const { Schema, default: mongoose } = require("mongoose");

const userSubscribeSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	subscriberId: {
		type: String,
		required: true,
	},
});

const UserSubscribeModel = mongoose.model("UserSubscribe", userSubscribeSchema);

module.exports = UserSubscribeModel;
