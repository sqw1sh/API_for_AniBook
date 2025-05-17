const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");

/* GET */
router.get("/", tagController.getAllTags);

module.exports = router;
