const express = require("express");
const testimonialController = require("../controllers/testimonial.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  testimonialIdValidator,
  testimonialListValidator,
  testimonialPayloadValidator,
  testimonialStatusValidator,
} = require("../validators/testimonial.validator");

const router = express.Router();

router.get("/", testimonialListValidator, validateRequest, asyncHandler(testimonialController.listTestimonials));
router.get("/:id", testimonialIdValidator, validateRequest, asyncHandler(testimonialController.getTestimonial));
router.post("/", testimonialPayloadValidator, validateRequest, asyncHandler(testimonialController.createTestimonial));
router.put("/:id", testimonialIdValidator, testimonialPayloadValidator, validateRequest, asyncHandler(testimonialController.updateTestimonial));
router.patch("/:id/status", testimonialIdValidator, testimonialStatusValidator, validateRequest, asyncHandler(testimonialController.updateTestimonialStatus));
router.delete("/:id", testimonialIdValidator, validateRequest, asyncHandler(testimonialController.deleteTestimonial));

module.exports = router;
