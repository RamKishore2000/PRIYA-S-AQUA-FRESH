const express = require("express");
const authController = require("../controllers/auth.controller");
const { registerValidator } = require("../validators/auth.validator");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, authController.register);

module.exports = router;
