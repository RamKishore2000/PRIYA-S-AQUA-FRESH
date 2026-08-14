const reviewRepository = require("../repositories/review.repository");
const { ApiError } = require("../utils/apiError");

async function listReviews(options) {
  return reviewRepository.findAll(options);
}

async function getReview(id) {
  const review = await reviewRepository.findById(id);
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }
  return review;
}

async function createReview(user, payload) {
  if (!["CUSTOMER", "DEALER"].includes(user.role)) {
    throw new ApiError(403, "Only customers and dealers can add reviews.");
  }

  return reviewRepository.createReview({
    userId: user.id,
    customerName: user.fullName,
    role: user.role,
    rating: Number(payload.rating),
    message: String(payload.message || "").trim(),
  });
}

async function updateReviewStatus(id, status) {
  await getReview(id);
  return reviewRepository.updateStatus(id, status);
}

async function deleteReview(id) {
  await getReview(id);
  await reviewRepository.deleteReview(id);
}

module.exports = {
  listReviews,
  getReview,
  createReview,
  updateReviewStatus,
  deleteReview,
};
