const { Schema, default: mongoose } = require("mongoose");

const userSubscribeSchema = new Schema({
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
	subscriberId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const UserSubscribeModel = mongoose.model("UserSubscribe", userSubscribeSchema);

module.exports = UserSubscribeModel;
