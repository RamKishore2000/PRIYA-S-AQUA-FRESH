const addressService = require("../services/address.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listAddresses(req, res) {
  const addresses = await addressService.listAddresses(req.user.id);
  return sendSuccess(res, 200, "Addresses fetched successfully.", { addresses });
}

async function createAddress(req, res) {
  const address = await addressService.createAddress(req.user.id, req.body);
  return sendSuccess(res, 201, "Address created successfully.", { address });
}

async function updateAddress(req, res) {
  const address = await addressService.updateAddress(req.user.id, req.params.id, req.body);
  return sendSuccess(res, 200, "Address updated successfully.", { address });
}

async function deleteAddress(req, res) {
  await addressService.deleteAddress(req.user.id, req.params.id);
  return sendSuccess(res, 200, "Address deleted successfully.");
}

async function setDefaultAddress(req, res) {
  const address = await addressService.setDefaultAddress(req.user.id, req.params.id);
  return sendSuccess(res, 200, "Default address updated successfully.", { address });
}

module.exports = {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
