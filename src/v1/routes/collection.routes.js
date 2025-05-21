const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collection.controller");

/* GET */
router.get("/", collectionController.getAllCollections);
router.get("/:id", collectionController.getOneCollection);
router.get("/like/:id", collectionController.likeCollection);

/* UPDATE */
router.patch("/:id", collectionController.updateCollection);

/* POST */
router.post("/", collectionController.createCollection);

/* DELETE */
router.delete("/:id", collectionController.removeCollection);

module.exports = router;
