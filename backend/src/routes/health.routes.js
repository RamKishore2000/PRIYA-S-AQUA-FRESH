const express = require("express");
const { sendSuccess } = require("../utils/apiResponse");

const router = express.Router();

router.get("/health", (req, res) => {
  return sendSuccess(res, 200, "Backend is healthy.");
});

module.exports = router;
