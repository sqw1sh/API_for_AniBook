const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const UserModel = require("../../database/models/user/user.model");

const signUp = async (reqBody) => {
	let response;

	if (reqBody && reqBody.username && reqBody.email && reqBody.password) {
		const checkLogin = await UserModel.findOne({ username: reqBody.username }).exec();

		if (!checkLogin) {
			const checkEmail = await UserModel.findOne({ email: reqBody.email }).exec();

			if (!checkEmail) {
				const newUser = new UserModel({ username: reqBody.username, email: reqBody.email });
				newUser.setPassword(reqBody.password);

				const token = jwt.sign(
					{
						id: newUser._id,
						email: reqBody.email,
					},
					JWT_SECRET,
					{ expiresIn: "30d" }
				);

				newUser.refreshToken = token;
				await newUser.save();

				response = {
					id: newUser._id,
					username: newUser.username,
					email: newUser.email,
					image: newUser.image,
					about: newUser.about,
					refreshToken: newUser.refreshToken,
					socials: newUser.socials,
					notify: newUser.notify,
				};
			} else {
				response = {
					error: true,
					message: "Пользователь с такой почтой уже существует",
				};
			}
		} else {
			response = {
				error: true,
				message: "Пользователь с таким логином уже существует",
			};
		}
	} else {
		response = {
			error: true,
			message: "Необходимо заполнить все поля",
		};
	}

	return response;
};

const signIn = async () => {};

module.exports = {
	signUp,
	signIn,
};
