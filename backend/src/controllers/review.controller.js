const reviewService = require("../services/review.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listReviews(req, res) {
  const includeHidden = req.user?.role === "ADMIN" && req.query.includeHidden === "true";
  const reviews = await reviewService.listReviews({
    includeHidden,
    limit: req.query.limit,
  });
  return sendSuccess(res, 200, "Reviews fetched successfully.", { reviews });
}

async function createReview(req, res) {
  const review = await reviewService.createReview(req.user, req.body);
  return sendSuccess(res, 201, "Review added successfully.", { review });
}

async function updateReviewStatus(req, res) {
  const review = await reviewService.updateReviewStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Review status updated successfully.", { review });
}

async function deleteReview(req, res) {
  await reviewService.deleteReview(req.params.id);
  return sendSuccess(res, 200, "Review deleted successfully.");
}

module.exports = {
  listReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
};
