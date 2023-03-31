const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const { authController } = require("../controllers/index");

router.post("/googleLogin", authController.googleLogin);
router.post("/logout", authController.logout);
router.get("/status", auth, authController.checkStatus);

module.exports = router;
