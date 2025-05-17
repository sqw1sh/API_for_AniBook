const { Schema, default: mongoose } = require("mongoose");

const reviewSchema = new Schema(
	{
		userId: {
			type: mongoose.ObjectId,
			required: true,
		},
		storyId: {
			type: mongoose.ObjectId,
			required: true,
		},
		storyRatingId: {
			type: mongoose.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
