const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/apiResponse");

async function register(req, res, next) {
  try {
    const user = await authService.registerCustomer(req.body);
    return sendSuccess(res, 201, "Registration successful. Please login.", { user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
};
