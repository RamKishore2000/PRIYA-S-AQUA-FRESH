const testimonialService = require("../services/testimonial.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listTestimonials(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const testimonials = await testimonialService.listTestimonials({ includeInactive });
  return sendSuccess(res, 200, "Testimonials fetched successfully.", { testimonials });
}

async function getTestimonial(req, res) {
  const testimonial = await testimonialService.getTestimonial(req.params.id);
  return sendSuccess(res, 200, "Testimonial fetched successfully.", { testimonial });
}

async function createTestimonial(req, res) {
  const testimonial = await testimonialService.createTestimonial(req.body);
  return sendSuccess(res, 201, "Testimonial created successfully.", { testimonial });
}

async function updateTestimonial(req, res) {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  return sendSuccess(res, 200, "Testimonial updated successfully.", { testimonial });
}

async function updateTestimonialStatus(req, res) {
  const testimonial = await testimonialService.updateTestimonialStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Testimonial status updated successfully.", { testimonial });
}

async function deleteTestimonial(req, res) {
  await testimonialService.deleteTestimonial(req.params.id);
  return sendSuccess(res, 200, "Testimonial deleted successfully.");
}

module.exports = {
  listTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
};
