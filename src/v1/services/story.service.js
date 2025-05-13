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

module.exports = {
	getAllStories,
	getOneStory,
};
