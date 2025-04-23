const { Schema, default: mongoose } = require("mongoose");

const userNotifySchema = new Schema({
	userId: String,
	notifyUpdated: Boolean,
	notifySubscription: Boolean,
	notifyComment: Boolean,
});

const UserNotifyModel = mongoose.model("UserNotify", userNotifySchema);

module.exports = UserNotifyModel;
