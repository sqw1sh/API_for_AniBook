const express = require("express");
const router = express.Router();
const userConroller = require("../controllers/user.controller");

/* GET */
router.get("/", userConroller.getAllUsers);
router.get("/:id", userConroller.getOneUser);
router.get("/profile/:id", userConroller.getUserProfile);

/* UPDATE */
// router.patch("/:id", userConroller.updateUser);
// router.patch("/profile/:id", userConroller.updateUserProfile);
// router.patch("/notify/:id", userConroller.updateUserNotify);
// router.patch("/list/:id", userConroller.updateUserList);

module.exports = router;
