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

const getUserProfile = async (token, id) => {
	let response = {};
	let decodedId;

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded && "id" in decoded) {
			decodedId = decoded.id;
		}
	});

	if (decodedId) {
		if (decodedId === id) {
			const user = await UserModel.findById(decodedId)
				.exec()
				.then((value) => {
					response = {
						id: value._id,
						username: value.username,
						email: value.email,
						image: value.image,
						about: value.about,
						refreshToken: value.refreshToken,
						socials: value.socials,
						notify: value.notify,
					};
				})
				.catch(() => {
					response.error = true;
					response.message = "Пользователь с таким идентификатором не найден";
				});
		} else {
			response.error = true;
			response.message = "Пользователь с таким идентификатором не найден";
		}
	} else {
		response.error = true;
		response.message = "Токен не действителен";
	}

	return response;
};

/* UPDATE */
const updateUserProfile = async (token, id, reqBody) => {
	let response = {};
	let decodedId;

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded && "id" in decoded) {
			decodedId = decoded.id;
		}
	});

	if (decodedId) {
		if (decodedId === id) {
			let updateObject = {};

			await UserModel.findById(decodedId)
				.exec()
				.then((value) => {
					if (reqBody.username && value.username !== reqBody.username) {
						updateObject.username = reqBody.username;
					}

					if (reqBody.email && value.email !== reqBody.email) {
						updateObject.email = reqBody.email;
					}

					if (reqBody.image && value.image !== reqBody.image) {
						updateObject.image = reqBody.image;
					}

					if (reqBody.about && value.about !== reqBody.about) {
						updateObject.about = reqBody.about;
					}

					if (reqBody.socials) {
						updateObject.socials = {};

						if (reqBody.socials.vkId && value.socials.vkId !== reqBody.socials.vkId) {
							updateObject.socials.vkId = reqBody.socials.vkId;
						} else {
							updateObject.socials.vkId = value.socials.vkId;
						}

						if (reqBody.socials.tgId && value.socials.tgId !== reqBody.socials.tgId) {
							updateObject.socials.tgId = reqBody.socials.tgId;
						} else {
							updateObject.socials.tgId = value.socials.tgId;
						}

						if (reqBody.socials.shikiId && value.socials.shikiId !== reqBody.socials.shikiId) {
							updateObject.socials.shikiId = reqBody.socials.shikiId;
						} else {
							updateObject.socials.shikiId = value.socials.shikiId;
						}
					}

					if (reqBody.notify) {
						updateObject.notify = {};

						if (reqBody.notify.notifyUpdate && value.notify.notifyUpdate !== reqBody.notify.notifyUpdate) {
							updateObject.notify.notifyUpdate = reqBody.notify.notifyUpdate;
						} else {
							updateObject.notify.notifyUpdate = value.notify.notifyUpdate;
						}

						if (reqBody.notify.notifySubscribe && value.notify.notifySubscribe !== reqBody.notify.notifySubscribe) {
							updateObject.notify.notifySubscribe = reqBody.notify.notifySubscribe;
						} else {
							updateObject.notify.notifySubscribe = value.notify.notifySubscribe;
						}

						if (reqBody.notify.notifyComment && value.notify.notifyComment !== reqBody.notify.notifyComment) {
							updateObject.notify.notifyComment = reqBody.notify.notifyComment;
						} else {
							updateObject.notify.notifyComment = value.notify.notifyComment;
						}
					}
				})
				.catch(() => {
					response.error = true;
					response.message = "Пользователь с таким идентификатором не найден";
				});

			if (Object.keys(updateObject).length > 0) {
				await UserModel.updateOne({ _id: decodedId }, updateObject)
					.then(() => {
						response.error = false;
						response.message = "Изменения сохранены";
					})
					.catch((err) => {
						console.log(err.message);

						response.error = true;
						response.message = "Ошибка сохранения";
					});
			} else {
				response.error = false;
				response.message = "Данные не изменились";
			}
		} else {
			response.error = true;
			response.message = "Пользователь с таким идентификатором не найден";
		}
	} else {
		response.error = true;
		response.message = "Токен не действителен";
	}

	return response;
};

const updateUserPassword = async (token, id, reqBody) => {
	let response = {};
	let decodedId;

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (decoded && "id" in decoded) {
			decodedId = decoded.id;
		}
	});

	if (decodedId) {
		if (decodedId === id) {
			let updateObject = {};

			await UserModel.findById(decodedId)
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
				})
				.catch(() => {
					response.error = true;
					response.message = "Пользователь с таким идентификатором не найден";
				});

			if (Object.keys(updateObject).length > 0) {
				await UserModel.updateOne({ _id: decodedId }, updateObject)
					.then(() => {
						response.error = false;
						response.message = "Изменения сохранены";
					})
					.catch((err) => {
						console.log(err.message);

						response.error = true;
						response.message = "Ошибка сохранения";
					});
			}
		} else {
			response.error = true;
			response.message = "Пользователь с таким идентификатором не найден";
		}
	} else {
		response.error = true;
		response.message = "Токен не действителен";
	}

	return response;
};

module.exports = {
	getAllUsers,
	getOneUser,
	getUserProfile,
	updateUserProfile,
	updateUserPassword,
};
