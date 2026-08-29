# Project Context

## Scope
- Project: Priya's Aqua Fresh Admin Panel.
- Admin path: `D:\priyaAquaFresh\admin`.
- Admin is now being bound to the backend API at `D:\priyaAquaFresh\backend`.
- Customer frontend path `D:\priyaAquaFresh\frontend` is separate; only touch it when the task explicitly targets frontend behavior.

## Stack
- Next.js App Router, TypeScript, Tailwind CSS.
- Current installed runtime dependencies are `next`, `react`, and `react-dom`.
- shadcn/ui, lucide-react, sonner, and chart packages are not currently installed in this admin project.
- This phase avoids package installation and uses local reusable components, including local SVG icons that visually match the requested Lucide-style admin UI.

## Implemented In This Phase
- `/` redirects to `/login`.
- `/login` contains a centered admin login panel with email, password, show/hide password, remember me, forgot password link, mock validation, success message, and navigation to `/dashboard`.
- Login and sidebar use the Priya's Aqua Fresh cropped logo from `public/images/brand/priyas-aqua-fresh-logo-cropped.png`; sidebar brand text is hidden so the logo is clear.
- Reusable admin shell with desktop sidebar, mobile overlay sidebar, collapsible desktop sidebar, sticky top header, search UI, notification badge, and profile dropdown.
- Sidebar uses grouped navigation, proper SVG icons for every item, active route highlighting via `usePathname()`, hover states, and collapsed-title hints.
- Active sidebar route highlighting uses `usePathname()`.
- Dashboard route `/dashboard` includes four primary stats in one desktop row, CSS-based chart cards, recent orders table, and recent service requests table.
- Categories route `/categories` includes category table, image, description, product count, status, created date, working Add Category modal, Edit Category modal, Delete Category confirmation, and View Products row action. Category slug is generated internally from the category name.
- Backend currently contains these active categories for admin: RO Water Purifiers, Alkaline Water Purifiers, Electronics, Commercial Water Purifiers, and Spare Parts.
- Category image upload is handled by the backend upload API and stores WebP files on disk.
- `next.config.ts` allows backend-uploaded images from `http://localhost:5000/uploads/**` and `http://127.0.0.1:5000/uploads/**` for `next/image`.
- Products route `/products` includes product stats, category/status filters, table, main image, product code, separate customer/dealer original/selling prices, product status, and row actions inside the reusable dropdown.
- Add product route `/products/new` includes a simplified full-page form with only Product Name, Category, optional Product Code, customer/dealer original and selling prices, max four product images, one Description field, and Active/Inactive status.
- Product form no longer shows stock quantity, low stock, out-of-stock, stock status, inventory, specifications, dynamic specification rows, short/full description split, manual discount fields, brand/model fields, Draft status, or manual slug input.
- Product slug is generated internally from Product Name through `src/utils/slug.ts`; the admin does not type or see a slug field.
- Product Code/SKU is optional in the admin form; when blank, admin omits `sku` from the create request and backend auto-generates a unique SKU during product creation.
- Add Product form now maps backend field validation errors onto visible fields, disables Save while submitting, and redirects to `/products` after successful creation.
- Add/Edit Product forms include Product Rating and Review Count fields; rating is validated from 0 to 5 and review count must be 0 or more.
- Product edit is implemented at `/products/[id]/edit`, preloads product data from the backend, reuses `ProductForm` in edit mode, and saves through `PUT /api/products/:id`.
- Product images use four upload slots with Main Image first, preview, replace, remove, JPG/PNG/WEBP validation, and exact 800 x 800 px image-size validation.
- Product pricing display uses `src/utils/format-currency.ts` with Indian currency formatting.
- Dealers route `/dealers` includes top stats, success message, search field, dealer list table with mock dealer data, and row actions inside the reusable dropdown.
- Dealer creation is on `/dealers/new`; dealer details are on `/dealers/[id]`; dealer editing is on `/dealers/[id]/edit`.
- Dealer form fields include Dealer Name, Business Name, Mobile, Email, Dealer Code, GST Number, Address, City, State, Pincode, Password, Confirm Password, and Active/Inactive status.
- Dealer row actions include View Dealer, Edit Dealer, View Orders, Reset Password, and Activate/Deactivate Dealer. Reset Password uses a viewport-safe modal.
- Coupons route `/coupons` is implemented with mock coupon data, Add Coupon modal, Edit Coupon modal, View Coupon modal, Delete Coupon confirmation, and Activate/Deactivate Coupon row action.
- Coupon fields include Coupon Code, Discount Type, Discount Value, Minimum Order Amount, Maximum Discount Amount, Start Date, Start Time, End Date, End Time, Usage Limit, and Active/Inactive manual status.
- Coupon display computes visible status as Active, Inactive, Upcoming, or Expired from manual status and validity date/time.
- Services route `/services` now includes service stats, filters, request table, mock request data, a row dropdown preserving View Details, and a detail dialog with status/technician controls.
- Dashboard recent orders and recent service requests now use the reusable row actions dropdown while preserving the existing View action point.
- `RowActionsDropdown` provides one compact three-dot trigger, right-aligned dropdown menu, icon + label items, and compact delete confirmation integration.
- `AdminToast` provides local toast-style success feedback for mock actions without adding the external Sonner dependency.
- Admin header profile now uses a custom dropdown with avatar initials, admin role text, My Profile, Settings, and Logout actions with SVG icons.
- Reusable `PageHeader` action buttons use client-side `router.push` for reliable admin navigation, including Products -> Add Product.
- Admin dialogs now use `AdminModalShell`, which gives every modal a viewport-safe max height and internal scrolling so the top/bottom are not clipped on desktop, tablet, or mobile.
- Customers route `/customers` is backend-bound with stats cards, search, customer table, total orders/spend, created date, and Active/Inactive/Blocked account status actions.
- Orders route `/orders` is backend-bound with stats, filters, product image thumbnail, order number, customer, item count, amount, payment status, order status, date, and View Order action.
- Order details route `/orders/[id]` is backend-bound with full product list/images, customer info, delivery address, price details, payment status, and admin order status update control.
- Placeholder pages remain for `/reports` and `/settings` so sidebar navigation does not hit 404 while later modules are pending.
- Testimonials route `/testimonials` is implemented with backend-bound list, stats, Add/Edit modal, optional image upload, rating, role, message, sort order, Active/Inactive status, delete confirmation, and activate/deactivate row action.
- Shared admin types are separated in `src/types/admin.ts`.

