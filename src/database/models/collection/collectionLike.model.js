const { Schema, default: mongoose } = require("mongoose");

const collectionLikeSchema = new Schema({
	collectionId: {
		type: mongoose.ObjectId,
		required: true,
	},
	userId: {
		type: mongoose.ObjectId,
		required: true,
	},
});

const CollectionLikeModel = mongoose.model("CollectionLike", collectionLikeSchema);

module.exports = CollectionLikeModel;
