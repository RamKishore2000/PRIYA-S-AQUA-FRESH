const express = require("express");
const reviewController = require("../controllers/review.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  reviewIdValidator,
  reviewListValidator,
  reviewPayloadValidator,
  reviewStatusValidator,
} = require("../validators/review.validator");

const router = express.Router();

router.get("/", reviewListValidator, validateRequest, asyncHandler(reviewController.listReviews));
router.post("/", requireAuth, requireRole("CUSTOMER", "DEALER"), reviewPayloadValidator, validateRequest, asyncHandler(reviewController.createReview));
router.get("/admin", requireAuth, requireRole("ADMIN"), reviewListValidator, validateRequest, asyncHandler(reviewController.listReviews));
router.patch("/:id/status", requireAuth, requireRole("ADMIN"), reviewIdValidator, reviewStatusValidator, validateRequest, asyncHandler(reviewController.updateReviewStatus));
router.delete("/:id", requireAuth, requireRole("ADMIN"), reviewIdValidator, validateRequest, asyncHandler(reviewController.deleteReview));

module.exports = router;
