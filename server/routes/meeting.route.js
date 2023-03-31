const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const { meetingController } = require("../controllers/index");

router.post("/", auth, meetingController.createMeeting);

module.exports = router;
