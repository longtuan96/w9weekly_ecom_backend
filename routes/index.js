const express = require("express");
const router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

// productApi
const productApi = require("./product.api");
router.use("/products", productApi);
//orderApi
const orderApi = require("./order.api");
router.use("/orders", orderApi);
module.exports = router;
