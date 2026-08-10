const express = require("express");
const contactController = require("../controllers/contact.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const { contactPayloadValidator } = require("../validators/contact.validator");

const router = express.Router();

router.get("/", asyncHandler(contactController.listContactMessages));
router.post("/", contactPayloadValidator, validateRequest, asyncHandler(contactController.createContactMessage));

module.exports = router;
