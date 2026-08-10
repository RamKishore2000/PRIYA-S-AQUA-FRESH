const serviceRequestRepository = require("../repositories/serviceRequest.repository");
const { sendSuccess } = require("../utils/apiResponse");

async function listServiceRequests(_req, res) {
  const serviceRequests = await serviceRequestRepository.findAll();
  return sendSuccess(res, 200, "Service requests fetched successfully.", { serviceRequests });
}

async function createServiceRequest(req, res) {
  const serviceRequest = await serviceRequestRepository.create(req.body);
  return sendSuccess(res, 201, "Service request submitted successfully.", { serviceRequest });
}

async function updateServiceRequestStatus(req, res) {
  const serviceRequest = await serviceRequestRepository.updateStatus(req.params.id, req.body);
  return sendSuccess(res, 200, "Service request updated successfully.", { serviceRequest });
}

module.exports = {
  listServiceRequests,
  createServiceRequest,
  updateServiceRequestStatus,
};
