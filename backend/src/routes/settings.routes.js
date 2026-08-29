const express = require("express");
const settingsController = require("../controllers/settings.controller");
const { requireAuth, requireRole } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.get("/site", asyncHandler(settingsController.getSiteSettings));
router.put("/site", requireAuth, requireRole("ADMIN"), asyncHandler(settingsController.updateSiteSettings));

module.exports = router;
