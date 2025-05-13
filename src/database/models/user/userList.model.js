const { Schema, default: mongoose } = require("mongoose");

const listSchema = new Schema(
	{
		list: String,
		stories: [mongoose.ObjectId],
	},
	{ _id: false }
);

const userListSchema = new Schema({
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
	lists: [listSchema],
});

const UserListModel = mongoose.model("UserList", userListSchema);

module.exports = UserListModel;
