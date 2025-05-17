const { Schema, default: mongoose } = require("mongoose");

const reviewLikeSchema = new Schema({
	reviewId: {
		type: mongoose.ObjectId,
		required: true,
	},
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const ReviewLikeModel = mongoose.model("ReviewLike", reviewLikeSchema);

module.exports = ReviewLikeModel;
