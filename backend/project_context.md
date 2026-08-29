# Backend Project Context

## Scope
- Project path: `D:\priyaAquaFresh\backend`.
- Backend is the source of truth for customer frontend and admin panel data.
- MySQL schema is maintained in `src/database/schema.sql`.
- Runtime uploaded images are stored on disk under `public/uploads` and served from `/uploads`.

## Current Database
- Existing `users` table is preserved with `CUSTOMER`, `DEALER`, and `ADMIN` roles.
- Added ecommerce/admin tables for refresh tokens, dealers, addresses, categories, products, product images, product prices, carts, wishlist, coupons, orders, payments, services, testimonials, contact messages, banners, settings, OTP verifications, and webhook event logs.
- Testimonials table supports admin-managed brand testimonials with customer name, role, rating, message, optional image URL, sort order, and Active/Inactive status.
- Five active testimonials are seeded in the local MySQL database with sort orders 1-5.
- Database initialization uses `npm run init-db`, which executes `src/database/schema.sql`.
- Latest local database check confirmed `otp_verifications` and `webhook_events` tables exist after running `npm run init-db`.
- Seeded active admin-visible categories: RO Water Purifiers, Alkaline Water Purifiers, Electronics, Commercial Water Purifiers, and Spare Parts.
- Category records currently do not have uploaded image URLs unless images are added through the admin upload flow.

## Image Uploads
- Upload API: `POST /api/uploads/images`.
- Multipart field name: `image`.
- Body fields:
  - `folder`: `products`, `categories`, `banners`, `brands`, `testimonials`, or `general`.
  - `width`: optional resize width.
  - `height`: optional resize height.
- Accepted input formats: JPG, PNG, WEBP.
- Output format: WEBP.
- Max upload size: 5MB.
- Final uploaded files are ignored by Git; `.gitkeep` placeholders keep upload directories present.

## Product Creation Notes
- Product Code/SKU is optional from admin.
- If SKU is blank, backend generates a unique SKU from the product name and timestamp suffix.
- Product creation still requires category, name, description, customer/dealer prices, and 1 to 4 uploaded product images.
- Products include `rating` and `review_count`; `npm run init-db` safely adds these columns to existing databases.

## Current APIs
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/otp/send`
  - `POST /api/auth/otp/resend`
  - `POST /api/auth/otp/verify`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- Uploads:
  - `POST /api/uploads/images`
- Categories:
  - `GET /api/categories`
  - `GET /api/categories?includeInactive=true`
  - `GET /api/categories/:id`
  - `POST /api/categories`
  - `PUT /api/categories/:id`
  - `DELETE /api/categories/:id`
- Products:
  - `GET /api/products`
  - `GET /api/products?category=<category-slug>`
  - `GET /api/products?includeInactive=true`
  - `GET /api/products/:id`
  - `GET /api/products/slug/:slug`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
- Testimonials:
  - `GET /api/testimonials`
  - `GET /api/testimonials?includeInactive=true`
  - `GET /api/testimonials/:id`
  - `POST /api/testimonials`
  - `PUT /api/testimonials/:id`
  - `PATCH /api/testimonials/:id/status`
  - `DELETE /api/testimonials/:id`
- Customers:
  - `GET /api/customers`
  - `GET /api/customers/:id`
  - `PATCH /api/customers/:id/status`
- Dealers, coupons, dashboard, service requests, and contact messages APIs are also implemented and used by the admin/customer frontend where applicable.
- Cart:
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PATCH /api/cart/items/:productId`
  - `DELETE /api/cart/items/:productId`
  - `DELETE /api/cart`
- Wishlist:
  - `GET /api/wishlist`
  - `POST /api/wishlist`
  - `DELETE /api/wishlist/:productId`
- Addresses:
  - `GET /api/addresses`
  - `POST /api/addresses`
  - `PUT /api/addresses/:id`
  - `DELETE /api/addresses/:id`
  - `PATCH /api/addresses/:id/default`
