const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

/* GET */
router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getOneReview);
router.get("/like/:id", reviewController.likeReview);

/* UPDATE */
router.patch("/:id", reviewController.updateReview);

/* POST */
router.post("/", reviewController.createReview);

/* DELETE */
router.delete("/:id", reviewController.removeReview);

module.exports = router;
