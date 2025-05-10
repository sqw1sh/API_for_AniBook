const { Schema, default: mongoose } = require("mongoose");

const userListSchema = new Schema({
	userId: {
		type: ObjectId,
		required: true,
	},
	lists: [
		{
			list: String,
			stories: [ObjectId],
		},
	],
});

const UserListModel = mongoose.model("UserList", userListSchema);

module.exports = UserListModel;
