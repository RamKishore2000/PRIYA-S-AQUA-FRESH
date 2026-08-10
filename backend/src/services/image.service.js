const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const { ApiError } = require("../utils/apiError");
const { allowedFolders, uploadRoot } = require("../config/upload");

function normalizeFolder(folder) {
  const safeFolder = String(folder || "general").toLowerCase();
  if (!allowedFolders.has(safeFolder)) {
    throw new ApiError(422, "Invalid upload folder.");
  }
  return safeFolder;
}

function parseDimension(value, fieldName) {
  if (value === undefined || value === null || value === "") return undefined;
  const dimension = Number(value);
  if (!Number.isInteger(dimension) || dimension < 1 || dimension > 3000) {
    throw new ApiError(422, `${fieldName} must be a number between 1 and 3000.`);
  }
  return dimension;
}

async function removeFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (_error) {
    // Temporary upload cleanup should not hide the real request result.
  }
}

async function convertImageToWebp({ file, folder, width, height }) {
  if (!file) {
    throw new ApiError(422, "Image file is required.");
  }

  const safeFolder = normalizeFolder(folder);
  const imageWidth = parseDimension(width, "Width");
  const imageHeight = parseDimension(height, "Height");
  const destinationDir = path.join(uploadRoot, safeFolder);
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
  const destinationPath = path.join(destinationDir, fileName);

  await fs.mkdir(destinationDir, { recursive: true });

  try {
    let pipeline = sharp(file.path).rotate();
    if (imageWidth || imageHeight) {
      pipeline = pipeline.resize({
        width: imageWidth,
        height: imageHeight,
        fit: imageWidth && imageHeight ? "cover" : "inside",
        withoutEnlargement: false,
      });
    }

    const info = await pipeline.webp({ quality: 82 }).toFile(destinationPath);
    await removeFile(file.path);

    return {
      fileName,
      folder: safeFolder,
      mimeType: "image/webp",
      size: info.size,
      width: info.width,
      height: info.height,
      url: `/uploads/${safeFolder}/${fileName}`,
    };
  } catch (error) {
    await removeFile(file.path);
    throw new ApiError(422, "Unable to process image upload.", { image: error.message });
  }
}

module.exports = {
  convertImageToWebp,
};
