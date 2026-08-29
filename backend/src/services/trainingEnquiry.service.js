const crypto = require("crypto");
const trainingRepository = require("../repositories/trainingEnquiry.repository");
const settingsRepository = require("../repositories/settings.repository");
const env = require("../config/env");
const { ApiError } = require("../utils/apiError");

function normalizePayload(payload = {}) {
  const fullName = String(payload.fullName || "").trim();
  const mobile = String(payload.mobile || "").trim();
  const city = String(payload.city || "").trim();
  const message = String(payload.message || "").trim();
  const actionType = payload.actionType === "PAYMENT" ? "PAYMENT" : "INTERESTED";
  const errors = {};

  if (!fullName) errors.fullName = "Name is required.";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Enter a valid 10 digit mobile number.";
  if (!city) errors.city = "City is required.";

  if (Object.keys(errors).length) {
    throw new ApiError(422, "Please fix the highlighted fields.", errors);
  }

  return { fullName, mobile, city, message, actionType };
}

async function getTrainingAmount() {
  const settings = await settingsRepository.getSiteSettings();
  return Math.max(1, Number(settings.trainingAmount || settingsRepository.defaultSiteSettings.trainingAmount));
}

async function createEnquiry(payload) {
  const normalized = normalizePayload(payload);
  const amount = normalized.actionType === "PAYMENT" ? await getTrainingAmount() : 0;
  return trainingRepository.createEnquiry({
    ...normalized,
    amount,
    paymentStatus: normalized.actionType === "PAYMENT" ? "PENDING" : "NOT_REQUIRED",
  });
}

async function listEnquiries() {
  return trainingRepository.findAll();
}

async function createRazorpayOrder(enquiryId) {
  const enquiry = await trainingRepository.findById(enquiryId);
  if (!enquiry) throw new ApiError(404, "Training enquiry not found.");
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw new ApiError(500, "Razorpay keys are not configured.");
  }

  const amount = enquiry.amount > 0 ? enquiry.amount : await getTrainingAmount();
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${env.razorpay.keyId}:${env.razorpay.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: enquiry.enquiryNumber,
      notes: {
        type: "RO_TRAINING",
        trainingEnquiryId: String(enquiry.id),
        enquiryNumber: enquiry.enquiryNumber,
        mobile: enquiry.mobile,
      },
    }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new ApiError(502, result.error?.description || "Unable to create Razorpay order.");
  }
  const updated = await trainingRepository.updateRazorpayOrder(enquiry.id, result.id);
  return { keyId: env.razorpay.keyId, razorpayOrder: result, enquiry: updated };
}

async function verifyRazorpayPayment(payload) {
  const enquiry = await trainingRepository.findById(payload.enquiryId);
  if (!enquiry) throw new ApiError(404, "Training enquiry not found.");

  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
    .digest("hex");

  if (expected !== payload.razorpaySignature) {
    throw new ApiError(422, "Payment verification failed.", { payment: "Payment verification failed." });
  }

  return trainingRepository.markPaid(enquiry.id, payload);
}

async function markPaymentFailed(enquiryId) {
  const enquiry = await trainingRepository.findById(enquiryId);
  if (!enquiry) throw new ApiError(404, "Training enquiry not found.");
  if (enquiry.paymentStatus !== "PENDING") return enquiry;
  return trainingRepository.markFailed(enquiry.id);
}

module.exports = {
  createEnquiry,
  listEnquiries,
  createRazorpayOrder,
  verifyRazorpayPayment,
  markPaymentFailed,
};