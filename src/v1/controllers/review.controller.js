const reviewService = require("../services/review.service");

/* GET */
const getAllReviews = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	const resObj = await reviewService.getAllReviews(page);
	return res.json(resObj);
};

const getOneReview = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await reviewService.getOneReview(id);
	return res.json(resObj);
};

const likeReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await reviewService.likeReview(token, id, req.body);
	return res.json(resObj);
};

/* UPDATE */
const updateReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await reviewService.updateReview(token, id, req.body);
	return res.json(resObj);
};

/* POST */
const createReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await reviewService.createReview(token, req.body);
	return res.json(resObj);
};

/* DELETE */
const removeReview = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await reviewService.removeReview(token, id);
	return res.json(resObj);
};

module.exports = {
	getAllReviews,
	getOneReview,
	likeReview,
	updateReview,
	createReview,
	removeReview,
};
