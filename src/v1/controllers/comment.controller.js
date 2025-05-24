const commentService = require("../services/comment.service");

/* GET */
const getAllCommentsStory = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.getAllCommentsStory(id, page);
	return res.json(resObj);
};

const getAllCommentsReview = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.getAllCommentsReview(id, page);
	return res.json(resObj);
};

const getAllCommentsCollection = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.getAllCommentsCollection(id, page);
	return res.json(resObj);
};

/* POST */
const createCommentStory = async (req, res) => {};

const createCommentReview = async (req, res) => {};

const createCommentCollection = async (req, res) => {};

module.exports = {
	getAllCommentsStory,
	getAllCommentsReview,
	getAllCommentsCollection,
	createCommentStory,
	createCommentReview,
	createCommentCollection,
};
