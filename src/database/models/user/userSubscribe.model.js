const { Schema, default: mongoose } = require("mongoose");

const userSubscribeSchema = new Schema({
	userId: {
		type: ObjectId,
		required: true,
	},
	subscriberId: {
		type: ObjectId,
		required: true,
	},
});

const UserSubscribeModel = mongoose.model("UserSubscribe", userSubscribeSchema);

module.exports = UserSubscribeModel;
