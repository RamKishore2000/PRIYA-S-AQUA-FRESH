const { sendSuccess } = require("../utils/apiResponse");
const { convertImageToWebp } = require("../services/image.service");

async function uploadImage(req, res) {
  const image = await convertImageToWebp({
    file: req.file,
    folder: req.body.folder,
    width: req.body.width,
    height: req.body.height,
  });

  return sendSuccess(res, 201, "Image uploaded successfully.", { image });
}

module.exports = {
  uploadImage,
};
