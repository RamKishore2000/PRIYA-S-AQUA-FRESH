const { body, param } = require("express-validator");

const serviceRequestPayloadValidator = [
  body("customerName").trim().notEmpty().withMessage("Full name is required."),
  body("mobile").trim().matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10 digit mobile number."),
  body("email").optional({ nullable: true, checkFalsy: true }).isEmail().withMessage("Enter a valid email.").normalizeEmail(),
  body("serviceType").trim().notEmpty().withMessage("Service type is required."),
  body("address").trim().notEmpty().withMessage("Address is required."),
  body("city").optional({ nullable: true, checkFalsy: true }).isString(),
  body("preferredDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Preferred date is invalid."),
  body("problem").optional({ nullable: true, checkFalsy: true }).isString(),
];

const serviceRequestIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid service request id is required."),
];

const serviceRequestStatusValidator = [
  body("status").isIn(["NEW", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).withMessage("Status is invalid."),
  body("technicianName").optional({ nullable: true, checkFalsy: true }).isString(),
];

module.exports = {
  serviceRequestPayloadValidator,
  serviceRequestIdValidator,
  serviceRequestStatusValidator,
};
