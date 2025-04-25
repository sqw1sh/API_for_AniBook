const UserModel = require("../../database/models/user/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

/* GET */
const getAllUsers = async (page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const users = await UserModel.find({}).skip(offset).limit(max).exec();

	return {
		page: page,
		users: Array.isArray(users)
			? users.map((user) => {
					return {
						id: user._id,
						username: user.username,
						image: user.image,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					};
			  })
			: [],
	};
};

const getOneUser = async (id) => {
	let response = {};

	const user = await UserModel.findById(id)
		.exec()
		.then((value) => {
			response = {
				id: value._id,
				username: value.username,
				image: value.image,
				createdAt: value.createdAt,
				updatedAt: value.updatedAt,
			};
		})
		.catch(() => {
			response.error = true;
			response.message = "Пользователь с таким идентификатором не найден";
		});

	return response;
};

/* UPDATE */
const updateUserProfile = async (token, reqBody) => {
	let response = {};
	let decodedTokenId = "";

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
			if (reqBody.username && value.username !== reqBody.username) {
				value.username = reqBody.username;
				response.username = value.username;
			}

			if (reqBody.email && value.email !== reqBody.email) {
				value.email = reqBody.email;
				response.email = value.email;
			}

			if (reqBody.image && value.image !== reqBody.image) {
				value.image = reqBody.image;
				response.image = value.image;
			}

			if (reqBody.about && value.about !== reqBody.about) {
				value.about = reqBody.about;
				response.about = value.about;
			}

			if (reqBody.socials) {
				response.socials = {};

				if (reqBody.socials.vkId && value.socials.vkId !== reqBody.socials.vkId) {
					value.socials.vkId = reqBody.socials.vkId;
					response.socials.vkId = value.socials.vkId;
				}

				if (reqBody.socials.tgId && value.socials.tgId !== reqBody.socials.tgId) {
					value.socials.tgId = reqBody.socials.tgId;
					response.socials.tgId = value.socials.tgId;
				}

				if (reqBody.socials.shikiId && value.socials.shikiId !== reqBody.socials.shikiId) {
					value.socials.shikiId = reqBody.socials.shikiId;
					response.socials.shikiId = value.socials.shikiId;
				}
			}

			if (reqBody.notify) {
				response.notify = {};

				if (reqBody.notify.notifyUpdate && value.notify.notifyUpdate !== reqBody.notify.notifyUpdate) {
					value.notify.notifyUpdate = reqBody.notify.notifyUpdate;
					response.notify.notifyUpdate = value.notify.notifyUpdate;
				}

				if (reqBody.notify.notifySubscribe && value.notify.notifySubscribe !== reqBody.notify.notifySubscribe) {
					value.notify.notifySubscribe = reqBody.notify.notifySubscribe;
					response.notify.notifySubscribe = value.notify.notifySubscribe;
				}

				if (reqBody.notify.notifyComment && value.notify.notifyComment !== reqBody.notify.notifyComment) {
					value.notify.notifyComment = reqBody.notify.notifyComment;
					response.notify.notifyComment = value.notify.notifyComment;
				}
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
		response.message = "Пользователь не авторизован";
	}

	if (!response.error) {
		await user.save();
	}

	return response;
};

const updateUserPassword = async (token, reqBody) => {
	let response = {};
	let updateObject = {};
	let decodedTokenId;

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
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
			if (reqBody.oldPassword && reqBody.newPassword) {
				if (value.checkPassword(reqBody.oldPassword)) {
					value.setPassword(reqBody.newPassword);
					updateObject.passwordHash = value.passwordHash;
				} else {
					response.error = true;
					response.message = "Неправильный пароль";
				}
			} else {
				response.error = false;
				response.message = "Данные не изменились";
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
		response.message = "Пользователь не авторизован";
	}

	if (response.error) {
		return response;
	}

	if (Object.keys(updateObject).length > 0) {
		await UserModel.updateOne({ _id: decodedTokenId }, updateObject)
			.then(() => {
				response.error = false;
				response.message = "Изменения сохранены";
			})
			.catch(() => {
				response.error = true;
				response.message = "Ошибка сохранения";
			});
	}

	return response;
};

module.exports = {
	getAllUsers,
	getOneUser,
	updateUserProfile,
	updateUserPassword,
};
