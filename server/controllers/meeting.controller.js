const { Meeting } = require("../models/index");

exports.createMeeting = async (req, res, next) => {
  const { title } = req.body;
  try {
    let code = (Math.random() + 1).toString(36).substring(7);
    let newMeeting = new Meeting({
      title,
      code,
      moderator: req.userId,
      members: [req.userId],
    });

    newMeeting = await newMeeting.save();

    res.status(200).json(newMeeting);
  } catch (err) {
    next(err);
  }
};
