const aboutAwardService = require("../services/aboutAward.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listAwards(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const awards = await aboutAwardService.listAwards({ includeInactive });
  return sendSuccess(res, 200, "Awards fetched successfully.", { awards });
}

async function getAward(req, res) {
  const award = await aboutAwardService.getAward(req.params.id);
  return sendSuccess(res, 200, "Award fetched successfully.", { award });
}

async function createAward(req, res) {
  const award = await aboutAwardService.createAward(req.body);
  return sendSuccess(res, 201, "Award created successfully.", { award });
}

async function updateAward(req, res) {
  const award = await aboutAwardService.updateAward(req.params.id, req.body);
  return sendSuccess(res, 200, "Award updated successfully.", { award });
}

async function updateAwardStatus(req, res) {
  const award = await aboutAwardService.updateAwardStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Award status updated successfully.", { award });
}

async function deleteAward(req, res) {
  await aboutAwardService.deleteAward(req.params.id);
  return sendSuccess(res, 200, "Award deleted successfully.");
}

module.exports = {
  listAwards,
  getAward,
  createAward,
  updateAward,
  updateAwardStatus,
  deleteAward,
};
