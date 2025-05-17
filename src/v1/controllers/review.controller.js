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

module.exports = {
	getAllReviews,
};
