const express = require("express");
const router = express.Router();
const userConroller = require("../controllers/user.controller");

/* GET */
router.get("/", userConroller.getAllUsers);
router.get("/:id", userConroller.getOneUser);
router.get("/subscribe/:id", userConroller.subscribe);

/* UPDATE */
router.patch("/profile", userConroller.updateUserProfile);
router.patch("/profile/password", userConroller.updateUserPassword);
/* router.patch("/list", userConroller); */

module.exports = router;
