# Project Context

## Scope
- Project: Priya's Aqua Fresh Ecommerce Website.
- Frontend path: `D:\priyaAquaFresh\frontend`.
- Backend path: `D:\priyaAquaFresh\backend`.
- Admin path: `D:\priyaAquaFresh\admin`.
- Current backend phase is registration-only API setup; do not add login or other feature APIs until requested.

## Stack
- Next.js App Router, TypeScript, Tailwind CSS.
- Local shadcn-style primitives in `src/components/ui`.
- `lucide-react` for icons.
- `sonner` for toast notifications.
- `next/image` and `next/link` for images and navigation.
- Backend uses Node.js, Express.js, JavaScript, MySQL, `mysql2/promise`, `dotenv`, `cors`, `bcryptjs`, and `express-validator`.

## Implemented In This Phase
- Polished responsive ecommerce homepage.
- Sticky header, announcement bar, desktop nav, category mega menu, mobile menu, search suggestions.
- Header search is icon-triggered; clicking the search icon opens a full-width card below the sticky header.
- Frontend-only cart context with drawer, quantities, subtotal, and remove support.
- Frontend-only wishlist interactions with active heart state.
- Frontend product sharing supports WhatsApp share links from product cards and product detail pages.
- Full-width overlay hero banner, category chips, category grid, featured products, alkaline promo banner, best-selling product grid, commercial solutions, trust features, testimonials, newsletter, and footer.
- Homepage hero uses the static full-width overlay banner with the purifier visual, headline text, and two CTA buttons.
- Reusable navigation, quantity selector, discount badge, product card, skeleton, and UI primitive components.
- Reusable mock data/types under `src/data` and `src/types`.
- Local placeholder product/category visuals under `public/images`; no remote image dependency.
- Header uses the cropped Priya's Aquafresh brand logo from `public/images/brand/priyas-aqua-fresh-logo-cropped.png`.
- Footer also uses the cropped Priya's Aquafresh brand logo.
- Category section uses a clean 2026-style "Shop By Category / Find what you need" layout with six horizontal category cards and a View All link.
- Category filter chips were moved above Featured Products, the `All` option was removed, and clicking a chip filters the displayed products.
- Shop route `/products` exists with header/footer, live product filters, price range controls, mobile filter sheet, sorting, empty state, and reused ProductCard components.
- Desktop Shop filter column itself uses sticky `top-24` behavior without a separate desktop scrollbar; the whole page scrolls naturally while filters remain visible.
- Navbar uses pathname-based active states with teal underline on desktop and subtle active styling in mobile navigation.
- Mock product data now contains 24 products for the Shop listing.
- Added route-safe pages for `/categories`, `/services`, `/contact`, `/about`, `/privacy-policy`, `/terms`, `/shipping-policy`, `/refund-policy`, `/warranty`, `/faqs`, `/cart`, `/checkout`, `/wishlist`, and `/products/[slug]`.
- Header account opens a shared login/register auth modal; mobile Account/Login opens the same modal.
- Services page keeps all services in one route with one shared service request form.
- Footer links now point to implemented routes or `/products?category=...`; homepage category CTAs also route to Shop with category query parameters.
- Wishlist page now renders saved products using the existing ProductCard design and shows a polished empty state when empty.
- Contact form uses labeled fields, full-width message textarea, inline validation, and Sonner success toast.
- Services page has no top service cards; it now uses a minimal service list and one common service request form.
- Testimonials use a 6-item smooth autoplay carousel with responsive 3/2/1 visible cards, dots, arrows, hover pause, and infinite looping.
- Homepage includes one visible GSAP-powered logo showcase section above the newsletter: six real brand logo images are visible in one straight row without background cards, the seventh logo stays hidden until the row shifts, ScrollTrigger starts the sequence, and there is no page-level horizontal scrolling.
- Logo showcase spacing is tightened so the six positions sit closer together, with larger logo image dimensions for clearer visibility.
- Logo showcase heading font was reduced, and the lower logo name/details plus arrow controls were removed from the visible section.
- Logo showcase vertical spacing was tightened so the title, logo row, and following section sit closer together.
- Logo showcase data lives in `src/data/logo-showcase.ts`; downloaded site logos live under `public/images/brands` and `public/images/certifications`.
- The `Trusted Standards & Recognitions` certification showcase is hidden from the homepage for later use; certification assets/data are retained.
- Previous carousel assets and data remain in the project but are no longer used by the active homepage banner.
- Backend registration phase created `backend/src` MVC/layered folders: config, controllers, services, repositories, models, routes, middleware, validators, utils, and database.
- Backend schema is centralized at `backend/src/database/schema.sql` and currently creates only the `users` table.
- Users table supports `CUSTOMER`, `DEALER`, and `ADMIN` roles, but public `POST /api/auth/register` always creates `CUSTOMER` users and ignores any frontend/manual role value.
- Registration stores `password_hash` only, uses duplicate email/mobile checks, returns safe user data, and includes `GET /api/health` for basic server verification.
- Existing frontend registration modal is connected through `src/services/auth-service.ts` using `NEXT_PUBLIC_API_BASE_URL`; no role selector was added.
- Registration password validation now accepts a simple 4-digit numeric password, and the registration password/confirm password fields include eye toggle controls.
- MySQL database `priyas_aqua_fresh` has been created locally and currently contains only the `users` table from `backend/src/database/schema.sql`.

## Validation Notes
- `npm.cmd run build` passed before the latest refactor.
- `npm.cmd run lint` passed before the latest refactor.
- After user instruction on August 8, 2026 not to build or run, no further build/dev-server validation should be performed unless explicitly requested.
- Latest search/header change was made without running build or dev server, per user request.
- Latest Shop page and active-navbar changes were made without running build, lint, or dev server, per user request.
- Route/auth/services implementation lint passed with `npm.cmd run lint`.
- Wishlist/contact/services/testimonial update lint passed with `npm.cmd run lint`; no build was run.
- Hero banner was reverted back to the previous static overlay version without running build, lint, or dev server, per user request.
- Logo showcase section was changed to a GSAP ScrollTrigger composition without running build, lint, or dev server, per user request.
- Logo showcase sizing/spacing and six-logo row behavior were adjusted without running build, lint, or dev server, per user request.
- Certification showcase hiding was done without running build, lint, or dev server, per user request.
- Logo showcase heading/control cleanup was done without running build, lint, or dev server, per user request.
- Logo showcase vertical spacing cleanup was done without running build, lint, or dev server, per user request.
- Backend registration API and frontend registration integration were implemented without running install, database initialization, backend server, frontend lint, build, or dev server, per user request.
- MySQL database/table initialization was later run manually through MySQL CLI; verification showed database `priyas_aqua_fresh` exists and only `users` table is present.
- Registration password validation and password eye toggles were updated without running build, lint, or dev server.
- WhatsApp product share UI was added without running build, lint, or dev server.
- Best Selling Products was changed from horizontal carousel mode to a responsive grid to remove the section scrollbar.

## Explicit Non-Goals
- No backend APIs.
- No database integration.
- No Razorpay/payment integration.
- No authentication backend.
- No admin panel changes.
