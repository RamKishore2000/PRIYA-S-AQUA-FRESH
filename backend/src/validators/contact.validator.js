const { body } = require("express-validator");

const contactPayloadValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("mobile").optional({ nullable: true, checkFalsy: true }).matches(/^[6-9]\d{9}$/).withMessage("Enter a valid mobile number."),
  body("email").optional({ nullable: true, checkFalsy: true }).isEmail().withMessage("Enter a valid email.").normalizeEmail(),
  body("subject").optional({ nullable: true, checkFalsy: true }).isString(),
  body("message").trim().notEmpty().withMessage("Message is required."),
];

module.exports = {
  contactPayloadValidator,
};
