const couponService = require("../services/coupon.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listCoupons(_req, res) {
  const coupons = await couponService.listCoupons();
  return sendSuccess(res, 200, "Coupons fetched successfully.", { coupons });
}

async function listPublicCoupons(_req, res) {
  const coupons = await couponService.listPublicCoupons();
  return sendSuccess(res, 200, "Active coupons fetched successfully.", { coupons });
}

async function getCoupon(req, res) {
  const coupon = await couponService.getCoupon(req.params.id);
  return sendSuccess(res, 200, "Coupon fetched successfully.", { coupon });
}

async function createCoupon(req, res) {
  const coupon = await couponService.createCoupon(req.body);
  return sendSuccess(res, 201, "Coupon created successfully.", { coupon });
}

async function updateCoupon(req, res) {
  const coupon = await couponService.updateCoupon(req.params.id, req.body);
  return sendSuccess(res, 200, "Coupon updated successfully.", { coupon });
}

async function updateCouponStatus(req, res) {
  const coupon = await couponService.updateCouponStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Coupon status updated successfully.", { coupon });
}

async function deleteCoupon(req, res) {
  await couponService.deleteCoupon(req.params.id);
  return sendSuccess(res, 200, "Coupon deleted successfully.");
}

async function validateCoupon(req, res) {
  const validation = await couponService.validateCoupon(req.body);
  return sendSuccess(res, 200, "Coupon applied successfully.", { validation });
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
};
