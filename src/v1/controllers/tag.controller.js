const tagService = require("../services/tag.service");

const getAllTags = async (req, res) => {
	const resObj = await tagService.getAllTags();
	return res.json(resObj);
};

module.exports = {
	getAllTags,
};
