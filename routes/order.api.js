const express = require("express");
const {
  loginRequired,
  adminRequired,
} = require("../middlewares/authentication");
const router = express.Router();
const orderController = require("../controllers/order.controller");
/**
 * @route POST api/orders
 * @description User can create order
 * @access Login required
 */
// router.post("/", loginRequired, orderController.createOrder);

/**
 * @route PUT api/orders/:id/update
 * @description User can update order
 * @access Login require
 */
router.put("/:id/update", loginRequired, orderController.updateOrder);

/**
 * @route PUT api/orders/:orderId/:itemId
 * @description User can add item to order
 * @access Login require
 */
router.put("/:id", loginRequired, orderController.addItemToOrder);

/**
 * @route DELETE api/orders/:orderId/:itemId
 * @description User can delete item from order
 * @access Login require
 */
router.delete("/:id", loginRequired, orderController.DeleteItemFromOrder);

/**
 * @route GET api/orders/:id
 * @description User can see order detail
 * @access Login required
 */
router.get("/:id", loginRequired, orderController.getDetailOrder);

/**
 * @route GET api/orders/all
 * @description User can see order detail
 * @access Login required
 */
// router.get("/all", orderController.getAllOrders);
/**
 * @route GET api/orders/:id
 * @description User can see their order
 * @access Login required
 */
// router.get("/:id", loginRequired, orderController.getCurrentUserOrder);

// /**
//  * @route POST api/orders/:id
//  * @description Admin can delete order
//  * @access Admin required
//  */
// router.delete(
//   "/:id",
//   loginRequired,
//   adminRequired,
//   orderController.deleteOrder
// );
module.exports = router;
