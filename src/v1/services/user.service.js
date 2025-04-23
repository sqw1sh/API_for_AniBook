const UserModel = require("../../database/models/user/user.model");
const UserListModel = require("../../database/models/user/userList.model");
const UserNotifyModel = require("../../database/models/user/userNotify.model");
const UserProfileModel = require("../../database/models/user/userProfile.model");
const UserSubscribeModel = require("../../database/models/user/userSubscribe.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");

const getAllUser = async (offset = 0, max = 10) => {
	let users = await UserModel.find({}).skip(offset).limit(max).exec();

	if (Array.isArray(users)) {
		for (let i = 0; i < users.length; i++) {
			const query = await UserProfileModel.findOne({ userId: users[i]._id }).exec();
			users[i].avatar = query.avatar;
		}

		users = users.map((user) => {
			return {
				id: user._id,
				login: user.login,
				avatar: user.avatar,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			};
		});
	} else {
		users = [];
	}

	const response = {
		page: offset === 0 ? 1 : offset / 10 + 1,
		users: users,
	};

	return response;
};

const getOneUser = async (id) => {
	const user = await UserModel.findById(id).exec();
	const userProfile = await UserProfileModel.findOne({ userId: id }).exec();

	if (user && userProfile) {
		return {
			id: user._id,
			login: user.login,
			avatar: userProfile.avatar,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	} else {
		return {
			error: true,
			message: "Пользователь с таким идентификатором не найден",
		};
	}
};

const getOneUserProfile = () => {
	return;
};

const getOneUserNotify = () => {
	return;
};

const getOneUserList = () => {
	return;
};

const createUser = async (reqBody) => {
	let response;

	if (reqBody.login && reqBody.email && reqBody.password) {
		const checkLogin = await UserModel.findOne({ login: reqBody.login }).exec();

		if (!checkLogin) {
			const checkEmail = await UserModel.findOne({ email: reqBody.email }).exec();

			if (!checkEmail) {
				const token = jwt.sign(
					{
						login: reqBody.login,
						email: reqBody.email,
					},
					JWT_SECRET,
					{ expiresIn: "30d" }
				);

				const newUser = new UserModel({ login: reqBody.login, email: reqBody.email, refreshToken: token });
				newUser.setPassword(reqBody.password);
				newUser.save();

				const newUserProfile = new UserProfileModel({
					userId: newUser._id,
					avatar: "images/avatar/default.png",
					description: "",
					vkId: "",
					tgId: "",
					shikiId: "",
				});
				newUserProfile.save();

				const newUserNotify = new UserNotifyModel({ userId: newUser._id, notifyUpdated: true, notifySubscription: true, notifyComment: true });
				newUserNotify.save();

				response = {
					error: false,
					message: "Пользователь успешно создан",
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

const updateUser = () => {
	return;
};

const updateUserProfile = () => {
	return;
};

const updateUserNotify = () => {
	return;
};

const updateUserList = () => {
	return;
};

const removeUser = () => {
	return;
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
