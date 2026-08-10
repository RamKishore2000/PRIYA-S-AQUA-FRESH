const { body, param } = require("express-validator");

const customerIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid customer id is required."),
];

const customerStatusValidator = [
  body("status").isIn(["ACTIVE", "INACTIVE", "BLOCKED"]).withMessage("Status is invalid."),
];

module.exports = {
  customerIdValidator,
  customerStatusValidator,
};
