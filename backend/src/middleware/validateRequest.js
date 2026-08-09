const { validationResult } = require("express-validator");

function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  const fieldErrors = {};
  for (const error of result.array()) {
    if (!fieldErrors[error.path]) {
      fieldErrors[error.path] = error.msg;
    }
  }

  return res.status(422).json({
    success: false,
    message: "Please fix the highlighted fields.",
    errors: fieldErrors,
  });
}

module.exports = validateRequest;
