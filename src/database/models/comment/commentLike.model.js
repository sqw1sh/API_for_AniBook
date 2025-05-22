const { Schema, default: mongoose } = require("mongoose");

const commentLikeSchema = new Schema(
	{
		commentId: {
			type: mongoose.ObjectId,
			required: true,
		},
		userId: {
			type: mongoose.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

const CommentLikeModel = mongoose.model("CommentLike", commentLikeSchema);

module.exports = CommentLikeModel;
