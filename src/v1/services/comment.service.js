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

	let commentArr = [];

	if (story) {
		const comments = await CommentStoryModel.find({ storyId: story._id }).skip(offset).limit(max).exec();
		commentArr = await forComment(comments);
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

	let commentArr = [];

	if (review) {
		const comments = await CommentReviewModel.find({ reviewId: review._id }).skip(offset).limit(max).exec();
		commentArr = await forComment(comments);
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

	let commentArr = [];

	if (collection) {
		const comments = await CommentCollectionModel.find({ collectionId: collection._id }).skip(offset).limit(max).exec();
		commentArr = await forComment(comments);
	}

	return {
		page: page,
		comments: commentArr,
	};
};

const likeComment = async (token, id) => {
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

	const comment = await CommentModel.findById(id)
		.exec()
		.catch((err) => {
			response.error = true;
			response.message = "Внутренняя ошибка сервера";

			if (err.message) {
				response.message = err.message;
			}
		});

	if (comment) {
		const like = await CommentLikeModel.findOne({ commentId: id, userId: decodedTokenId })
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (like) {
			await CommentLikeModel.deleteOne({ _id: like._id });

			response.error = false;
			response.message = "Лайк отменен";
		} else {
			const newLike = new CommentLikeModel({ commentId: id, userId: decodedTokenId });
			await newLike.save();

			response.error = false;
			response.message = "Лайк добавлен";
		}
	} else {
		response.error = true;
		response.message = "Комментарий не найден";
	}

	return response;
};

/* UPDATE */
const updateComment = async (token, id, reqBody) => {
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

	const comment = await CommentModel.findById(id)
		.exec()
		.then((value) => {
			if (value.userId.toString() === decodedTokenId) {
				if (reqBody.text && value.text !== reqBody.text) {
					value.text = reqBody.text;
				}
			} else {
				response.error = true;
				response.message = "Вы не являетесь автором комментария";
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

	if (comment) {
		await comment.save();

		response.error = false;
		response.message = "Комментарий успешно обновлен";
	} else {
		response.error = true;
		response.message = "Комментарий не найден";
	}

	return response;
};

/* POST */
const createCommentStory = async (token, reqBody) => {
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
		const story = await StoryModel.findById(reqBody.storyId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (story) {
			if (reqBody.text) {
				const newComment = new CommentModel({ userId: decodedTokenId, text: reqBody.text });
				await newComment.save();

				const newCommentStory = new CommentStoryModel({ storyId: story._id, commentId: newComment._id });
				await newCommentStory.save();

				response.error = false;
				response.message = "Комментарий успешно добавлен";
			} else {
				response.error = true;
				response.message = "Необходимо ввести текст";
			}
		} else {
			response.error = true;
			response.message = "История не найдена";
		}
	} else {
		response.error = true;
		response.message = "Необходимо ввести данные";
	}

	return response;
};

const createCommentReview = async (token, reqBody) => {
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

	if (reqBody.reviewId) {
		const review = await ReviewModel.findById(reqBody.reviewId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (review) {
			if (reqBody.text) {
				const newComment = new CommentModel({ userId: decodedTokenId, text: reqBody.text });
				await newComment.save();

				const newCommentReview = new CommentReviewModel({ reviewId: review._id, commentId: newComment._id });
				await newCommentReview.save();

				response.error = false;
				response.message = "Комментарий успешно добавлен";
			} else {
				response.error = true;
				response.message = "Необходимо ввести текст";
			}
		} else {
			response.error = true;
			response.message = "Отзыв не найдена";
		}
	} else {
		response.error = true;
		response.message = "Необходимо ввести данные";
	}

	return response;
};

const createCommentCollection = async (token, reqBody) => {
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

	if (reqBody.collectionId) {
		const collection = await CollectionModel.findById(reqBody.collectionId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (collection) {
			if (reqBody.text) {
				const newComment = new CommentModel({ userId: decodedTokenId, text: reqBody.text });
				await newComment.save();

				const newCommentCollection = new CommentCollectionModel({ collectionId: collection._id, commentId: newComment._id });
				await newCommentCollection.save();

				response.error = false;
				response.message = "Комментарий успешно добавлен";
			} else {
				response.error = true;
				response.message = "Необходимо ввести текст";
			}
		} else {
			response.error = true;
			response.message = "Коллекция не найдена";
		}
	} else {
		response.error = true;
		response.message = "Необходимо ввести данные";
	}

	return response;
};

/* DELETE */
const removeCommentStory = async (token, id, reqBody) => {
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
		const story = await StoryModel.findById(reqBody.storyId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (story) {
			const comment = await CommentModel.findById(id).exec();
			const commentStory = await CommentStoryModel.findOne({ storyId: story._id, commentId: id }).exec();

			if (comment && commentStory && comment.userId.toString() === decodedTokenId) {
				await CommentModel.deleteOne({ _id: comment._id });
				await CommentStoryModel.deleteOne({ _id: commentStory._id });

				response.error = false;
				response.message = "Комментарий успешно удален";
			} else {
				response.error = true;
				response.message = "Комментарий не найден или вы не являетесь автором комментария";
			}
		} else {
			response.error = true;
			response.message = "История не найдена";
		}
	} else {
		response.error = true;
		response.message = "Необходемо ввести данные";
	}

	return response;
};

const removeCommentReview = async (token, id, reqBody) => {
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

	if (reqBody.reviewId) {
		const review = await StoryModel.findById(reqBody.reviewId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (review) {
			const comment = await CommentModel.findById(id).exec();
			const commentReview = await CommentReviewModel.findOne({ reviewId: review._id, commentId: id }).exec();

			if (comment && commentReview && comment.userId.toString() === decodedTokenId) {
				await CommentModel.deleteOne({ _id: comment._id });
				await CommentReviewModel.deleteOne({ _id: commentReview._id });

				response.error = false;
				response.message = "Комментарий успешно удален";
			} else {
				response.error = true;
				response.message = "Комментарий не найден или вы не являетесь автором комментария";
			}
		} else {
			response.error = true;
			response.message = "Отзыв не найден";
		}
	} else {
		response.error = true;
		response.message = "Необходемо ввести данные";
	}

	return response;
};

const removeCommentCollection = async (token, id, reqBody) => {
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

	if (reqBody.collectionId) {
		const collection = await StoryModel.findById(reqBody.collectionId)
			.exec()
			.catch((err) => {
				response.error = true;
				response.message = "Внутренняя ошибка сервера";

				if (err.message) {
					response.message = err.message;
				}
			});

		if (collection) {
			const comment = await CommentModel.findById(id).exec();
			const commentCollection = await CommentCollectionModel.findOne({ collectionId: collection._id, commentId: id }).exec();

			if (comment && commentCollection && comment.userId.toString() === decodedTokenId) {
				await CommentModel.deleteOne({ _id: comment._id });
				await CommentCollectionModel.deleteOne({ _id: commentCollection._id });

				response.error = false;
				response.message = "Комментарий успешно удален";
			} else {
				response.error = true;
				response.message = "Комментарий не найден или вы не являетесь автором комментария";
			}
		} else {
			response.error = true;
			response.message = "Коллекция не найдена";
		}
	} else {
		response.error = true;
		response.message = "Необходемо ввести данные";
	}

	return response;
};

async function forComment(comments) {
	const commentArr = [];

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

	return commentArr;
}

module.exports = {
	getAllCommentsStory,
	getAllCommentsReview,
	getAllCommentsCollection,
	likeComment,
	updateComment,
	createCommentStory,
	createCommentReview,
	createCommentCollection,
	removeCommentStory,
	removeCommentReview,
	removeCommentCollection,
};
