# Priya's Aqua Fresh Frontend2 Context

## Purpose
- `frontend2` is a separate new design/theme project.
- Existing `frontend` must remain untouched while working on `frontend2`.
- `frontend2` uses the same backend/API data contract as the current frontend, but the UI is intentionally different.

## Theme Direction
- Dark Premium Aqua/Navy Ecommerce.
- Primary brand color: `#12a8e6`.
- Background: deep navy/aqua charcoal gradients (`#071624`, `#0b2130`, `#06131d`) with logo-blue and teal glow. Dark, but not flat black.
- Fonts: Cormorant Garamond for display/hero headings, Manrope for UI/body.
- Animation: GSAP for homepage hero text/category reveals and orbit state transitions; CSS used for frosted background polish.

## Implemented
- Fresh API-bound homepage:
  - Light ecommerce header with search bar and compact actions
  - Header navigation remains visible on desktop; hovering/clicking search expands the search field while the nav smoothly shifts left.
  - GSAP reference-inspired dark water product hero using `/api/banners` images first, with `/api/categories` fallback only if no banners exist.
  - Hero avoids the old left-text/right-category split; it uses one reduced central active banner visual, active title below the image only, no top kicker badge, a subtle circular water portal, a next-banner title preview, and a bottom thumbnail dock selector.
  - Hero product motion is limited to a simple premium reveal on category change.
  - Minimal full-width branding/logo river section using copied brand assets, without card-inside-card framing
  - Category showcase using `/api/categories`
  - Product showcase using `/api/products` with visible Add/Wishlist/Share actions
  - Non-card Why Choose Priya's Aqua Fresh section
  - Benefits of buying section
  - Testimonials using `/api/testimonials`
  - FAQ accordion
  - Footer
- Global homepage section reveals are handled by `HomeAnimations` with GSAP + IntersectionObserver.
- Hero was changed from card/bento/orbit/split/editorial/liquid layouts to a full-bleed dark product banner with API-bound active banner imagery, subtle circular product portal, bottom category dock, smooth GSAP reveal transitions, and visible actions.
- Header is now overlaid into the hero using a frosted rounded bar, and the hero was compressed for smaller laptop viewports so headline, main product stage, side panels, and CTAs sit higher above the fold.
- Header nav is centered in the container on desktop, with a larger frosted rounded container and search expanding beside the centered nav.
- Header overlay height was reduced by tightening container padding, logo size, nav padding, search control size, and right icon buttons.
- Home page theme was converted from light frosted aqua to dark premium navy/aqua surfaces across header, hero, categories, products, why, testimonials, FAQ, footer, and global body background. Hero, branding, and category sections now share the same solid dark navy surface.
- Where We Are was removed from the homepage and replaced by a non-card Why Choose Priya's Aqua Fresh section with editorial text, divider feature rows, purifier visual, and No. 1 badge.
- Benefits of buying section was added after Why Choose using a non-card split layout with numbered vertical benefit rows.
- Product showcase uses a 4-per-row ecommerce grid with no product background cards: compact clipped image stage first, tight category/name/price spacing below, discount badge and bottom-right rating badge plus wishlist/share overlay icons kept inside the image, and only Add/Buy Now as the hover purchase row below price.
- Full storefront route coverage was added to frontend2 to match frontend: products, product detail, categories, category redirect, search, cart, wishlist, checkout, profile, order history, order detail, about, services, contact, FAQ, and policy/support pages.
- A shared ShopProvider now handles stored auth user, login/register modal, cart count, wishlist count, add-to-cart, and wishlist toggling using the existing backend endpoints and localStorage token keys.
- Product cards and product detail actions now call the shared cart/wishlist flow. Unauthenticated users are prompted with the login modal.
- Checkout now loads cart/address data, supports Buy Now query by adding the product to cart, adds new addresses, validates coupons, creates orders, and starts Razorpay checkout when the Razorpay script is available.
- Header overlay now uses a calculated width (`100% - 2rem/4rem`) with centered layout, forcing visible left/right viewport breathing space even near desktop breakpoints.
- Branding section was redesigned as a GSAP-style clean horizontal brand strip: readable logos, five-ish visible on desktop, one-by-one continuous motion, pause on hover, and no spotlight/card-heavy carousel.
- Copied public assets from existing frontend into `frontend2/public` for design use.
- `next.config.ts` allows backend-uploaded images from `http://localhost:5000/uploads/**` and `http://127.0.0.1:5000/uploads/**`.
- Homepage hero orbit category visuals use regular `<img>` tags for API-uploaded images so the banner does not fail if the dev server has not restarted after image config changes.
- Static catalog fallback data was removed from `frontend2`. Homepage, products listing, and product details now rely on backend/API data from admin. If API data is empty, the related section/page stays empty or shows the existing product-not-found/empty state. Cart, wishlist, and checkout remain API-only.
- Auth service includes refresh-on-401 retry support so expired 15-minute access tokens can be refreshed with the stored refresh token before failing the request.
- Login modal includes a login-with-OTP design and is wired to the backend OTP endpoints: `POST /api/auth/otp/send`, `POST /api/auth/otp/resend`, and `POST /api/auth/otp/verify`.
- OTP login is for existing active users by mobile number only. Backend SMS provider integration is still pending real provider keys/API details; development mode can show/log a test OTP.

## Notes
- `gsap` and `lucide-react` were installed in `frontend2`.
- No existing `frontend` source files should be modified for `frontend2` design work.
- For Vercel/design preview, `frontend2` can be deployed independently by setting Vercel root directory to `frontend2`.
- `NEXT_PUBLIC_API_BASE_URL` should point to the backend API when a hosted backend is available. Without a backend, API-bound sections may render empty states because static catalog fallback was intentionally removed.

