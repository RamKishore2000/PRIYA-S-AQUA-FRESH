const path = require("path");

const uploadRoot = path.resolve(__dirname, "../../public/uploads");
const tempUploadDir = path.join(uploadRoot, "_tmp");
const allowedImageMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedFolders = new Set(["products", "categories", "banners", "brands", "testimonials", "general"]);

module.exports = {
  uploadRoot,
  tempUploadDir,
  allowedImageMimeTypes,
  allowedFolders,
};
