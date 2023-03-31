const { User } = require("../models/index");
const jwt = require("jsonwebtoken");

exports.googleLogin = async (req, res, next) => {
  const { name, profilePic, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
        },
        `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: "24h",
        }
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ result: user });
    } else {
      const newUser = new User({
        name,
        profilePic,
        email,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        {
          email: savedUser.email,
          id: savedUser._id,
        },
        `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: "24h",
        }
      );

      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(201)
        .json({ result: savedUser });
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  res.clearCookie("access_token");
  res.send({ success: true });
};

exports.checkStatus = async (req, res, next) => {
  try {
    const currUser = await User.findById(req.userId);
    res.status(200).json(currUser);
  } catch (err) {
    next(err);
  }
};
