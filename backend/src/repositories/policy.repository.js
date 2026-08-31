const { pool } = require("../config/database");
const { ApiError } = require("../utils/apiError");

const defaultPolicyPages = [
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    description: "Shipping and delivery information for orders placed with Priya's Aqua Fresh.",
    sections: [
      { title: "Delivery timelines", body: "Orders are processed after confirmation and successful payment. Delivery timelines may vary based on product availability, delivery address, installation requirements and local service coverage." },
      { title: "Delivery coordination", body: "For water purifier products, our team may contact the customer to confirm the address, preferred delivery time and installation support where applicable." },
      { title: "Order updates", body: "Customers can check order status from their account or contact support with the order details for delivery updates." },
      { title: "Delays", body: "Delivery may be delayed due to stock availability, weather, transport restrictions, incorrect address details or other circumstances outside normal control. Customers will be informed when support has an update." },
    ],
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    description: "Refund and return guidance for eligible purchases made through Priya's Aqua Fresh.",
    sections: [
      { title: "Return eligibility", body: "Customers may request return or replacement support within 7 days of delivery if the product received is damaged, defective, incorrect or materially different from the confirmed order." },
      { title: "Non-returnable cases", body: "Products that are installed, used, altered, physically damaged after delivery or missing original accessories may not be eligible for return unless the issue is verified as a product defect." },
      { title: "Refund process", body: "Approved refunds are processed to the original payment method after the request is reviewed and the product condition is verified where required. Bank or payment gateway timelines may apply." },
      { title: "Support", body: "To request a return, replacement or refund, contact support with the order number, registered mobile number and clear details of the issue." },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty",
    description: "Warranty support information for eligible Priya's Aqua Fresh products.",
    sections: [
      { title: "Coverage", body: "Warranty coverage depends on the specific product model, manufacturer terms and purchase details. Eligible warranty support generally applies to verified manufacturing defects during the applicable warranty period." },
      { title: "Exclusions", body: "Warranty may not cover physical damage, misuse, unauthorized repairs, voltage issues, consumable filters, normal wear and tear or damage caused by improper handling unless specifically covered for that product." },
      { title: "Proof of purchase", body: "Customers should keep the invoice, order confirmation and product details available when requesting warranty support." },
      { title: "Assistance", body: "For warranty support, contact Priya's Aqua Fresh with the order details and a clear description of the issue so the support team can guide the next steps." },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "How Priya's Aqua Fresh collects, uses and protects customer information.",
    sections: [
      { title: "Information collected", body: "We may collect customer name, mobile number, email address, delivery address, order details and support information when customers use the website, place orders or contact support." },
      { title: "Information use", body: "Customer information is used for account access, order processing, delivery coordination, installation or service support, payment confirmation and customer communication." },
      { title: "Payments", body: "Online payments are processed through authorized payment gateway services. Priya's Aqua Fresh does not store full card numbers, UPI PINs or net banking passwords on this website." },
      { title: "Data sharing", body: "Customer information is not sold. Information may be shared only with service providers needed to complete orders, process payments, provide support or meet legal requirements." },
      { title: "Data care", body: "Reasonable security practices are used to protect customer information. Customers should keep account login details confidential and contact support if they notice unauthorized activity." },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "Terms for using the Priya's Aqua Fresh website and placing orders.",
    sections: [
      { title: "Use of site", body: "By using this website, customers agree to provide accurate information and use the website only for lawful purchase, account and support activities." },
      { title: "Product information", body: "Product images, specifications, prices, offers and availability may be updated from time to time. Priya's Aqua Fresh aims to keep information accurate, but minor differences may occur." },
      { title: "Orders", body: "Orders are subject to confirmation, payment status, serviceability of the delivery address and product availability. Priya's Aqua Fresh may contact the customer to verify order details before processing." },
      { title: "Payments", body: "Customers are responsible for completing payment using the available payment options. Payment confirmation from the payment gateway is required before an online paid order is processed." },
      { title: "Support", body: "For order, delivery, warranty, return or refund assistance, customers should contact support with the order number and registered contact details." },
    ],
  },
];

const allowedSlugs = new Set(defaultPolicyPages.map((page) => page.slug));

function parseSections(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSection(section) {
  return {
    title: String(section?.title || "").trim(),
    body: String(section?.body || "").trim(),
  };
}

function normalizePage(input) {
  const sections = Array.isArray(input.sections) ? input.sections : parseSections(input.sections);
  return {
    slug: String(input.slug || "").trim(),
    title: String(input.title || "").trim(),
    description: String(input.description || "").trim(),
    sections: sections.map(normalizeSection).filter((section) => section.title && section.body),
    status: input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

function mapRow(row) {
  return normalizePage({
    slug: row.slug,
    title: row.title,
    description: row.description,
    sections: row.sections,
    status: row.status,
  });
}

async function ensureDefaultPolicyPages(connection = pool) {
  await connection.query(`CREATE TABLE IF NOT EXISTS policy_pages (` +
    `id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,` +
    `slug VARCHAR(80) NOT NULL,` +
    `title VARCHAR(160) NOT NULL,` +
    `description VARCHAR(500) NOT NULL,` +
    `sections JSON NOT NULL,` +
    `status ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',` +
    `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,` +
    `updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,` +
    `PRIMARY KEY (id),` +
    `UNIQUE KEY uq_policy_pages_slug (slug)` +
  `)`);

  for (const page of defaultPolicyPages) {
    await connection.query(
      `INSERT INTO policy_pages (slug, title, description, sections, status)
       VALUES (?, ?, ?, ?, 'ACTIVE')
       ON DUPLICATE KEY UPDATE slug = VALUES(slug)`,
      [page.slug, page.title, page.description, JSON.stringify(page.sections)],
    );
  }
}

async function listPolicyPages({ includeInactive = false } = {}) {
  await ensureDefaultPolicyPages();
  const [rows] = await pool.execute(
    `SELECT slug, title, description, sections, status FROM policy_pages ${includeInactive ? "" : "WHERE status = 'ACTIVE'"} ORDER BY FIELD(slug, 'shipping-policy', 'refund-policy', 'warranty', 'privacy-policy', 'terms'), title`,
  );
  return rows.map(mapRow);
}

async function getPolicyPage(slug, { includeInactive = false } = {}) {
  await ensureDefaultPolicyPages();
  const [rows] = await pool.execute(
    `SELECT slug, title, description, sections, status FROM policy_pages WHERE slug = ? ${includeInactive ? "" : "AND status = 'ACTIVE'"} LIMIT 1`,
    [slug],
  );
  if (!rows.length) {
    const fallback = defaultPolicyPages.find((page) => page.slug === slug);
    if (fallback && includeInactive) return normalizePage({ ...fallback, status: "ACTIVE" });
    throw new ApiError(404, "Policy page not found.");
  }
  return mapRow(rows[0]);
}

async function updatePolicyPage(slug, input) {
  if (!allowedSlugs.has(slug)) {
    throw new ApiError(400, "Invalid policy page.");
  }
  const normalized = normalizePage({ ...input, slug });
  if (!normalized.title) {
    throw new ApiError(422, "Policy title is required.");
  }
  if (!normalized.description) {
    throw new ApiError(422, "Policy description is required.");
  }
  if (!normalized.sections.length) {
    throw new ApiError(422, "Add at least one policy point.");
  }

  await ensureDefaultPolicyPages();
  await pool.execute(
    `INSERT INTO policy_pages (slug, title, description, sections, status)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), sections = VALUES(sections), status = VALUES(status)`,
    [slug, normalized.title, normalized.description, JSON.stringify(normalized.sections), normalized.status],
  );
  return getPolicyPage(slug, { includeInactive: true });
}

module.exports = {
  defaultPolicyPages,
  ensureDefaultPolicyPages,
  listPolicyPages,
  getPolicyPage,
  updatePolicyPage,
};