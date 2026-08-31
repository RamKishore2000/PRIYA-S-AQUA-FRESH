-- Priyas Aqua Fresh dealer OTP login migration
-- Run this once in phpMyAdmin on the live database before uploading the updated backend.
-- Purpose: customers and dealers can use the same mobile number, but dealer login is allowed only for admin-created dealers.

ALTER TABLE users DROP INDEX uq_users_mobile;
ALTER TABLE users DROP INDEX uq_users_email;
ALTER TABLE users ADD UNIQUE KEY uq_users_mobile_role (mobile, role);
ALTER TABLE users ADD UNIQUE KEY uq_users_email_role (email, role);

ALTER TABLE dealers ADD COLUMN name VARCHAR(120) NULL AFTER user_id;
ALTER TABLE dealers ADD COLUMN mobile VARCHAR(10) NULL AFTER name;
ALTER TABLE dealers ADD COLUMN email VARCHAR(190) NULL AFTER mobile;
ALTER TABLE dealers ADD COLUMN status ENUM('ACTIVE','INACTIVE','BLOCKED') NULL AFTER email;

UPDATE dealers d
INNER JOIN users u ON u.id = d.user_id
SET
  d.name = COALESCE(d.name, u.full_name),
  d.mobile = COALESCE(d.mobile, u.mobile),
  d.email = COALESCE(d.email, u.email),
  d.status = COALESCE(d.status, u.status)
WHERE d.name IS NULL OR d.mobile IS NULL OR d.email IS NULL OR d.status IS NULL;

ALTER TABLE dealers MODIFY name VARCHAR(120) NOT NULL;
ALTER TABLE dealers MODIFY mobile VARCHAR(10) NOT NULL;
ALTER TABLE dealers MODIFY email VARCHAR(190) NOT NULL;
ALTER TABLE dealers MODIFY status ENUM('ACTIVE','INACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE';

ALTER TABLE dealers ADD UNIQUE KEY uq_dealers_mobile (mobile);
ALTER TABLE dealers ADD UNIQUE KEY uq_dealers_email (email);
ALTER TABLE dealers ADD CONSTRAINT chk_dealers_mobile_digits CHECK (mobile REGEXP '^[6-9][0-9]{9}$');