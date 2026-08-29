const settingsRepository = require("../repositories/settings.repository");
const { sendSuccess } = require("../utils/apiResponse");

async function getSiteSettings(_req, res) {
  const settings = await settingsRepository.getSiteSettings();
  return sendSuccess(res, 200, "Settings fetched successfully.", { settings });
}

async function updateSiteSettings(req, res) {
  const settings = await settingsRepository.updateSiteSettings(req.body);
  return sendSuccess(res, 200, "Settings updated successfully.", { settings });
}

module.exports = {
  getSiteSettings,
  updateSiteSettings,
};
