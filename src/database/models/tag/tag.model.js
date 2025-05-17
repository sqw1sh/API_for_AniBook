const { Schema, default: mongoose } = require("mongoose");

const tagSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
});

const TagModel = mongoose.model("Tag", tagSchema);

module.exports = TagModel;
