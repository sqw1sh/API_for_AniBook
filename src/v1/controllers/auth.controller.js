const authService = require("../services/auth.service");

const signUp = async (req, res) => {
	const resObj = await authService.signUp(req.body);
	return res.json(resObj);
};

const signIn = async (req, res) => {
	const resObj = await authService.signIn(req.body);
	return res.json(resObj);
};

const logout = async (req, res) => {
	const token = req.get("Authorization");

	if (!token) {
		return res.status(401).json({ error: true, message: "Необходимо авторизоваться" });
	}

	const resObj = await authService.logout(token);
	return res.json(resObj);
};

module.exports = {
	signUp,
	signIn,
	logout,
};
