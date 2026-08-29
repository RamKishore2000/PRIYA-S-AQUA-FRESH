const trainingService = require("../services/trainingEnquiry.service");
const { sendSuccess } = require("../utils/apiResponse");

async function createEnquiry(req, res) {
  const enquiry = await trainingService.createEnquiry(req.body);
  return sendSuccess(res, 201, "Training enquiry saved successfully.", { enquiry });
}

async function listEnquiries(_req, res) {
  const enquiries = await trainingService.listEnquiries();
  return sendSuccess(res, 200, "Training enquiries fetched successfully.", { enquiries });
}

async function createRazorpayOrder(req, res) {
  const data = await trainingService.createRazorpayOrder(req.body.enquiryId);
  return sendSuccess(res, 200, "Training payment order created successfully.", data);
}

async function verifyRazorpayPayment(req, res) {
  const enquiry = await trainingService.verifyRazorpayPayment(req.body);
  return sendSuccess(res, 200, "Training payment verified successfully.", { enquiry });
}

async function markPaymentFailed(req, res) {
  const enquiry = await trainingService.markPaymentFailed(req.params.id);
  return sendSuccess(res, 200, "Training payment marked as failed.", { enquiry });
}

module.exports = {
  createEnquiry,
  listEnquiries,
  createRazorpayOrder,
  verifyRazorpayPayment,
  markPaymentFailed,
};