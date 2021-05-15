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

    user = await User.create({ name, email, password });

    utilsHelper.sendResponse(res, 200, true, { user }, null, "Created account");
  } catch (error) {
    utilsHelper.sendResponse(res, 400, false, null, null, error.message);
  }
};

userController.getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { currentUser },
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
    const currentUserId = req.userId;

    //find the order to pay , get balance
    const order = await Order.findById(orderId);
    const currentUser = await User.findById(currentUserId);
    const total = order.total;
    const funds = currentUser.balance;
    //check funds
    if (total > funds) {
      return next(new Error("403-Insufficient balance"));
    } else {
      //update new balance
      await User.findByIdAndUpdate(
        {
          _id: currentUserId,
        },
        { balance: funds - total },
        { new: true }
      );
      //update new order
      await Order.findByIdAndUpdate(
        {
          _id: orderId,
        },
        { status: "paid" },
        { new: true }
      );
      utilsHelper.sendResponse(
        res,
        200,
        true,
        { order, page, totalPages },
        null,
        "order paided"
      );
    }
  } catch (error) {
    next(error);
  }
};

userController.topUpUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { topUp } = req.body;

    //aquire user current balance
    const UserBalance = await User.findById(userId).balance;
    //update user new balance
    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      { balance: UserBalance + topUp },
      { new: true }
    );

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order, page, totalPages },
      null,
      `Wallet increase by ${topUp}!!`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
