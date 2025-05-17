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

/* POST */
const createStory = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await storyService.createStory(token, req.body);
	return res.json(resObj);
};

const addChapter = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await storyService.addChapter(token, id, req.body);
	return res.json(resObj);
};

const changeRating = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await storyService.changeRating(token, id, req.body);
	return res.json(resObj);
};

/* UPDATE */
const updateStory = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await storyService.updateStory(token, id, req.body);
	return res.json(resObj);
};

const updateChapter = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	let number = 0;

	if (req.params.number && !isNaN(parseInt(req.params.number))) {
		number = parseInt(req.params.number);
	}

	if (number <= 0) {
		return res.status(400).json({ error: true, message: "Укажите номер главы" });
	}

	const resObj = await storyService.updateChapter(token, id, number, req.body);
	return res.json(resObj);
};

/* DELETE */
const removeStory = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await storyService.removeStory(token, id);
	return res.json(resObj);
};

const removeChapter = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	let number = 0;

	if (req.params.number && !isNaN(parseInt(req.params.number))) {
		number = parseInt(req.params.number);
	}

	if (number <= 0) {
		return res.status(400).json({ error: true, message: "Укажите номер главы" });
	}

	const resObj = await storyService.removeChapter(token, id, number);
	return res.json(resObj);
};

module.exports = {
	getAllStories,
	getOneStory,
	createStory,
	addChapter,
	changeRating,
	updateStory,
	updateChapter,
	removeStory,
	removeChapter,
};
