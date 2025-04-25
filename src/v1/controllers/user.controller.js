const userService = require("../services/user.service");

/* GET */
const getAllUsers = async (req, res) => {
	let page = 1;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const queryPage = parseInt(req.query.page);

		if (queryPage > 1) {
			page = queryPage;
		}
	}

	const resObj = await userService.getAllUsers(page);
	return res.json(resObj);
};

const getOneUser = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const resObj = await userService.getOneUser(id);
	return res.json(resObj);
};

const getUserProfile = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const token = req.get("Authorization");

	if (!token) {
		return res.sendStatus(401);
	}

	const resObj = await userService.getUserProfile(token, id);
	return res.json(resObj);
};

/* UPDATE */
const updateUserProfile = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const token = req.get("Authorization");

	if (!token) {
		return res.sendStatus(401);
	}

	const resObj = await userService.updateUserProfile(token, id, req.body);
	return res.json(resObj);
};

const updateUserPassword = async (req, res) => {
	let id = "";

	if (req.params.id && req.params.id.length > 0) {
		id = req.params.id;
	}

	const token = req.get("Authorization");

	if (!token) {
		return res.sendStatus(401);
	}

	const resObj = await userService.updateUserPassword(token, id, req.body);
	return res.json(resObj);
};

module.exports = {
	getAllUsers,
	getOneUser,
	getUserProfile,
	updateUserProfile,
	updateUserPassword,
};
