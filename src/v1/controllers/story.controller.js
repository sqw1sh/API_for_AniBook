const storyService = require("../services/story.service");

/* GET */
const getAllStories = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	const resObj = await storyService.getAllStories(page);
	return res.json(resObj);
};

const getOneStory = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await storyService.getOneStory(id);
	return res.json(resObj);
};

module.exports = {
	getAllStories,
	getOneStory,
};
