const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/* GET */
router.get("/signin", authController.signIn);
router.get("/logout", authController.logout);

/* POST */
router.post("/signup", authController.signUp);

module.exports = router;
