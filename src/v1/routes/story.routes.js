const express = require("express");
const router = express.Router();
const storyController = require("../controllers/story.controller");

/* GET */
router.get("/", storyController.getAllStories);
router.get("/:id", storyController.getOneStory);

module.exports = router;
