const dealerRepository = require("../repositories/dealer.repository");
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

async function ensureUniqueDealer(payload, current = null) {
  const email = payload.email.trim().toLowerCase();
  const mobile = payload.mobile.trim();
  const dealerCode = payload.dealerCode.trim().toUpperCase();

  const emailDealer = await dealerRepository.findByEmail(email);
  if (emailDealer && String(emailDealer.id) !== String(current?.id)) {
    throw new ApiError(409, "Dealer email is already registered.", { email: "Dealer email is already registered." });
  }

  const mobileDealer = await dealerRepository.findByMobile(mobile);
  if (mobileDealer && String(mobileDealer.id) !== String(current?.id)) {
    throw new ApiError(409, "Dealer mobile number is already registered.", { mobile: "Dealer mobile number is already registered." });
  }

  const existingCode = await dealerRepository.findByDealerCode(dealerCode);
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
    gstNumber: payload.gstNumber?.trim() ? payload.gstNumber.trim().toUpperCase() : null,
    address: payload.address.trim(),
    city: payload.city.trim(),
    state: payload.state.trim(),
    pincode: payload.pincode.trim(),
    status: payload.status || "ACTIVE",
  };
}

module.exports = {
  listDealers,
  getDealer,
  createDealer,
  updateDealer,
  updateDealerStatus,
};