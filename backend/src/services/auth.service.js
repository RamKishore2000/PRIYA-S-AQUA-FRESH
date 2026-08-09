const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const { toSafeUser } = require("../models/user.model");
const { ApiError } = require("../utils/apiError");

async function registerCustomer(input) {
  const fullName = input.fullName.trim().replace(/\s+/g, " ");
  const mobile = input.mobile.trim();
  const email = input.email.trim().toLowerCase();

  const existingMobile = await userRepository.findByMobile(mobile);
  if (existingMobile) {
    throw new ApiError(409, "Mobile number is already registered.", {
      mobile: "Mobile number is already registered.",
    });
  }

  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, "Email is already registered.", {
      email: "Email is already registered.",
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const createdUser = await userRepository.createCustomerUser({
    fullName,
    mobile,
    email,
    passwordHash,
  });

  return toSafeUser(createdUser);
}

module.exports = {
  registerCustomer,
};
