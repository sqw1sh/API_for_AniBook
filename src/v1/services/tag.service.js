const TagModel = require("../../database/models/tag/tag.model");

const getAllTags = async () => {
	let response = {};

	const tags = await TagModel.find({})
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (tags) {
		response = {
			tags: tags,
		};
	} else {
		response.error = true;
		response.message = "Теги не найдены";
	}

	return response;
};

module.exports = {
	getAllTags,
};
