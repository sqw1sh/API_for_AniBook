const express = require("express");
const router = express.Router();
const storyController = require("../controllers/story.controller");

/* GET */
router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getOneStory);

/* POST */
router.post("/", storyController.createStory);
router.post("/:id/chapter", storyController.addChapter);
router.post("/:id/rating", storyController.changeRating);

/* UPDATE */
router.patch("/:id", storyController.updateStory);
router.patch("/:id/chapter/:number", storyController.updateChapter);

/* DELETE */
router.delete("/:id", storyController.removeStory);
router.delete("/:id/chapter/:number", storyController.removeChapter);

module.exports = router;
