const getAllUser = (req, res) => {
	res.send("get all users");
};

const getOneUser = (req, res) => {
	res.send("get one user");
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

const createUser = (req, res) => {
	res.send("Create new user");
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
