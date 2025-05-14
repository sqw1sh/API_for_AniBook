const { Schema, default: mongoose } = require("mongoose");

const chapterSchema = new Schema(
	{
		number: {
			type: Number,
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
	{ _id: false }
);

const storySchema = new Schema(
	{
		userId: {
			type: mongoose.ObjectId,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		image: {
			type: String,
			default: "images/story/default.png",
		},
		ageLimit: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		chapters: {
			type: [chapterSchema],
			default: [],
		},
		genres: {
			type: [mongoose.ObjectId],
			default: [],
		},
		tags: {
			type: [mongoose.ObjectId],
			default: [],
		},
	},
	{
		timestamps: true,
	}
);

const StoryModel = mongoose.model("Story", storySchema);

module.exports = StoryModel;
