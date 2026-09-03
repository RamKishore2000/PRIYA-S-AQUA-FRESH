CREATE TABLE IF NOT EXISTS about_awards (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  description VARCHAR(500) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_about_awards_status_sort (status, sort_order)
);

INSERT INTO about_awards (title, description, image_url, sort_order, status)
SELECT
  'Honored with Excellence Award by Telugu Film Actor Ali Garu',
  'This recognition celebrates Priya''s Aqua Fresh commitment to water purification, product quality and customer trust.',
  '/images/about/award-excellence.jpg',
  0,
  'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM about_awards LIMIT 1);
