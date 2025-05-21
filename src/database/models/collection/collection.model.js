const { Schema, default: mongoose } = require("mongoose");

const categorySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		stories: [mongoose.ObjectId],
	},
	{ _id: false }
);

const collectionSchema = new Schema(
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
			required: true,
		},
		category: [categorySchema],
	},
	{ timestamps: true }
);

const CollectionModel = mongoose.model("Collection", collectionSchema);

module.exports = CollectionModel;
