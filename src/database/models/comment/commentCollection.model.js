const { Schema, default: mongoose } = require("mongoose");

const commentCollectionSchema = new Schema({
	collectionId: {
		type: mongoose.ObjectId,
		required: true,
	},
	commentId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const CommentCollectionModel = mongoose.model("CommentCollection", commentCollectionSchema);

module.exports = CommentCollectionModel;
