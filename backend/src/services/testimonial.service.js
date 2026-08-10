const testimonialRepository = require("../repositories/testimonial.repository");
const { ApiError } = require("../utils/apiError");

async function listTestimonials({ includeInactive = false } = {}) {
  return testimonialRepository.findAll({ includeInactive });
}

async function getTestimonial(id) {
  const testimonial = await testimonialRepository.findById(id);
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found.");
  }
  return testimonial;
}

async function createTestimonial(payload) {
  return testimonialRepository.createTestimonial(normalizeTestimonialPayload(payload));
}

async function updateTestimonial(id, payload) {
  const current = await getTestimonial(id);
  return testimonialRepository.updateTestimonial(id, normalizeTestimonialPayload(payload, current));
}

async function updateTestimonialStatus(id, status) {
  await getTestimonial(id);
  return testimonialRepository.updateStatus(id, status);
}

async function deleteTestimonial(id) {
  await getTestimonial(id);
  await testimonialRepository.deleteTestimonial(id);
}

function normalizeTestimonialPayload(payload, current = {}) {
  return {
    customerName: String(payload.customerName || "").trim(),
    role: payload.role ? String(payload.role).trim() : null,
    rating: Number(payload.rating ?? current.rating ?? 5),
    message: String(payload.message || "").trim(),
    imageUrl: payload.imageUrl ? String(payload.imageUrl).trim() : null,
    sortOrder: Number(payload.sortOrder ?? current.sortOrder ?? 0),
    status: payload.status || current.status || "ACTIVE",
  };
}

module.exports = {
  listTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
};
