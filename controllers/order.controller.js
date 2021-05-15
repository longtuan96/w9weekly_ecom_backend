const utilsHelper = require("../helpers/utils.helper");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { find } = require("../models/User");
const User = require("../models/User");

const orderController = {};
//create new order
orderController.createOrder = async (req, res, next) => {
  try {
    const { products } = req.body;

    // create Order that represent
    const order = await Order.create({
      userId: req.userId,
      products,
    });

    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};
//get all order
orderController.getAllOrders = async (req, res, next) => {
  try {
    let { ...query } = req.query;
    const orders = await Order.find({ ...query }).populate("userId");
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { orders },
      null,
      "get all orders success"
    );
  } catch (error) {
    next(error);
  }
};
//Get detail of an order by its ID
orderController.getDetailOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const currentUser = await User.findById(req.userId);
    const order = await Order.findById(orderId);
    if (!order) return next(new Error("401- Order not found"));
    if (order.userId != req.userId || currentUser.role != "admin")
      return next(new Error("401- you are not allow to see this order "));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "get detail order success"
    );
  } catch (error) {
    next(error);
  }
};
//Update Order
orderController.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { products } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { products },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order updated");
  } catch (error) {
    next(error);
  }
};
//

//delete order
orderController.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
      },
      { isDeleted: true },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, nul, null, "order deleted!!");
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;
