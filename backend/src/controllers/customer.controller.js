const customerService = require("../services/customer.service");
const { sendSuccess } = require("../utils/apiResponse");

async function listCustomers(_req, res) {
  const customers = await customerService.listCustomers();
  return sendSuccess(res, 200, "Customers fetched successfully.", { customers });
}

async function getCustomer(req, res) {
  const customer = await customerService.getCustomer(req.params.id);
  return sendSuccess(res, 200, "Customer fetched successfully.", { customer });
}

async function updateCustomerStatus(req, res) {
  const customer = await customerService.updateCustomerStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Customer status updated successfully.", { customer });
}

module.exports = {
  listCustomers,
  getCustomer,
  updateCustomerStatus,
};
