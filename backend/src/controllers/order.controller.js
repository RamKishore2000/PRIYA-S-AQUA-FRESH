const orderService = require("../services/order.service");
const { sendSuccess } = require("../utils/apiResponse");

async function createOrder(req, res) {
  const order = await orderService.createOrder(req.user.id, req.body, req.user.role);
  return sendSuccess(res, 201, "Order created successfully.", { order });
}

async function listMyOrders(req, res) {
  const orders = await orderService.listOrders(req.user.id);
  return sendSuccess(res, 200, "Orders fetched successfully.", { orders });
}

async function listOrders(_req, res) {
  const orders = await orderService.listAllOrders();
  return sendSuccess(res, 200, "Orders fetched successfully.", { orders });
}

async function getOrder(req, res) {
  const order = await orderService.getOrder(req.user.id, req.params.id);
  return sendSuccess(res, 200, "Order fetched successfully.", { order });
}

async function getAdminOrder(req, res) {
  const order = await orderService.getAdminOrder(req.params.id);
  return sendSuccess(res, 200, "Order fetched successfully.", { order });
}

async function updateOrderStatus(req, res) {
  const order = await orderService.updateAdminOrderStatus(req.params.id, req.body.status);
  return sendSuccess(res, 200, "Order status updated successfully.", { order });
}

async function createRazorpayOrder(req, res) {
  const data = await orderService.createRazorpayOrder(req.user.id, req.body.orderId);
  return sendSuccess(res, 200, "Razorpay order created successfully.", data);
}


async function markPaymentFailed(req, res) {
  const order = await orderService.markPaymentFailedByUser(req.user.id, req.params.id, req.body);
  return sendSuccess(res, 200, "Payment marked as failed.", { order });
}
async function razorpayWebhook(req, res) {
  const result = await orderService.handleRazorpayWebhook(req.body, req.headers["x-razorpay-signature"]);
  return sendSuccess(res, 200, "Webhook processed successfully.", result);
}
async function verifyRazorpayPayment(req, res) {
  const order = await orderService.verifyRazorpayPayment(req.user.id, req.body);
  return sendSuccess(res, 200, "Payment verified successfully.", { order });
}

module.exports = {
  createOrder,
  listOrders,
  listMyOrders,
  getOrder,
  getAdminOrder,
  updateOrderStatus,
  markPaymentFailed,
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
};


