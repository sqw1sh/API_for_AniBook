const express = require("express");
const router = express.Router();
const commentService = require("../controllers/comment.controller");

/* GET */
router.get("/story", commentService.getAllCommentsStory);
router.get("/review", commentService.getAllCommentsReview);
router.get("/collection", commentService.getAllCommentsCollection);

/* POST */
router.post("/story", commentService.createCommentStory);
router.post("/review", commentService.createCommentReview);
router.post("/collection", commentService.createCommentCollection);

module.exports = router;
