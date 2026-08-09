# Project Context

## Scope
- Project: Priya's Aqua Fresh Admin Panel.
- Admin path: `D:\priyaAquaFresh\admin`.
- Customer frontend path `D:\priyaAquaFresh\frontend` must not be touched during admin work.
- Current phase is admin frontend design with mock interactions only.

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
- Products route `/products` includes product stats, category/status filters, table, main image, product code, separate customer/dealer original/selling prices, product status, and row actions inside the reusable dropdown.
- Add product route `/products/new` includes a simplified full-page form with only Product Name, Category, optional Product Code, customer/dealer original and selling prices, max four product images, one Description field, and Active/Inactive status.
- Product form no longer shows stock quantity, low stock, out-of-stock, stock status, inventory, specifications, dynamic specification rows, short/full description split, manual discount fields, brand/model fields, Draft status, or manual slug input.
- Product slug is generated internally from Product Name through `src/utils/slug.ts`; the admin does not type or see a slug field.
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
- Admin dialogs now use `AdminModalShell`, which gives every modal a viewport-safe max height and internal scrolling so the top/bottom are not clipped on desktop, tablet, or mobile.
- Placeholder pages remain for `/customers`, `/orders`, `/testimonials`, `/reports`, and `/settings` so sidebar navigation does not hit 404 while later modules are pending.
- Mock data is separated in `src/data/admin.ts`.
- Shared admin types are separated in `src/types/admin.ts`.

## Validation Notes
- Full `npm.cmd run lint` was attempted but timed out after starting ESLint with no reported errors.
- Targeted ESLint passed for all changed admin files.
- Latest product-management cleanup was made without running lint, build, or dev server, per user request.
- Product image required size text and 800 x 800 px validation were added without running lint, build, or dev server.
- Admin modal clipping fix was applied to current confirmation and service-detail dialogs without running lint, build, or dev server.
- Categories, Dealers, and Coupons admin updates were completed without running build or dev server.
- Targeted ESLint passed for the changed Categories, Dealers, Coupons, shared admin component, type, and mock data files.

## Explicit Non-Goals
- No backend APIs.
- No database integration.
- No permanent authentication.
- No customer frontend changes.
- No admin module implementations beyond the first requested phase except route-safe placeholders.
