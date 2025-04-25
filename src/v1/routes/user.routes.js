const express = require("express");
const router = express.Router();
const userConroller = require("../controllers/user.controller");

/* GET */
router.get("/", userConroller.getAllUsers);
router.get("/:id", userConroller.getOneUser);
router.get("/profile/:id", userConroller.getUserProfile);

/* UPDATE */
router.patch("/profile/:id", userConroller.updateUserProfile);
router.patch("/profile/password/:id", userConroller.updateUserPassword);

module.exports = router;
