const express = require("express");
const router = express.Router();
const commentService = require("../controllers/comment.controller");

/* GET */
router.get("/story", commentService.getAllCommentsStory);
router.get("/review", commentService.getAllCommentsReview);
router.get("/collection", commentService.getAllCommentsCollection);
router.get("/like/:id", commentService.likeComment);

/* UPDATE */
router.patch("/:id", commentService.updateComment);

/* POST */
router.post("/story", commentService.createCommentStory);
router.post("/review", commentService.createCommentReview);
router.post("/collection", commentService.createCommentCollection);

/* DELETE */
router.delete("/story/:id", commentService.removeCommentStory);
router.delete("/review/:id", commentService.removeCommentReview);
router.delete("/collection/:id", commentService.removeCommentCollection);

module.exports = router;
