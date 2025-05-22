const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema(
	{
		userId: {
			type: mongoose.ObjectId,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
