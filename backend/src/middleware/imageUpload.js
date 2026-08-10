const fs = require("fs");
const multer = require("multer");
const { ApiError } = require("../utils/apiError");
const { allowedImageMimeTypes, tempUploadDir } = require("../config/upload");

fs.mkdirSync(tempUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, tempUploadDir);
  },
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageMimeTypes.has(file.mimetype)) {
      callback(new ApiError(422, "Only JPG, PNG, and WEBP images are allowed."));
      return;
    }
    callback(null, true);
  },
});

module.exports = {
  imageUpload,
};
