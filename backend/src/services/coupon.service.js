const couponRepository = require("../repositories/coupon.repository");
const { ApiError } = require("../utils/apiError");

async function listCoupons() {
  return couponRepository.findAll();
}

async function listPublicCoupons() {
  return couponRepository.findActivePublic();
}

async function getCoupon(id) {
  const coupon = await couponRepository.findById(id);
  if (!coupon) throw new ApiError(404, "Coupon not found.");
  return coupon;
}

async function createCoupon(payload) {
  const normalized = normalizeCouponPayload(payload);
  const existing = await couponRepository.findByCode(normalized.code);
  if (existing) {
    throw new ApiError(409, "Coupon code already exists.", { code: "Coupon code already exists." });
  }
  return couponRepository.createCoupon(normalized);
}

async function updateCoupon(id, payload) {
  const current = await getCoupon(id);
  const normalized = normalizeCouponPayload(payload);
  const existing = await couponRepository.findByCode(normalized.code);
  if (existing && String(existing.id) !== String(current.id)) {
    throw new ApiError(409, "Coupon code already exists.", { code: "Coupon code already exists." });
  }
  return couponRepository.updateCoupon(id, normalized);
}

async function updateCouponStatus(id, status) {
  await getCoupon(id);
  return couponRepository.updateStatus(id, status);
}

async function deleteCoupon(id) {
  await getCoupon(id);
  await couponRepository.deleteCoupon(id);
}

async function validateCoupon(payload) {
  const code = String(payload.code || "").trim().toUpperCase().replace(/\s+/g, "");
  const subtotal = Number(payload.subtotalAmount);
  if (!code) {
    throw new ApiError(422, "Coupon code is required.", { code: "Coupon code is required." });
  }
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    throw new ApiError(422, "Subtotal amount is required.", { subtotalAmount: "Subtotal amount is required." });
  }
  const coupon = await couponRepository.findByCode(code);
  const discount = await calculateCouponDiscount(coupon, subtotal);
  return {
    coupon,
    discountAmount: discount,
    subtotalAmount: subtotal,
    totalAmount: Math.max(0, subtotal - discount),
  };
}

async function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) {
    throw new ApiError(404, "Coupon not found.", { code: "Coupon not found." });
  }
  const now = new Date();
  const startAt = new Date(coupon.startAt);
  const endAt = new Date(coupon.endAt);
  if (coupon.status !== "ACTIVE") {
    throw new ApiError(422, "Coupon is inactive.", { code: "Coupon is inactive." });
  }
  if (now < startAt) {
    throw new ApiError(422, "Coupon is not active yet.", { code: "Coupon is not active yet." });
  }
  if (now > endAt) {
    throw new ApiError(422, "Coupon has expired.", { code: "Coupon has expired." });
  }
  if (subtotal < coupon.minimumOrderAmount) {
    throw new ApiError(422, `Minimum order amount is ${coupon.minimumOrderAmount}.`, {
      code: `Minimum order amount is ${coupon.minimumOrderAmount}.`,
    });
  }
  const usageCount = await couponRepository.countUsages(coupon.id);
  if (usageCount >= coupon.usageLimit) {
    throw new ApiError(422, "Coupon usage limit reached.", { code: "Coupon usage limit reached." });
  }
  const rawDiscount = coupon.discountType === "PERCENTAGE"
    ? subtotal * (coupon.discountValue / 100)
    : coupon.discountValue;
  const cappedDiscount = coupon.maximumDiscountAmount ? Math.min(rawDiscount, coupon.maximumDiscountAmount) : rawDiscount;
  return Math.min(subtotal, Math.round(cappedDiscount * 100) / 100);
}

function normalizeCouponPayload(payload) {
  const startAt = new Date(payload.startAt);
  const endAt = new Date(payload.endAt);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime()) || endAt <= startAt) {
    throw new ApiError(422, "End date and time must be after the start date and time.", {
      endAt: "End date and time must be after the start date and time.",
    });
  }

  return {
    code: payload.code.trim().toUpperCase().replace(/\s+/g, ""),
    title: cleanOptionalText(payload.title),
    subtitle: cleanOptionalText(payload.subtitle),
    imageUrl: cleanOptionalText(payload.imageUrl),
    discountType: payload.discountType,
    discountValue: Number(payload.discountValue),
    minimumOrderAmount: Number(payload.minimumOrderAmount),
    maximumDiscountAmount: payload.maximumDiscountAmount ? Number(payload.maximumDiscountAmount) : null,
    startAt,
    endAt,
    usageLimit: Number(payload.usageLimit),
    sortOrder: payload.sortOrder ? Number(payload.sortOrder) : 0,
    status: payload.status || "ACTIVE",
  };
}

function cleanOptionalText(value) {
  const text = String(value || "").trim();
  return text || null;
}

module.exports = {
  listCoupons,
  listPublicCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  updateCouponStatus,
  deleteCoupon,
  validateCoupon,
  calculateCouponDiscount,
};
