const userRepository = require("../repositories/user.repository");
const tokenService = require("../services/token.service");
const { ApiError } = require("../utils/apiError");
const { toSafeUser } = require("../models/user.model");

async function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");
    if (!token) {
      throw new ApiError(401, "Authentication token is required.");
    }

    const payload = tokenService.verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user || user.status !== "ACTIVE") {
      throw new ApiError(401, "Authentication token is invalid.");
    }

    req.user = toSafeUser(user);
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(401, "Authentication token is invalid or expired."));
  }
}

function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
