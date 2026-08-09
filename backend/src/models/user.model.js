const USER_ROLES = Object.freeze({
  CUSTOMER: "CUSTOMER",
  DEALER: "DEALER",
  ADMIN: "ADMIN",
});

const USER_STATUSES = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
});

function toSafeUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    fullName: row.full_name,
    mobile: row.mobile,
    email: row.email,
    role: row.role,
    status: row.status,
  };
}

module.exports = {
  USER_ROLES,
  USER_STATUSES,
  toSafeUser,
};
