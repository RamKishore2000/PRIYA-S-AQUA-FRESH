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

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, "Login successful.", result);
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.body);
    return sendSuccess(res, 200, "Token refreshed successfully.", result);
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.body);
    return sendSuccess(res, 200, "Logout successful.");
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return sendSuccess(res, 200, "Profile fetched successfully.", { user: req.user });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
