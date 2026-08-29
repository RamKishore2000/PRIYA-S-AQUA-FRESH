const { body } = require("express-validator");

const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 2, max: 120 })
    .withMessage("Full name must be between 2 and 120 characters."),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10 digit Indian mobile number."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .matches(/^\d{4}$/)
    .withMessage("Password must be a 4 digit number."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match."),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email or mobile number is required.")
    .custom((value) => /^[6-9]\d{9}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    .withMessage("Enter a valid email address or 10 digit mobile number."),
  body("password").notEmpty().withMessage("Password is required."),
  body("rememberMe").optional().isBoolean().withMessage("Remember me must be true or false."),
];

const refreshValidator = [
  body("refreshToken").trim().notEmpty().withMessage("Refresh token is required."),
];


const otpSendValidator = [
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10 digit Indian mobile number."),
];

const otpVerifyValidator = [
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required.")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10 digit Indian mobile number."),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required.")
    .matches(/^\d{6}$/)
    .withMessage("Enter the 6 digit OTP."),
  body("rememberMe").optional().isBoolean().withMessage("Remember me must be true or false."),
];
const logoutValidator = [
  body("refreshToken").optional({ nullable: true, checkFalsy: true }).isString().withMessage("Refresh token is invalid."),
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshValidator,
  otpSendValidator,
  otpVerifyValidator,
  logoutValidator,
};



