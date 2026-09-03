const aboutAwardRepository = require("../repositories/aboutAward.repository");
const { ApiError } = require("../utils/apiError");

async function listAwards({ includeInactive = false } = {}) {
  return aboutAwardRepository.findAll({ includeInactive });
}

async function getAward(id) {
  const award = await aboutAwardRepository.findById(id);
  if (!award) throw new ApiError(404, "Award not found.");
  return award;
}

async function createAward(payload) {
  return aboutAwardRepository.createAward(normalizeAwardPayload(payload));
}

async function updateAward(id, payload) {
  const current = await getAward(id);
  return aboutAwardRepository.updateAward(id, normalizeAwardPayload(payload, current));
}

async function updateAwardStatus(id, status) {
  await getAward(id);
  return aboutAwardRepository.updateStatus(id, status);
}

async function deleteAward(id) {
  await getAward(id);
  await aboutAwardRepository.deleteAward(id);
}

function normalizeAwardPayload(payload, current = {}) {
  return {
    title: String(payload.title ?? current.title ?? "").trim(),
    description: String(payload.description ?? current.description ?? "").trim(),
    imageUrl: String(payload.imageUrl ?? current.imageUrl ?? "").trim(),
    sortOrder: Number(payload.sortOrder ?? current.sortOrder ?? 0),
    status: payload.status || current.status || "ACTIVE",
  };
}

module.exports = {
  listAwards,
  getAward,
  createAward,
  updateAward,
  updateAwardStatus,
  deleteAward,
};
