const User = require("../models/User");
const bcrypt = require("bcrypt");
const utilsHelper = require("../helpers/utils.helper");
const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({
      success: false,
      error: "Wrong email or password",
    });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({
      success: false,

      error: "Wrong email or password",
    });

  const accessToken = await user.generateToken();
  utilsHelper.sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login success"
  );
};
module.exports = authController;
