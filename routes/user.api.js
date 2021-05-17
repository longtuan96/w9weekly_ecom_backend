const express = require("express");
const userController = require("../controllers/user.controller");
const {
  loginRequired,
  adminRequired,
} = require("../middlewares/authentication");
const router = express.Router();

/**
 * @route POST api/users/
 * @description User can register account
 * @access Public
 * @required package {}
 */
router.post("/", userController.register);
/**
 * @route GET api/users/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", loginRequired, userController.getCurrentUser);
/**
 * @route GET api/users/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */
router.get("/:id/order", loginRequired, userController.getCurrentUserOrder);
/**
 * @route Put api/users/:id/payment
 * @description User can make payment
 * @access Login required
 */
router.put("/:id/payment", loginRequired, userController.paymentUserOrder);
/**
 * @route PUT api/users/:id/topup
 * @description Top-up user balance
 * @access Login required
 */
router.put("/topup", loginRequired, userController.topUpUser);
module.exports = router;
