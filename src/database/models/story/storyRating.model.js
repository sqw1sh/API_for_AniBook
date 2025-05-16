const { Schema, default: mongoose } = require("mongoose");

const storyRatingSchema = new Schema({
	storyId: {
		type: mongoose.ObjectId,
		required: true,
	},
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
	score: {
		type: Number,
		required: true,
	},
});

const StoryRatingModel = mongoose.model("StoryRating", storyRatingSchema);

module.exports = StoryRatingModel;
