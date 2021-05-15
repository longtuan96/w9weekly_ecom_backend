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
router.post("/", loginRequired, orderController.createOrder);

/**
 * @route PUT api/orders/:id/update
 * @description User can update order
 * @access Login require
 */
router.put("/:id/update", loginRequired, orderController.updateOrder);

/**
 * @route GET api/orders/:id
 * @description User can see order detail
 * @access Login required
 */
router.get("/:id", loginRequired, orderController.getDetailOrder);

/**
 * @route GET api/orders
 * @description User can see order detail
 * @access Login required
 */
router.get("/", loginRequired, adminRequired, orderController.getAllOrders);

/**
 * @route POST api/orders/:id
 * @description Admin can delete order
 * @access Admin required
 */
router.delete(
  "/:id",
  loginRequired,
  adminRequired,
  orderController.deleteOrder
);
module.exports = router;
