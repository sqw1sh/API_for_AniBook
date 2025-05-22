const { Schema, default: mongoose } = require("mongoose");

const commentStorySchema = new Schema({
	storyId: {
		type: mongoose.ObjectId,
		required: true,
	},
	commentId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const CommentStoryModel = mongoose.model("CommentStory", commentStorySchema);

module.exports = CommentStoryModel;
