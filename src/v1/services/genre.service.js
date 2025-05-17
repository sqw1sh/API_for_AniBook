const GenreModel = require("../../database/models/story/genre.model");

const getAllGenres = async () => {
	let response = {};

	const genres = await GenreModel.find({})
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (genres) {
		response = {
			genres: genres,
		};
	} else {
		response.error = true;
		response.message = "Жанры не найдены";
	}

	return response;
};

module.exports = {
	getAllGenres,
};
