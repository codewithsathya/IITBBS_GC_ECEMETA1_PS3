const mongoose = require("mongoose");
const validator = require("validator");
const autopopulate = require("mongoose-autopopulate");

const meetingSchema = mongoose.Schema({
  title: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
  ],
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true,
    },
  ],
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    autopopulate: true,
  },
  code: {
    type: String,
  },
});

meetingSchema.plugin(autopopulate);

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
