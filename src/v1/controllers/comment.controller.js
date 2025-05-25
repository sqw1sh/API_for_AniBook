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

const likeComment = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.likeComment(token, id);
	return res.json(resObj);
};

/* UPDATE */
const updateComment = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.updateComment(token, id, req.body);
	return res.json(resObj);
};

/* POST */
const createCommentStory = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await commentService.createCommentStory(token, req.body);
	return res.json(resObj);
};

const createCommentReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await commentService.createCommentReview(token, req.body);
	return res.json(resObj);
};

const createCommentCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await commentService.createCommentCollection(token, req.body);
	return res.json(resObj);
};

/* DELETE */
const removeCommentStory = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.removeCommentStory(token, id, req.body);
	return res.json(resObj);
};

const removeCommentReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.removeCommentReview(token, id, req.body);
	return res.json(resObj);
};

const removeCommentCollection = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await commentService.removeCommentCollection(token, id, req.body);
	return res.json(resObj);
};

module.exports = {
	getAllCommentsStory,
	getAllCommentsReview,
	getAllCommentsCollection,
	likeComment,
	updateComment,
	createCommentStory,
	createCommentReview,
	createCommentCollection,
	removeCommentStory,
	removeCommentReview,
	removeCommentCollection,
};
