const authService = require("../services/auth.service");

const signUp = async (req, res) => {
	const resObj = await authService.signUp(req.body);
	return res.json(resObj);
};

const signIn = async (req, res) => {};

module.exports = {
	signUp,
	signIn,
};
