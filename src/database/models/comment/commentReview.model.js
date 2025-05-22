const { Schema, default: mongoose } = require("mongoose");

const commentReviewSchema = new Schema({
	reviewId: {
		type: mongoose.ObjectId,
		required: true,
	},
	commentId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const CommentReviewModel = mongoose.model("CommentReview", commentReviewSchema);

module.exports = CommentReviewModel;
