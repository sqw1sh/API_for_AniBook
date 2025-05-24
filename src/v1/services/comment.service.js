const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const CommentModel = require("../../database/models/comment/comment.model");
const CommentLikeModel = require("../../database/models/comment/commentLike.model");
const CommentStoryModel = require("../../database/models/comment/commentStory.model");
const CommentReviewModel = require("../../database/models/comment/commentReview.model");
const CommentCollectionModel = require("../../database/models/comment/commentCollection.model");
const StoryModel = require("../../database/models/story/story.model");
const CollectionModel = require("../../database/models/collection/collection.model");
const ReviewModel = require("../../database/models/review/review.model");
const UserModel = require("../../database/models/user/user.model");

/* GET */
const getAllCommentsStory = async (id, page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
	}

	const story = await StoryModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	const commentArr = [];

	if (story) {
		const comments = await CommentStoryModel.find({ storyId: story._id }).skip(offset).limit(max).exec();

		if (comments && comments.length > 0) {
			for (let i = 0; i < comments.length; i++) {
				const comment = await CommentModel.findById(comments[i].commentId).exec();

				if (comment) {
					const user = await UserModel.findById(comment.userId).exec();

					if (user) {
						commentArr.push({
							id: comment._id,
							text: comment.text,
							user: {
								id: user._id,
								username: user.username,
								image: user.image,
							},
							createdAt: comment.createdAt,
							updatedAt: comment.updatedAt,
						});
					} else {
						continue;
					}
				} else {
					continue;
				}
			}
		}
	}

	return {
		page: page,
		comments: commentArr,
	};
};

const getAllCommentsReview = async (id, page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
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

	const commentArr = [];

	if (review) {
		const comments = await CommentReviewModel.find({ reviewId: review._id }).skip(offset).limit(max).exec();

		if (comments && comments.length > 0) {
			for (let i = 0; i < comments.length; i++) {
				const comment = await CommentModel.findById(comments[i].commentId).exec();

				if (comment) {
					const user = await UserModel.findById(comment.userId).exec();

					if (user) {
						commentArr.push({
							id: comment._id,
							text: comment.text,
							user: {
								id: user._id,
								username: user.username,
								image: user.image,
							},
							createdAt: comment.createdAt,
							updatedAt: comment.updatedAt,
						});
					} else {
						continue;
					}
				} else {
					continue;
				}
			}
		}
	}

	return {
		page: page,
		comments: commentArr,
	};
};

const getAllCommentsCollection = async (id, page = 1, max = 10) => {
	let offset = 0;

	if (page > 1) {
		offset = (page - 1) * 10;
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

	const commentArr = [];

	if (collection) {
		const comments = await CommentCollectionModel.find({ collectionId: collection._id }).skip(offset).limit(max).exec();

		if (comments && comments.length > 0) {
			for (let i = 0; i < comments.length; i++) {
				const comment = await CommentModel.findById(comments[i].commentId).exec();

				if (comment) {
					const user = await UserModel.findById(comment.userId).exec();

					if (user) {
						commentArr.push({
							id: comment._id,
							text: comment.text,
							user: {
								id: user._id,
								username: user.username,
								image: user.image,
							},
							createdAt: comment.createdAt,
							updatedAt: comment.updatedAt,
						});
					} else {
						continue;
					}
				} else {
					continue;
				}
			}
		}
	}

	return {
		page: page,
		comments: commentArr,
	};
};

/* POST */
const createCommentStory = async (token, id, reqBody) => {};

const createCommentReview = async (token, id, reqBody) => {};

const createCommentCollection = async (token, id, reqBody) => {};

module.exports = {
	getAllCommentsStory,
	getAllCommentsReview,
	getAllCommentsCollection,
	createCommentStory,
	createCommentReview,
	createCommentCollection,
};
