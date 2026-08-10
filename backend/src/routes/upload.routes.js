const express = require("express");
const { uploadImage } = require("../controllers/upload.controller");
const { imageUpload } = require("../middleware/imageUpload");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

router.post("/images", imageUpload.single("image"), asyncHandler(uploadImage));

module.exports = router;
