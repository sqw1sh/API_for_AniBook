const userService = require("../services/user.service");

const getAllUser = async (req, res) => {
	let offset = 0;

	if (req.query.page && !isNaN(parseInt(req.query.page))) {
		const page = parseInt(req.query.page);

		if (page > 0) {
			offset = page === 1 ? 0 : (page - 1) * 10;
		}
	}

	let resObj = await userService.getAllUser(offset);
	return res.json(resObj);
};

const getOneUser = async (req, res) => {
	let resObj;

	if (req.params.id) {
		resObj = await userService.getOneUser(req.params.id);
	}

	return res.json(resObj);
};

const getOneUserProfile = (req, res) => {
	res.send("get one user profile");
};

const getOneUserNotify = (req, res) => {
	res.send("get one user notify");
};

const getOneUserList = (req, res) => {
	res.send("get one user list");
};

const createUser = async (req, res) => {
	const resObj = await userService.createUser(req.body);
	return res.json(resObj);
};

const updateUser = (req, res) => {
	res.send("Update one user");
};

const updateUserProfile = (req, res) => {
	res.send("Update one user profile");
};

const updateUserNotify = (req, res) => {
	res.send("Update one user notify");
};

const updateUserList = (req, res) => {
	res.send("Update one user list");
};

const removeUser = (req, res) => {
	res.send("Remove one user");
};

module.exports = {
	getAllUser,
	getOneUser,
	getOneUserProfile,
	getOneUserNotify,
	getOneUserList,
	createUser,
	updateUser,
	updateUserProfile,
	updateUserNotify,
	updateUserList,
	removeUser,
};
