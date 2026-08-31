const express = require("express");
const policyController = require("../controllers/policy.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(policyController.listPolicyPages));
router.get("/:slug", asyncHandler(policyController.getPolicyPage));
router.put("/:slug", requireAuth, requireRole("ADMIN"), asyncHandler(policyController.updatePolicyPage));

module.exports = router;