const addressRepository = require("../repositories/address.repository");
const { ApiError } = require("../utils/apiError");

function normalizeAddress(input) {
  const address = {
    fullName: String(input.fullName || "").trim(),
    mobile: String(input.mobile || "").trim(),
    addressLine1: String(input.addressLine1 || "").trim(),
    addressLine2: String(input.addressLine2 || "").trim(),
    city: String(input.city || "").trim(),
    state: String(input.state || "").trim(),
    pincode: String(input.pincode || "").trim(),
    landmark: String(input.landmark || "").trim(),
    isDefault: Boolean(input.isDefault),
  };

  const errors = {};
  if (!address.fullName) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(address.mobile)) errors.mobile = "Enter a valid mobile number.";
  if (!address.addressLine1) errors.addressLine1 = "Address is required.";
  if (!address.city) errors.city = "City is required.";
  if (!address.state) errors.state = "State is required.";
  if (!/^\d{6}$/.test(address.pincode)) errors.pincode = "Enter a valid pincode.";

  if (Object.keys(errors).length) {
    throw new ApiError(422, "Please fix the highlighted fields.", errors);
  }

  return address;
}

async function listAddresses(userId) {
  return addressRepository.findByUser(userId);
}

async function getAddress(userId, id) {
  const address = await addressRepository.findByIdForUser(id, userId);
  if (!address) throw new ApiError(404, "Address not found.");
  return address;
}

async function createAddress(userId, payload) {
  return addressRepository.create(userId, normalizeAddress(payload));
}

async function updateAddress(userId, id, payload) {
  await getAddress(userId, id);
  return addressRepository.update(id, userId, normalizeAddress(payload));
}

async function deleteAddress(userId, id) {
  await getAddress(userId, id);
  await addressRepository.remove(id, userId);
}

async function setDefaultAddress(userId, id) {
  await getAddress(userId, id);
  return addressRepository.setDefault(id, userId);
}

module.exports = {
  normalizeAddress,
  listAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
