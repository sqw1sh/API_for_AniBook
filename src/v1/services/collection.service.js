const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const CollectionModel = require("../../database/models/collection/collection.model");
const CollectionLikeModel = require("../../database/models/collection/collectionLike.model");
const UserModel = require("../../database/models/user/user.model");
const StoryModel = require("../../database/models/story/story.model");

/* GET */
const getAllCollections = async (page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const collections = await CollectionModel.find({}).skip(offset).limit(max).exec();
	const resArr = [];

	if (collections && collections.length > 0) {
		for (let i = 0; i < collections.length; i++) {
			const user = await UserModel.findById(collections[i].userId).exec();

			if (user) {
				resArr.push({
					id: collections[i]._id,
					title: collections[i].title,
					description: collections[i].description,
					user: {
						id: user._id,
						username: user.username,
						image: user.image,
					},
				});
			} else {
				continue;
			}
		}
	}

	return {
		page: page,
		collections: resArr,
	};
};

const getOneCollection = async (id) => {
	let response = {};

	const collection = await CollectionModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!collection) {
		response.error = true;
		response.message = "Коллекция не найдена";
	} else {
		const user = await UserModel.findById(collection.userId).exec();

		if (user) {
			const categoryArr = [];

			for (let i = 0; i < collection.category.length; i++) {
				const categoryStories = [];

				for (let j = 0; j < collection.category[i].stories.length; j++) {
					const story = await StoryModel.findById(collection.category[i].stories[j]).exec();

					categoryStories.push({
						id: story._id,
						title: story.title,
						image: story.image,
					});
				}

				categoryArr.push({
					title: collection.category[i].title,
					stories: categoryStories,
				});
			}

			response = {
				id: collection._id,
				title: collection.title,
				description: collection.description,
				category: categoryArr,
				user: {
					id: user._id,
					username: user.username,
					image: user.image,
				},
			};
		} else {
			response.error = true;
			response.message = "Произошла ошибка поиска данных";
		}
	}

	return response;
};

const likeCollection = async (token, id) => {
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

	const collection = await CollectionModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (collection) {
		const like = await CollectionLikeModel.findOne({ collectionId: id, userId: decodedTokenId })
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (like) {
			await CollectionLikeModel.deleteOne({ _id: like._id });

			response.error = false;
			response.message = "Лайк отменен";
		} else {
			const newLike = new CollectionLikeModel({ collectionId: id, userId: decodedTokenId });
			await newLike.save();

			response.error = false;
			response.message = "Лайк поставлен";
		}
	} else {
		response.error = true;
		response.message = "Коллекция не найдена";
	}

	return response;
};

/* UPDATE */
const updateCollection = async (token, id, reqBody) => {
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

	const collection = await CollectionModel.findById(id)
		.exec()
		.then((value) => {
			if (value.userId.toString() === decodedTokenId) {
				if (reqBody.title && value.title !== reqBody.title) {
					value.title = reqBody.title;
				}

				if (reqBody.description && value.description !== reqBody.description) {
					value.description = reqBody.description;
				}

				if (reqBody.category && value.category !== reqBody.category) {
					value.category = reqBody.category;
				}
			} else {
				response.error = true;
				response.message = "Вы не являетесь автором коллекции";
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

	if (collection && !response.error) {
		await collection.save();

		response.error = false;
		response.message = "Коллекция успешно обновлена";
	}

	if (!collection && !response.error) {
		response.error = true;
		response.message = "Коллекция не найдена";
	}

	return response;
};

/* POST */
const createCollection = async (token, reqBody) => {
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

	const newCollection = new CollectionModel({});

	if (reqBody.title && reqBody.description && reqBody.category && reqBody.category.length > 0) {
		newCollection.userId = decodedTokenId;
		newCollection.title = reqBody.title;
		newCollection.description = reqBody.description;

		for (let i = 0; i < reqBody.category.length; i++) {
			if (reqBody.category[i].title && reqBody.category[i].stories && reqBody.category[i].stories.length > 0) {
				continue;
			} else {
				response.error = true;
				response.message = "Необходимо создать и заполнить категории";
			}
		}

		if (!response.error) {
			newCollection.category = reqBody.category;

			await newCollection.save();

			response.error = false;
			response.message = "Коллекция успешно создана";
		}
	} else {
		response.error = true;
		response.message = "Необходимо заполнить все поля";
	}

	return response;
};

/* DELETE */
const removeCollection = async (token, id) => {
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

	const collection = await CollectionModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (collection && !response.error) {
		if (collection.userId.toString() === decodedTokenId) {
			await CollectionModel.deleteOne({ _id: collection._id });

			response.error = false;
			response.message = "Коллекция успешно удалена";
		} else {
			response.error = true;
			response.message = "Вы не являетесь автором коллекции";
		}
	} else {
		response.error = true;
		response.message = "Коллекция не найдена";
	}

	return response;
};

module.exports = {
	getAllCollections,
	getOneCollection,
	likeCollection,
	updateCollection,
	createCollection,
	removeCollection,
};
