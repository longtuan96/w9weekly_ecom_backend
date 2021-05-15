const express = require("express");
const productController = require("../controllers/product.controller");
const {
  loginRequired,
  adminRequired,
} = require("../middlewares/authentication");
const router = express.Router();

//
/**
 * @route GET api/products?page=1&limit=10
 * @description User can see list of all products
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route GET api/products/:id
 * @description get single product
 * @access public
 */
router.get("/:id", productController.getSingleProduct);

/**
 * @route POST api/products/add
 * @description Admin can add product
 * @access Admin Required
 */
router.post("/add", loginRequired, adminRequired, productController.addProduct);
/**
 * @route PUT api/products/:id/update
 * @description Admin can update product
 * @access Admin required
 */
router.put(
  "/:id/update",
  loginRequired,
  adminRequired,
  productController.updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @description delete single product
 * @access Admin required
 */
router.delete(
  "/:id",
  loginRequired,
  adminRequired,
  productController.deleteProduct
);
module.exports = router;
