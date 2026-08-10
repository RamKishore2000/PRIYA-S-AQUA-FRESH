const { ApiError } = require("../utils/apiError");

function errorHandler(error, req, res, next) {
  if (error && error.name === "MulterError") {
    return res.status(422).json({
      success: false,
      message: error.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller." : "Invalid upload request.",
      errors: { upload: error.message },
    });
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  if (error && error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message: "Email or mobile number is already registered.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
}

module.exports = errorHandler;
