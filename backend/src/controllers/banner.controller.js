const bannerService = require("../services/banner.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listBanners(req, res) {
  const includeInactive = req.query.includeInactive === "true";
  const banners = await bannerService.listBanners({ includeInactive });
  return sendSuccess(res, 200, "Banners fetched successfully.", { banners });
}

async function getBanner(req, res) {
  const banner = await bannerService.getBanner(req.params.id);
  return sendSuccess(res, 200, "Banner fetched successfully.", { banner });
}

async function createBanner(req, res) {
  const banner = await bannerService.createBanner(req.body);
  return sendSuccess(res, 201, "Banner created successfully.", { banner });
}

async function updateBanner(req, res) {
  const banner = await bannerService.updateBanner(req.params.id, req.body);
  return sendSuccess(res, 200, "Banner updated successfully.", { banner });
}

async function updateBannerStatus(req, res) {
  const banner = await bannerService.updateBannerStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Banner status updated successfully.", { banner });
}

async function deleteBanner(req, res) {
  await bannerService.deleteBanner(req.params.id);
  return sendSuccess(res, 200, "Banner deleted successfully.");
}

module.exports = {
  listBanners,
  getBanner,
  createBanner,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
};
