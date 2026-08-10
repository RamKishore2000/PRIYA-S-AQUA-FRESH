const dealerService = require("../services/dealer.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listDealers(_req, res) {
  const dealers = await dealerService.listDealers();
  return sendSuccess(res, 200, "Dealers fetched successfully.", { dealers });
}

async function getDealer(req, res) {
  const dealer = await dealerService.getDealer(req.params.id);
  return sendSuccess(res, 200, "Dealer fetched successfully.", { dealer });
}

async function createDealer(req, res) {
  const dealer = await dealerService.createDealer(req.body);
  return sendSuccess(res, 201, "Dealer created successfully.", { dealer });
}

async function updateDealer(req, res) {
  const dealer = await dealerService.updateDealer(req.params.id, req.body);
  return sendSuccess(res, 200, "Dealer updated successfully.", { dealer });
}

async function updateDealerStatus(req, res) {
  const dealer = await dealerService.updateDealerStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Dealer status updated successfully.", { dealer });
}

async function resetPassword(req, res) {
  await dealerService.resetPassword(req.params.id, req.body.password);
  return sendSuccess(res, 200, "Dealer password updated successfully.");
}

module.exports = {
  listDealers,
  getDealer,
  createDealer,
  updateDealer,
  updateDealerStatus,
  resetPassword,
};
