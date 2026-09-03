ALTER TABLE product_images ADD COLUMN color_name VARCHAR(60) NULL AFTER is_primary;
ALTER TABLE product_images ADD COLUMN color_code VARCHAR(20) NULL AFTER color_name;
