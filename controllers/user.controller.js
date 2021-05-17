const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const userController = {};

userController.register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const order = await Order.create({});
    user = await User.create({ name, email, password });
    const completeUser = await User.findByIdAndUpdate(
      user._id,
      { order: order._id },
      { new: true }
    );
    await Order.findByIdAndUpdate(
      order._id,
      { userId: user._id },
      { new: true }
    );
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user: completeUser },
      null,
      "Created account"
    );
  } catch (error) {
    utilsHelper.sendResponse(res, 400, false, null, null, error.message);
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await await User.findOne({ _id: req.userId });

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user: currentUser },
      null,
      "Current User info!!"
    );
  } catch (error) {
    utilsHelper.sendResponse(res, 400, false, null, null, error.message);
  }
};

userController.getCurrentUserOrder = async (req, res, next) => {
  try {
    //pagination
    let { page, limit, sortBy, ...filter } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    const totalOrders = await Order.countDocuments({
      ...filter,
      isDeleted: false,
    });

    const totalPages = Math.ceil(totalOrders / limit);
    const offset = limit * (page - 1);
    //current user
    const currentUserId = req.userId;
    const currentUser = await User.findById(currentUserId);

    //target user
    const userId = req.params.id;

    // current user request other Order
    if (userId !== currentUserId && currentUser.role !== "admin") {
      return next(
        new Error("401- only admin able to check other user Order detail")
      );
    }
    // current user request its Order or Admin request user's order
    const order = await Order.find({ userId })
      .sort({ ...sortBy, createdAt: -1 })
      .skip(offset)
      .limit(limit);
    // in case no order
    if (!order) return next(new Error(`401- ${user} has no order`));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, page, totalPages },
      null,
      "get orders from userId success"
    );
  } catch (error) {
    next(error);
  }
};

userController.paymentUserOrder = async (req, res, next) => {
  try {
    //get request detail
    const orderId = req.params.id;
    const total = req.body.total;
    //find the order to pay , get balance
    const order = await Order.findById(orderId);
    const currentUser = await User.findById(req.userId);

    const funds = currentUser.balance;
    //check funds
    if (total > funds) {
      return next(new Error("403-Insufficient balance"));
    } else {
      //update new balance
      await User.findByIdAndUpdate(
        {
          _id: req.userId,
        },
        { balance: funds - total },
        { new: true }
      );
      //update new order
      await Order.findByIdAndUpdate(
        {
          _id: orderId,
        },
        { status: "paid", isDeleted: true },
        { new: true }
      );
      //create new order
      const newOrder = await Order.create({ userId: req.userId });
      //update current user with new order
      await User.findByIdAndUpdate(
        req.userId,
        { order: newOrder._id },
        { new: true }
      );
      utilsHelper.sendResponse(res, 200, true, null, null, "order paided");
    }
  } catch (error) {
    next(error);
  }
};

userController.topUpUser = async (req, res, next) => {
  try {
    let topUp = req.body.topup;

    //aquire user current balance
    const user = await User.findById(req.userId);
    //update user new balance

    await User.findByIdAndUpdate(
      {
        _id: req.userId,
      },
      { balance: parseInt(user.balance) + parseInt(topUp) },
      { new: true }
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      null,
      null,
      `Wallet increase by ${topUp}!!`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
