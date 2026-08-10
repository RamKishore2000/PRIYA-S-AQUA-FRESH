const { body, param } = require("express-validator");

const orderIdValidator = [
  param("id").isInt({ min: 1 }).withMessage("Valid order id is required."),
];

const orderStatusValidator = [
  body("status")
    .isIn(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage("Order status is invalid."),
];

module.exports = {
  orderIdValidator,
  orderStatusValidator,
};
