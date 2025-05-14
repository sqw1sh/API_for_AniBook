const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const StoryModel = require("../../database/models/story/story.model");

/* GET */
const getAllStories = async (page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const stories = await StoryModel.find({}).skip(offset).limit(max).exec();

	return {
		page: page,
		stories: Array.isArray(stories)
			? stories.map((story) => {
					return {
						id: story._id,
						title: story.title,
						description: story.description,
						image: story.image,
						createdAt: story.createdAt,
						updatedAt: story.updatedAt,
					};
			  })
			: [],
	};
};

const getOneStory = async (id) => {
	let response = {};

	const story = await StoryModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!story) {
		response.error = true;
		response.message = "История не найдена";
	} else {
		response = {
			id: story._id,
			title: story.title,
			description: story.description,
			ageLimit: story.ageLimit,
			type: story.type,
			image: story.image,
			chapters: story.chapters,
			genres: story.genres,
			tags: story.tags,
			createdAt: story.createdAt,
			updatedAt: story.updatedAt,
		};
	}

	return response;
};

/* POST */
const createStory = async (token, reqBody) => {
	let response = {};
	let decodedTokenId = "";

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			response.error = true;
			response.message = "Токен не действителен";
		}

		if (decoded && "id" in decoded) {
			decodedTokenId = decoded.id;
		}
	});

	if (response.error) {
		return response;
	}

	const newStory = new StoryModel({});

	if (reqBody.title && reqBody.ageLimit && reqBody.type) {
		newStory.userId = decodedTokenId;
		newStory.title = reqBody.title;
		newStory.ageLimit = reqBody.ageLimit;
		newStory.type = reqBody.type;

		if (reqBody.description) {
			newStory.description = reqBody.description;
		}

		if (reqBody.image) {
			newStory.image = reqBody.image;
		}

		if (reqBody.genres) {
			newStory.genres = reqBody.genres;
		}

		if (reqBody.tags) {
			newStory.tags = reqBody.tags;
		}

		await newStory.save();

		response.error = false;
		response.message = "История успешно создана";
	} else {
		response.error = true;
		response.message = "Необходимо заполнить все обязательные поля";
	}

	return response;
};

const addChapter = async (token, id, reqBody) => {
	let response = {};
	let decodedTokenId = "";

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			response.error = true;
			response.message = "Токен не действителен";
		}

		if (decoded && "id" in decoded) {
			decodedTokenId = decoded.id;
		}
	});

	if (response.error) {
		return response;
	}

	const story = await StoryModel.findById(id)
		.exec()
		.then((value) => {
			if (value.userId.toString() === decodedTokenId) {
				if (reqBody.title && reqBody.text) {
					const number = value.chapters.length + 1;

					value.chapters.push({
						number: number,
						title: reqBody.title,
						text: reqBody.text,
					});

					response.error = false;
					response.message = "Глава успешно добавлена";
				} else {
					response.error = false;
					response.message = "Все обязательные поля должны быть заполнены";
				}
			} else {
				response.error = true;
				response.message = "Вы не являетесь автором истории";
			}

			return value;
		})
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!story) {
		response.error = true;
		response.message = "История не найдена";
	} else {
		await story.save();
	}

	return response;
};

/* UPDATE */
const updateStory = async (token, id, reqBody) => {
	let response = {};
	let decodedTokenId = "";

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			response.error = true;
			response.message = "Токен не действителен";
		}

		if (decoded && "id" in decoded) {
			decodedTokenId = decoded.id;
		}
	});

	if (response.error) {
		return response;
	}

	const story = await StoryModel.findById(id)
		.exec()
		.then((value) => {
			if (value.userId.toString() === decodedTokenId) {
				if (reqBody.title && reqBody.title !== value.title) {
					value.title = reqBody.title;
				}

				if (reqBody.description && reqBody.description !== value.description) {
					value.description = reqBody.description;
				}

				if (reqBody.image && reqBody.image !== value.image) {
					value.image = reqBody.image;
				}

				if (reqBody.ageLimit && reqBody.ageLimit !== value.ageLimit) {
					value.ageLimit = reqBody.ageLimit;
				}

				if (reqBody.type && reqBody.type !== value.type) {
					value.type = reqBody.type;
				}

				if (reqBody.genres && reqBody.genres !== value.genres) {
					value.genres = reqBody.genres;
				}

				if (reqBody.tags && reqBody.tags !== value.tags) {
					value.tags = reqBody.tags;
				}

				response.error = false;
				response.message = "История успешно обновлена";
			} else {
				response.error = true;
				response.message = "Вы не являетесь автором истории";
			}

			return value;
		})
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!story) {
		response.error = true;
		response.message = "История не найдена";
	} else {
		await story.save();
	}

	return response;
};

module.exports = {
	getAllStories,
	getOneStory,
	createStory,
	addChapter,
	updateStory,
};
