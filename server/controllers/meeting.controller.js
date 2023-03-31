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

exports.addMembers = async (req, res, next) => {
  let { newMembers } = req.body;
  const { meetingId } = req.params;
  newMembers = newMembers.ids;
  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      {
        $push: {
          members: newMembers,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedMeeting);
  } catch (err) {
    next(err);
  }
};
