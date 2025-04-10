const express = require("express");
const router = express.Router();
const userConroller = require("../controllers/user.controller");

/* GET Users */
router.get("/", userConroller.getAllUser);

/* GET User */
router.get("/:id", userConroller.getOneUser);

/* GET User Profile */
router.get("/:id/profile", userConroller.getOneUserProfile);

/* GET User Notify */
router.get("/:id/notify", userConroller.getOneUserNotify);

/* GET User List */
router.get("/:id/list", userConroller.getOneUserList);

/* POST User */
router.post("/", userConroller.createUser);

/* UPDATE User */
router.patch("/:id", userConroller.updateUser);

/* UPDATE User Profile */
router.patch("/:id/profile", userConroller.updateUserProfile);

/* UPDATE User Notify */
router.patch("/:id/notify", userConroller.updateUserNotify);

/* UPDATE User List */
router.patch("/:id/list", userConroller.updateUserList);

/* DELETE User */
router.delete("/:id", userConroller.removeUser);

module.exports = router;
