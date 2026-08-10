const { body, param } = require("express-validator");

const dealerIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid dealer id is required."),
];

const dealerPayloadValidator = [
  body("name").trim().notEmpty().withMessage("Dealer name is required.").isLength({ max: 120 }).withMessage("Dealer name is too long."),
  body("businessName").trim().notEmpty().withMessage("Business name is required.").isLength({ max: 160 }).withMessage("Business name is too long."),
  body("mobile").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10 digit mobile number."),
  body("email").trim().isEmail().withMessage("Enter a valid email.").normalizeEmail(),
  body("dealerCode").trim().notEmpty().withMessage("Dealer code is required.").isLength({ max: 40 }).withMessage("Dealer code is too long."),
  body("gstNumber").trim().notEmpty().withMessage("GST number is required.").isLength({ max: 30 }).withMessage("GST number is too long."),
  body("address").trim().notEmpty().withMessage("Address is required."),
  body("city").trim().notEmpty().withMessage("City is required."),
  body("state").trim().notEmpty().withMessage("State is required."),
  body("pincode").trim().matches(/^\d{6}$/).withMessage("Enter a valid 6 digit pincode."),
  body("password").optional().matches(/^\d{4}$/).withMessage("Password must be a 4 digit number."),
  body("status").optional().isIn(["ACTIVE", "INACTIVE", "BLOCKED"]).withMessage("Status is invalid."),
];

const createDealerValidator = [
  ...dealerPayloadValidator,
  body("password").notEmpty().withMessage("Password is required.").matches(/^\d{4}$/).withMessage("Password must be a 4 digit number."),
];

const resetPasswordValidator = [
  body("password").notEmpty().withMessage("Password is required.").matches(/^\d{4}$/).withMessage("Password must be a 4 digit number."),
  body("confirmPassword").custom((value, { req }) => value === req.body.password).withMessage("Passwords must match."),
];

const statusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE", "BLOCKED"]).withMessage("Status is invalid."),
];

module.exports = {
  dealerIdValidator,
  createDealerValidator,
  dealerPayloadValidator,
  resetPasswordValidator,
  statusValidator,
};
