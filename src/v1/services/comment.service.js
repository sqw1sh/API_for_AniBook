const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");
const CommentModel = require("../../database/models/comment/comment.model");
const CommentLikeModel = require("../../database/models/comment/commentLike.model");
const CommentStoryModel = require("../../database/models/comment/commentStory.model");
const CommentReviewModel = require("../../database/models/comment/commentReview.model");
const CommentCollectionModel = require("../../database/models/comment/commentCollection.model");

/* GET */
const getAllCommentsStory = async (id, page = 1, max = 10) => {};

const getAllCommentsReview = async (id, page = 1, max = 10) => {};

const getAllCommentsCollection = async (id, page = 1, max = 10) => {};

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
