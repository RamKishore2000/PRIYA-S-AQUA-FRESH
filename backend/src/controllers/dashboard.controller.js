const { pool } = require("../config/database");
const { sendSuccess } = require("../utils/apiResponse");

async function getDashboard(_req, res) {
  const [[counts]] = await pool.execute(`
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM dealers) AS totalDealers,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM service_requests) AS totalServices,
      (SELECT COUNT(*) FROM products WHERE status = 'ACTIVE') AS activeProducts,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'PAID') AS totalRevenue
  `);

  return sendSuccess(res, 200, "Dashboard fetched successfully.", {
    stats: {
      totalUsers: Number(counts.totalUsers),
      totalDealers: Number(counts.totalDealers),
      totalOrders: Number(counts.totalOrders),
      totalServices: Number(counts.totalServices),
      activeProducts: Number(counts.activeProducts),
      totalRevenue: Number(counts.totalRevenue),
    },
  });
}

module.exports = {
  getDashboard,
};
