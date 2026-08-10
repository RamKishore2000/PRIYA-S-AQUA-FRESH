const bannerRepository = require("../repositories/banner.repository");
const { ApiError } = require("../utils/apiError");

async function listBanners({ includeInactive = false } = {}) {
  return bannerRepository.findAll({ includeInactive });
}

async function getBanner(id) {
  const banner = await bannerRepository.findById(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found.");
  }
  return banner;
}

async function createBanner(payload) {
  return bannerRepository.createBanner(normalizeBannerPayload(payload));
}

async function updateBanner(id, payload) {
  const current = await getBanner(id);
  return bannerRepository.updateBanner(id, normalizeBannerPayload(payload, current));
}

async function updateBannerStatus(id, status) {
  await getBanner(id);
  return bannerRepository.updateStatus(id, status);
}

async function deleteBanner(id) {
  await getBanner(id);
  await bannerRepository.deleteBanner(id);
}

function normalizeBannerPayload(payload, current = {}) {
  return {
    title: String(payload.title ?? current.title ?? "").trim(),
    subtitle: payload.subtitle ? String(payload.subtitle).trim() : null,
    description: payload.description ? String(payload.description).trim() : null,
    imageUrl: String(payload.imageUrl ?? current.imageUrl ?? "").trim(),
    buttonText: payload.buttonText ? String(payload.buttonText).trim() : null,
    buttonLink: payload.buttonLink ? String(payload.buttonLink).trim() : null,
    themeColor: payload.themeColor ? String(payload.themeColor).trim() : null,
    glowColor: payload.glowColor ? String(payload.glowColor).trim() : null,
    sortOrder: Number(payload.sortOrder ?? current.sortOrder ?? 0),
    status: payload.status || current.status || "ACTIVE",
  };
}

module.exports = {
  listBanners,
  getBanner,
  createBanner,
  updateBanner,
  updateBannerStatus,
  deleteBanner,
};
