const express = require("express");
const authController = require("../controllers/auth.controller");
const router = express.Router();

/**
 * @route POST api/auth/login
 * @description User can Login with email
 * @access Public
 */
router.post("/login", authController.loginWithEmail);
module.exports = router;
