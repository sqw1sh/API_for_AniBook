const jwt = require("jsonwebtoken");
const config = require("../../config");
const UserModel = require("../../database/models/user/user.model");
const UserListModel = require("../../database/models/user/userList.model");

const signUp = async (reqBody) => {
	let response = {};

	if (reqBody && reqBody.username && reqBody.email && reqBody.password) {
		const checkLogin = await UserModel.findOne({ username: reqBody.username })
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (!checkLogin) {
			const checkEmail = await UserModel.findOne({ email: reqBody.email })
				.exec()
				.catch((err) => {
					response.error = true;
					response.message = "Внутренняя ошибка сервера";

					if (err.message) {
						response.message = err.message;
					}
				});

			if (!checkEmail) {
				const newUser = new UserModel({ username: reqBody.username, email: reqBody.email });
				newUser.setPassword(reqBody.password);

				const token = jwt.sign(
					{
						id: newUser._id,
						email: newUser.email,
					},
					config.JWT_SECRET,
					{ expiresIn: "30d" }
				);

				newUser.refreshToken = token;
				await newUser.save();

				const newUserList = new UserListModel({
					userId: newUser._id,
					lists: Object.values(config.userList).map((item) => {
						return {
							list: item,
							stories: [],
						};
					}),
				});

				await newUserList.save();

				response.id = newUser._id;
				response.username = newUser.username;
				response.email = newUser.email;
				response.image = newUser.image;
				response.about = newUser.about;
				response.refreshToken = newUser.refreshToken;
				response.socials = newUser.socials;
				response.notify = newUser.notify;
				response.lists = newUserList.lists;
			} else {
				response.error = true;
				response.message = "Пользователь с такой почтой уже существует";
			}
		} else {
			response.error = true;
			response.message = "Пользователь с таким логином уже существует";
		}
	} else {
		response.error = true;
		response.message = "Необходимо заполнить все поля";
	}

	return response;
};

const signIn = async (reqBody) => {
	let response = {};

	if (reqBody.email && reqBody.password) {
		const user = await UserModel.findOne({ email: reqBody.email })
			.exec()
			.then((value) => {
				if (value.checkPassword(reqBody.password)) {
					const token = jwt.sign(
						{
							id: value._id,
							email: value.email,
						},
						config.JWT_SECRET,
						{ expiresIn: "30d" }
					);

					value.refreshToken = token;
				} else {
					response.error = true;
					response.message = "Неверный пароль";
				}

				return value;
			})
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (!user) {
			response.error = true;
			response.message = "Пользователь с такой электронной почтой не найден";
		}

		if (!response.error) {
			await user.save();

			const userList = await UserListModel.findOne({ userId: user._id })
				.exec()
				.catch((err) => {
					response.error = true;
					response.message = "Внутренняя ошибка сервера";

					if (err.message) {
						response.message = err.message;
					}
				});

			if (userList && !response.error) {
				response.id = user._id;
				response.username = user.username;
				response.email = user.email;
				response.image = user.image;
				response.about = user.about;
				response.refreshToken = user.refreshToken;
				response.socials = user.socials;
				response.notify = user.notify;
				response.userList = userList.lists;
			}
		}
	} else {
		response.error = true;
		response.message = "Необходимо заполнить все поля";
	}

	return response;
};

const logout = async (token) => {
	let response = {};
	let decodedTokenId = "";

	jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
		if (err) {
			response.error = true;
			response.message = "Токен не действителен";
		}

		if (decoded && "id" in decoded) {
			decodedTokenId = decoded.id;
		}
	});

	if (response.error) {
		return response;
	}

	const user = await UserModel.findOne({ _id: decodedTokenId, refreshToken: token })
		.exec()
		.then((value) => {
			value.refreshToken = null;
			return value;
		})
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!user) {
		response.error = true;
		response.message = "Пользователь не авторизован";
	}

	if (!response.error) {
		await user.save();

		response.error = false;
		response.message = "Пользователь разлогинен";
	}

	return response;
};

module.exports = {
	signUp,
	signIn,
	logout,
};