## Validation Notes
- Full `npm.cmd run lint` was attempted but timed out after starting ESLint with no reported errors.
- Targeted ESLint passed for all changed admin files.
- Latest product-management cleanup was made without running lint, build, or dev server, per user request.
- Product image required size text and 800 x 800 px validation were added without running lint, build, or dev server.
- Admin modal clipping fix was applied to current confirmation and service-detail dialogs without running lint, build, or dev server.
- Categories, Dealers, and Coupons admin updates were completed without running build or dev server.
- Targeted ESLint passed for the changed Categories, Dealers, Coupons, shared admin component, type, and mock data files.
- Admin lint passed after the Add Product navigation fix.
- Admin lint passed after the Save Product submit fix; backend product service/validator modules loaded successfully with Node.
- Admin lint passed after product edit wiring.
- Admin lint passed after product rating/review-count fields were added.
- Admin lint passed after Testimonials management was implemented and bound to backend APIs.
- Backend customer APIs were added and targeted admin ESLint passed after Customers management was implemented.
- Backend-bound Orders list/detail pages with product images and status update passed targeted admin ESLint.
- Admin order detail route now reads the dynamic id with `useParams()` in the client component so View Order opens the correct `/orders/[id]` detail record.
- Admin API client includes refresh-on-401 retry support so expired 15-minute access tokens can be refreshed using the stored refresh token before forcing re-login.
- Admin product delete may return `409 Conflict` when a product is already used in orders. This is intentional backend protection; such products should be marked inactive instead of deleted so order history remains valid.
- Dashboard is intended to show five primary business cards: total customers, total dealers, total orders, total services, and total revenue. The previous active-card direction is not desired.
- Dashboard graph direction is two dynamic report areas: monthly product orders and monthly service requests, with hover detail overlays and status distribution summaries.
- Header search/notification controls are not required if unused; profile dropdown should show useful admin/account information.

## Explicit Non-Goals
- Do not run build or dev server when the user explicitly says not to.
- Do not overwrite uploaded runtime files; they live outside Git-tracked source files.
- Do not expose or commit real `.env` secrets. Keep `.env.example` as placeholders only.

