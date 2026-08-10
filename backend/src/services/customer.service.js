const customerRepository = require("../repositories/customer.repository");
const { ApiError } = require("../utils/apiError");

async function listCustomers() {
  return customerRepository.findAll();
}

async function getCustomer(id) {
  const customer = await customerRepository.findById(id);
  if (!customer) throw new ApiError(404, "Customer not found.");
  return customer;
}

async function updateCustomerStatus(id, status) {
  await getCustomer(id);
  return customerRepository.updateStatus(id, status);
}

module.exports = {
  listCustomers,
  getCustomer,
  updateCustomerStatus,
};
