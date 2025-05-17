const { Schema, default: mongoose } = require("mongoose");

const genreSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
});

const GenreModel = mongoose.model("Genre", genreSchema);

module.exports = GenreModel;
