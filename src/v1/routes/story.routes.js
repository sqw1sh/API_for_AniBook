const express = require("express");
const router = express.Router();
const storyController = require("../controllers/story.controller");

/* GET */
router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getOneStory);

/* POST */
router.post("/", storyController.createStory);
router.post("/:id/chapter", storyController.addChapter);

/* UPDATE */
router.patch("/:id", storyController.updateStory);
// router.patch("/:id/chapter/:number", storyController.addChapter);

module.exports = router;