- Orders and Razorpay:
  - `GET /api/orders`
  - `POST /api/orders`
  - `GET /api/orders/my`
  - `GET /api/orders/:id`
  - `GET /api/orders/:id/admin`
  - `PATCH /api/orders/:id/status`
  - `POST /api/orders/razorpay/order`
  - `POST /api/orders/razorpay/verify`
  - `POST /api/orders/razorpay/webhook`
- Coupon validation:
  - `POST /api/coupons/validate`


## Auth, JWT, OTP, and Payment Notes
- JWT config lives in `src/config/env.js` and is sourced from `.env`.
- Access tokens are short-lived and currently configured by `JWT_ACCESS_EXPIRES_IN` (`15m` in local env/example).
- Refresh tokens are longer-lived and configured by `JWT_REFRESH_EXPIRES_IN_DAYS` (`7`) or `JWT_REMEMBER_REFRESH_EXPIRES_IN_DAYS` (`30`) when remember-me is used.
- `.env` contains real generated JWT secrets for local development. `.env.example` must keep placeholder values only.
- Login-with-OTP is implemented for existing active users by mobile number only; it is not a registration OTP flow.
- OTP flow files: `src/repositories/otp.repository.js`, `src/services/otp.service.js`, `src/controllers/auth.controller.js`, `src/routes/auth.routes.js`, and `src/validators/auth.validator.js`.
- OTP env keys are present in `.env` and `.env.example`: `OTP_PROVIDER`, `OTP_AUTH_KEY`, `OTP_API_KEY`, `OTP_SENDER_ID`, `OTP_TEMPLATE_ID`, `OTP_TEMPLATE_TEXT`, `OTP_EXPIRES_IN_MINUTES`, `OTP_RESEND_COOLDOWN_SECONDS`, `OTP_MAX_ATTEMPTS`, `OTP_MAX_SENDS_PER_WINDOW`, and `OTP_RATE_LIMIT_WINDOW_MINUTES`.
- Current OTP provider mode is development/local placeholder. In development, OTP is logged/returned for testing. Real SMS provider sending should be wired after the user provides provider credentials and API details.
- Razorpay webhook support is implemented at `/api/orders/razorpay/webhook` using raw request body parsing before `express.json`.
- Razorpay webhook files: `src/routes/razorpayWebhook.routes.js`, `src/repositories/webhookEvent.repository.js`, `src/services/order.service.js`, `src/controllers/order.controller.js`, and `src/app.js`.
- `RAZORPAY_WEBHOOK_SECRET` is present in `.env` and `.env.example`; local `.env` is blank until the real webhook secret is provided.
- Webhook event logging is idempotent through `webhook_events` with unique provider/event ID tracking.
- Webhook handles successful captured/paid payment events and failed payment events. Successful payment updates are idempotent against duplicate Razorpay provider payment IDs.
## Pending
- Cart, wishlist, checkout, Razorpay test payment, and customer/admin order history are now API-bound for logged-in customers/dealers and admin screens.
- Cart subtotal and order creation unit prices use dealer selling price when authenticated user role is `DEALER`; customer users continue using customer selling price.
- Order API responses include customer account data for admin views and product image URL/slug for each order item.
- Order creation accepts `couponCode`, stores `coupon_id` and `discount_amount`, and records `coupon_usages` after successful Razorpay verification.
- Order creation also accepts `addressId`; when supplied, backend validates the address belongs to the logged-in customer/dealer and copies that saved address into `shipping_address_json`.
- Admin Customers uses the existing `users` table with `role = 'CUSTOMER'`; Active users can login, while Inactive and Blocked users are rejected by existing auth status checks.
- Runtime uploaded image files are intentionally not committed; only `.gitkeep` placeholders are tracked.
- Restart backend after changing `.env`, OTP config, Razorpay webhook secret, or JWT secrets.

