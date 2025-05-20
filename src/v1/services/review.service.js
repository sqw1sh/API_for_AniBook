const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const ReviewModel = require("../../database/models/review/review.model");
const ReviewLikeModel = require("../../database/models/review/reviewLike.model");
const UserModel = require("../../database/models/user/user.model");
const StoryModel = require("../../database/models/story/story.model");
const StoryRatingModel = require("../../database/models/story/storyRating.model");

/* GET */
const getAllReviews = async (page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const reviews = await ReviewModel.find({}).skip(offset).limit(max).exec();
	let resReviews = [];

	if (reviews && reviews.length > 0) {
		for (let i = 0; i < reviews.length; i++) {
			const user = await UserModel.findById(reviews[i].userId).exec();
			const story = await StoryModel.findById(reviews[i].storyId).exec();
			const storyScore = await StoryRatingModel.findOne({ userId: reviews[i].userId, storyId: reviews[i].storyId }).exec();

			if (user && story && storyScore) {
				resReviews.push({
					id: reviews[i]._id,
					title: reviews[i].title,
					user: {
						id: user._id,
						username: user.username,
						image: user.image,
					},
					story: {
						id: story._id,
						title: story.title,
						image: story.image,
						score: storyScore.score,
					},
				});
			} else {
				continue;
			}
		}
	}

	return {
		page: page,
		reviews: resReviews,
	};
};

const getOneReview = async (id) => {
	let response = {};

	const review = await ReviewModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (!review) {
		response.error = true;
		response.message = "Отзыв не найден";
	} else {
		const user = await UserModel.findById(review.userId).exec();
		const story = await StoryModel.findById(review.storyId).exec();
		const storyScore = await StoryRatingModel.findOne({ userId: review.userId, storyId: review.storyId }).exec();

		if (user && story && storyScore) {
			response = {
				id: review._id,
				title: review.title,
				text: review.text,
				user: {
					id: user._id,
					username: user.username,
					image: user.image,
				},
				story: {
					id: story._id,
					title: story.title,
					image: story.image,
					score: storyScore.score,
				},
			};
		} else {
			response.error = true;
			response.message = "Произошла ошибка поиска данных";
		}
	}

	return response;
};

const likeReview = async (token, id) => {
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

	const like = await ReviewLikeModel.findOne({ reviewId: id, userId: decodedTokenId }).exec();

	if (like) {
		await ReviewLikeModel.deleteOne({ _id: like._id });

		response.error = false;
		response.message = "Лайк отменен";
	} else {
		const newLike = new ReviewLikeModel({ reviewId: id, userId: decodedTokenId });
		await newLike.save();

		response.error = false;
		response.message = "Лайк поставлен";
	}

	return response;
};

/* UPDATE */
const updateReview = async (token, id, reqBody) => {
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

	const review = await ReviewModel.findById(id)
		.exec()
		.then((value) => {
			if (value.userId.toString() === decodedTokenId) {
				if (reqBody.title && value.title !== reqBody.title) {
					value.title = reqBody.title;
				}

				if (reqBody.text && value.text !== reqBody.text) {
					value.text = reqBody.text;
				}
			} else {
				response.error = true;
				response.message = "Вы не являетесь автором отзыва";
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

	if (review && !response.error) {
		await review.save();

		response.error = false;
		response.message = "Отзыв успешно обновлен";
	}

	if (!review && !response.error) {
		response.error = true;
		response.message = "Отзыв не найден";
	}

	return response;
};

/* POST */
const createReview = async (token, reqBody) => {
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

	if (reqBody.storyId) {
		const review = await ReviewModel.findOne({ storyId: reqBody.storyId })
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (review && !response.error) {
			response.error = true;
			response.message = "Вы уже создали отзыв на эту историю";
		}

		if (!review && !response.error) {
			const storyScore = await StoryRatingModel.findOne({ userId: decodedTokenId, storyId: reqBody.storyId }).exec();

			if (storyScore) {
				const newReview = new ReviewModel({});

				if (reqBody.title && reqBody.text) {
					newReview.userId = decodedTokenId;
					newReview.storyId = reqBody.storyId;
					newReview.title = reqBody.title;
					newReview.text = reqBody.text;

					await newReview.save();

					response.error = false;
					response.message = "Отзыв успешно создан";
				} else {
					response.error = true;
					response.message = "Необходимо заполнить все поля";
				}
			} else {
				response.error = true;
				response.message = "Сначала нужно поставить оценку истории";
			}
		}
	} else {
		response.error = true;
		response.message = "Необходимо заполнить все поля";
	}

	return response;
};

/* DELETE */
const removeReview = async (token, id) => {
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

	const review = await ReviewModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (review && !response.error) {
		if (review.userId.toString() === decodedTokenId) {
			await ReviewModel.deleteOne({ _id: review._id });

			response.error = false;
			response.message = "Отзыв успешно удален";
		} else {
			response.error = true;
			response.message = "Вы не являетесь автором отзыва";
		}
	} else {
		response.error = true;
		response.message = "Отзыв не найден";
	}

	return response;
};

module.exports = {
	getAllReviews,
	getOneReview,
	likeReview,
	updateReview,
	createReview,
	removeReview,
};
