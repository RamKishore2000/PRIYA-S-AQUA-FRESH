const policyRepository = require("../repositories/policy.repository");
const { sendSuccess } = require("../utils/apiResponse");

async function listPolicyPages(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const policies = await policyRepository.listPolicyPages({ includeInactive });
  return sendSuccess(res, 200, "Policy pages fetched successfully.", { policies });
}

async function getPolicyPage(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const policy = await policyRepository.getPolicyPage(req.params.slug, { includeInactive });
  return sendSuccess(res, 200, "Policy page fetched successfully.", { policy });
}

async function updatePolicyPage(req, res) {
  const policy = await policyRepository.updatePolicyPage(req.params.slug, req.body);
  return sendSuccess(res, 200, "Policy page updated successfully.", { policy });
}

module.exports = {
  listPolicyPages,
  getPolicyPage,
  updatePolicyPage,
};