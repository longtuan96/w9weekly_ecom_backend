const utilsHelper = require("../helpers/utils.helper");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { find } = require("../models/User");
const User = require("../models/User");

const orderController = {};
//create new order
// orderController.createOrder = async (req, res, next) => {
//   try {
//     const { products } = req.body;

//     // create Order that represent
//     const order = await Order.create({
//       userId: req.userId,
//       products,
//     });
//     await User.findByIdAndUpdate(
//       req.userId,
//       { order: order._id },
//       { new: true }
//     );
//     utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
//   } catch (error) {
//     next(error);
//   }
// };
//get all order
// orderController.getAllOrders = async (req, res, next) => {
//   try {
//     let { ...query } = req.query;
//     const orders = await Order.findOne({ ...query })
//       .populate("userId")
//       .populate("products");
//     utilsHelper.sendResponse(
//       res,
//       200,
//       true,
//       { orders },
//       null,
//       "get all orders success"
//     );
//   } catch (error) {
//     next(error);
//   }
// };
orderController.getCurrentUserOrder = async (req, res, next) => {
  try {
    let { ...query } = req.query;
    let userId = req.params.id;
    const order = await Order.findOne({ ...query, userId: userId })
      .populate("userId")
      .populate("products");
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "get current User Order success"
    );
  } catch (error) {
    next(error);
  }
};
//Get detail of an order by its ID
orderController.getDetailOrder = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId);
    const order = await Order.findById(req.params.id).populate("products");
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
//add new item to order
orderController.addItemToOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const itemId = req.body.product;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $push: { products: itemId } },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "product added");
  } catch (error) {
    next(error);
  }
};
orderController.DeleteItemFromOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const itemId = req.body.product;
    console.log("orderId", orderId, " itemId ", itemId);
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $pull: { products: itemId } },
      { new: true }
    );
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "product deleted"
    );
  } catch (error) {
    next(error);
  }
};

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
