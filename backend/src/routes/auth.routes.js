const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth");
const { loginValidator, logoutValidator, refreshValidator, registerValidator } = require("../validators/auth.validator");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, asyncHandler(authController.register));
router.post("/login", loginValidator, validateRequest, asyncHandler(authController.login));
router.post("/refresh", refreshValidator, validateRequest, asyncHandler(authController.refresh));
router.post("/logout", logoutValidator, validateRequest, asyncHandler(authController.logout));
router.get("/me", requireAuth, asyncHandler(authController.me));

module.exports = router;
