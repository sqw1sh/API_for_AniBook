const { Schema, default: mongoose } = require("mongoose");

const userListSchema = new Schema({
	userId: String,
	storyId: String,
	list: String,
});

const UserListModel = mongoose.model("UserList", userListSchema);

module.exports = UserListModel;
