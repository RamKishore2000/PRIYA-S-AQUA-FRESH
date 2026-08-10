const express = require("express");
const serviceRequestController = require("../controllers/serviceRequest.controller");
const validateRequest = require("../middleware/validateRequest");
const { asyncHandler } = require("../utils/asyncHandler");
const {
  serviceRequestIdValidator,
  serviceRequestPayloadValidator,
  serviceRequestStatusValidator,
} = require("../validators/serviceRequest.validator");

const router = express.Router();

router.get("/", asyncHandler(serviceRequestController.listServiceRequests));
router.post("/", serviceRequestPayloadValidator, validateRequest, asyncHandler(serviceRequestController.createServiceRequest));
router.patch("/:id/status", serviceRequestIdValidator, serviceRequestStatusValidator, validateRequest, asyncHandler(serviceRequestController.updateServiceRequestStatus));

module.exports = router;
