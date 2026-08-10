const dealerRepository = require("../repositories/dealer.repository");
const userRepository = require("../repositories/user.repository");
const { ApiError } = require("../utils/apiError");

async function listDealers() {
  return dealerRepository.findAll();
}

async function getDealer(id) {
  const dealer = await dealerRepository.findById(id);
  if (!dealer) throw new ApiError(404, "Dealer not found.");
  return dealer;
}

async function createDealer(payload) {
  await ensureUniqueDealer(payload);
  return dealerRepository.createDealer(normalizeDealerPayload(payload));
}

async function updateDealer(id, payload) {
  const current = await getDealer(id);
  await ensureUniqueDealer(payload, current);
  return dealerRepository.updateDealer(id, normalizeDealerPayload(payload));
}

async function updateDealerStatus(id, status) {
  await getDealer(id);
  return dealerRepository.updateStatus(id, status);
}

async function resetPassword(id, password) {
  await getDealer(id);
  await dealerRepository.resetPassword(id, password);
}

async function ensureUniqueDealer(payload, current = null) {
  const emailUser = await userRepository.findByEmail(payload.email.trim().toLowerCase());
  if (emailUser && String(emailUser.id) !== String(current?.userId)) {
    throw new ApiError(409, "Email is already registered.", { email: "Email is already registered." });
  }
  const mobileUser = await userRepository.findByMobile(payload.mobile.trim());
  if (mobileUser && String(mobileUser.id) !== String(current?.userId)) {
    throw new ApiError(409, "Mobile number is already registered.", { mobile: "Mobile number is already registered." });
  }
  const existingCode = await dealerRepository.findByDealerCode(payload.dealerCode.trim().toUpperCase());
  if (existingCode && String(existingCode.id) !== String(current?.id)) {
    throw new ApiError(409, "Dealer code already exists.", { dealerCode: "Dealer code already exists." });
  }
}

function normalizeDealerPayload(payload) {
  return {
    name: payload.name.trim().replace(/\s+/g, " "),
    businessName: payload.businessName.trim(),
    mobile: payload.mobile.trim(),
    email: payload.email.trim().toLowerCase(),
    dealerCode: payload.dealerCode.trim().toUpperCase(),
    gstNumber: payload.gstNumber.trim().toUpperCase(),
    address: payload.address.trim(),
    city: payload.city.trim(),
    state: payload.state.trim(),
    pincode: payload.pincode.trim(),
    password: payload.password,
    status: payload.status || "ACTIVE",
  };
}

module.exports = {
  listDealers,
  getDealer,
  createDealer,
  updateDealer,
  updateDealerStatus,
  resetPassword,
};
