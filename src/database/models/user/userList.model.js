const { Schema, default: mongoose } = require("mongoose");

const userListSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	storyId: {
		type: String,
		required: true,
	},
	list: {
		type: String,
		required: true,
	},
});

const UserListModel = mongoose.model("UserList", userListSchema);

module.exports = UserListModel;
