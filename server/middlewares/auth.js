const jwt = require("jsonwebtoken");
const { createError } = require("../error");

const auth = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.access_token;
    console.log(token);

    if (!token) {
      return next(createError(403, "User not authenticated!"));
    }

    const decodedData = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    req.userId = decodedData?.id;
    req.userEmail = decodedData?.email;
    next();
  } catch (err) {
    console.log(err);
    res.clearCookie("access_token");
    next(createError("400", err.message));
  }
};

module.exports = auth;
