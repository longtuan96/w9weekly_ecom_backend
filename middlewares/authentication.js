const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginRequired = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString)
      return res.status(401).json({
        success: false,

        error: "Token not found",
      });

    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,

            error: "Token expired.",
          });
        } else {
          return res.status(401).json({
            success: false,

            error: "Token is invalid",
          });
        }
      }

      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    const isAdmin = currentUser.role === "admin";

    if (!isAdmin) return next(new Error("401- Admin required"));
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      emailVerificationCode: req.params.token,
    });
    if (!user) {
      throw new Error(`cant find the user with token ${req.params.token}`);
    }
    await User.findByIdAndUpdate(
      user._id,
      { emailVerified: true },
      { new: true }
    );
    res
      .status(200)
      .json({ status: "success", message: "verify email completed" });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
module.exports = { loginRequired, verifyEmail, adminRequired };
