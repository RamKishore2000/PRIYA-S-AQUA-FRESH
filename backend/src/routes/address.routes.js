const express = require("express");
const addressController = require("../controllers/address.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.use(requireAuth, requireRole("CUSTOMER", "DEALER"));
router.get("/", asyncHandler(addressController.listAddresses));
router.post("/", asyncHandler(addressController.createAddress));
router.put("/:id", asyncHandler(addressController.updateAddress));
router.delete("/:id", asyncHandler(addressController.deleteAddress));
router.patch("/:id/default", asyncHandler(addressController.setDefaultAddress));

module.exports = router;
