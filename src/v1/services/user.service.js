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
	let response;

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
			response = {
				error: true,
				message: "Пользователь с таким идентификатором не найден",
			};
		});

	return response;
};

const getUserProfile = async (token, id) => {
	let response;
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
					response = {
						error: true,
						message: "Пользователь с таким идентификатором не найден",
					};
				});
		} else {
			response = {
				error: true,
				message: "Пользователь с таким идентификатором не найден",
			};
		}
	} else {
		response = {
			error: true,
			message: "Токен не действителен",
		};
	}

	return response;
};

module.exports = {
	getAllUsers,
	getOneUser,
	getUserProfile,
};
