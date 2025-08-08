## Relevant Files

- `package.json` - Add Next.js, React, TypeScript, Tailwind, Stripe, Supabase dependencies and scripts.
- `next.config.js` - Next.js configuration.
- `tsconfig.json` - TypeScript configuration.
- `postcss.config.js` - PostCSS config for Tailwind.
- `tailwind.config.ts` - Tailwind configuration.
- `app/globals.css` - Global styles (migrate from `styles.css`).
- `public/images/**` - Existing image assets (migrate/retain from current `/images/**`).
- `app/(site)/layout.tsx` - Root layout for the site.
- `app/(site)/page.tsx` - Home page (migrated from `index.html`).
- `app/gallery/page.tsx` - Gallery page (migrated from `gallery.html`).
- `app/shop/page.tsx` - Shop page (SSR list of products, buy button / sold state).
- `app/admin/page.tsx` - Admin dashboard with password gate and product management UI.
- `components/product-card.tsx` - Product card UI for `/shop`.
- `components/admin/product-form.tsx` - Form for creating/editing products.
- `components/admin/product-list.tsx` - Admin list/table of products with controls.
- `lib/stripe.ts` - Stripe server SDK initialization and helpers.
- `lib/supabase/server.ts` - Supabase server client using service role key.
- `lib/auth/session.ts` - Admin password verification and cookie session helpers.
- `lib/gallery-assets.ts` - Helper to list available gallery images from `public/images/gallery/**`.
- `middleware.ts` - Optional: protect `/admin` and admin APIs by session check.
- `app/api/admin/products/route.ts` - Admin list/create products API.
- `app/api/admin/products/[id]/route.ts` - Admin update/delete product API.
- `app/api/checkout/route.ts` - Create Stripe Checkout Session.
- `app/api/stripe/webhook/route.ts` - Stripe webhook to mark products as sold.

### Notes

- Environment variables (Vercel): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Currency: GBP; VAT included; free shipping (no shipping rates).
- Inventory: originals, quantity 1; mark sold on webhook.
- Admin selects images only from `public/images/gallery/**` (no uploads).
- Prefer Server Components and server actions; keep client components small.

## Tasks

- [ ] 1.0 Initialize Next.js (App Router) and migrate current static site
  - [x] 1.1 Add dependencies: `next`, `react`, `react-dom`, `typescript`, `@types/node`, `tailwindcss`, `postcss`, `autoprefixer`, `stripe`, `@supabase/supabase-js`.
  - [x] 1.2 Initialize TypeScript: add `tsconfig.json` (use Next.js defaults) and configure strict mode.
  - [x] 1.3 Initialize Tailwind: add `postcss.config.js`, `tailwind.config.ts`, and `app/globals.css`; import globals in root layout.
  - [x] 1.4 Create Next.js `app` directory with `(site)/layout.tsx` and a basic header/footer.
  - [x] 1.5 Migrate static assets from `images/**` to `public/images/**` (preserve directory structure `gallery/desktop|tablet|mobile`).
  - [x] 1.6 Convert `index.html` to `app/(site)/page.tsx` with equivalent content, replacing inline scripts with React/client comps where needed.
  - [x] 1.7 Convert `gallery.html` to `app/gallery/page.tsx` rendering the current gallery using responsive `<picture>` sources.
  - [ ] 1.8 Migrate `styles.css` into Tailwind classes and/or `app/globals.css` (keep custom styles as needed).
  - [x] 1.9 Implement a shared `components/site-nav.tsx` with links: Home, Gallery, Shop.
  - [x] 1.10 Add Next.js redirects: `/index.html` -> `/` and `/gallery.html` -> `/gallery` in `next.config.js`.
  - [ ] 1.11 Remove `vercel.json` static configuration once Next.js routes are in place.
  - [ ] 1.12 Smoke-test local dev: `pnpm|npm run dev` loads home and gallery with images.
  - [ ] 1.2 Initialize TypeScript: add `tsconfig.json` (use Next.js defaults) and configure strict mode.
  - [ ] 1.3 Initialize Tailwind: add `postcss.config.js`, `tailwind.config.ts`, and `app/globals.css`; import globals in root layout.
  - [ ] 1.4 Create Next.js `app` directory with `(site)/layout.tsx` and a basic header/footer.
  - [ ] 1.5 Migrate static assets from `images/**` to `public/images/**` (preserve directory structure `gallery/desktop|tablet|mobile`).
  - [ ] 1.6 Convert `index.html` to `app/(site)/page.tsx` with equivalent content, replacing inline scripts with React/client comps where needed.
  - [ ] 1.7 Convert `gallery.html` to `app/gallery/page.tsx` rendering the current gallery using responsive `<picture>` sources.
  - [ ] 1.8 Migrate `styles.css` into Tailwind classes and/or `app/globals.css` (keep custom styles as needed).
  - [ ] 1.9 Implement a shared `components/site-nav.tsx` with links: Home, Gallery, Shop.
  - [ ] 1.10 Add Next.js redirects: `/index.html` -> `/` and `/gallery.html` -> `/gallery` in `next.config.js`.
  - [ ] 1.11 Remove `vercel.json` static configuration once Next.js routes are in place.
  - [ ] 1.12 Smoke-test local dev: `pnpm|npm run dev` loads home and gallery with images.

- [ ] 2.0 Set up Supabase schema and secure server integration
  - [x] 2.1 Create `lib/supabase/server.ts` that instantiates an Admin client using `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only).
  - [ ] 2.2 Define SQL for `products` table with fields:
    - `id uuid pk`, `name text not null`, `dimensions_w_cm int not null`, `dimensions_h_cm int not null`, `dimensions_label text not null`, `type text not null`, `price_gbp_pennies int not null`, `notes text`, `image_path text not null unique`, `is_for_sale boolean not null default false`, `is_sold boolean not null default false`, `stripe_product_id text`, `stripe_price_id text`, timestamps.
  - [ ] 2.3 Apply RLS with policies: deny all by default; API uses service role key (no client-side Supabase writes/read for admin paths).
  - [x] 2.4 Create minimal data access helpers in `lib/db/products.ts` (getForSale, getAll, create, update, delete, markSold).
  - [ ] 2.5 Seed one example product (optional) for local testing.

- [ ] 3.0 Implement admin authentication and product management UI
  - [x] 3.1 Create `lib/auth/session.ts` with helpers to set/get/clear an HTTP-only, Secure, signed cookie (e.g., HMAC using a secret or rely on a random token stored in-memory for dev; MVP can store a signed flag only).
  - [x] 3.2 Create `app/api/admin/login/route.ts` that validates the submitted password against `ADMIN_PASSWORD` and sets the cookie.
  - [x] 3.3 Create `app/api/admin/logout/route.ts` to clear the cookie.
  - [x] 3.4 Add `middleware.ts` to protect `/admin` and `/api/admin/*` by checking the session cookie; redirect to `/admin` login view if missing.
  - [x] 3.5 Implement `app/admin/page.tsx`:
    - [ ] 3.5.1 If not authenticated: render password form that POSTs to `/api/admin/login`.
    - [ ] 3.5.2 If authenticated: render dashboard with product list and create/edit form.
  - [x] 3.6 Build `components/admin/product-form.tsx` with fields: Name, Dimensions (W×H), Type, Price (GBP), Notes, and Image Path selector.
  - [x] 3.7 Implement image selector: `lib/gallery-assets.ts` lists files under `public/images/gallery/desktop/*.webp`; UI allows picking one and stores its path.
  - [x] 3.8 Create admin APIs:
    - [x] 3.8.1 `app/api/admin/products/route.ts` (GET list, POST create).
    - [x] 3.8.2 `app/api/admin/products/[id]/route.ts` (PATCH update, DELETE remove, POST `mark-sold` optional or within PATCH).
  - [ ] 3.9 Validate inputs server-side; coerce price to pennies; compute `dimensions_label` from W×H inputs.

- [ ] 4.0 Build `/shop` page with SSR, responsive images, and sold state
  - [x] 4.1 Implement `components/product-card.tsx` displaying image (responsive `<picture>`), name, dimensions/type, formatted price, Buy button.
  - [x] 4.2 Server-render `app/shop/page.tsx` loading `is_for_sale` products; include `Sold` overlay and disabled Buy when `is_sold`.
  - [x] 4.3 Add success/canceled banners based on URL params; clearable by user.
  - [x] 4.4 Format prices as GBP (e.g., `£1,200`).
  - [ ] 4.5 Basic empty/error states for data loading.

- [ ] 5.0 Integrate Stripe Checkout and webhook to mark items as sold
  - [x] 5.1 Add `lib/stripe.ts` to initialize Stripe with `STRIPE_SECRET_KEY`.
  - [x] 5.2 Implement `app/api/checkout/route.ts`:
    - [ ] 5.2.1 Validate product id; reject if not for sale or already sold.
    - [ ] 5.2.2 Create Checkout Session with `price_data` (GBP), quantity 1; set `success_url` `/shop?success=1&session_id={CHECKOUT_SESSION_ID}` and `cancel_url` `/shop?canceled=1`.
    - [ ] 5.2.3 Include `product_id` in `metadata` for webhook correlation.
    - [ ] 5.2.4 Return the session URL; client redirects.
  - [x] 5.3 Implement `app/api/stripe/webhook/route.ts` verifying signature with `STRIPE_WEBHOOK_SECRET`.
  - [x] 5.4 On `checkout.session.completed`, read `metadata.product_id`, update DB: set `is_sold=true`, `is_for_sale=false`.
  - [ ] 5.5 Idempotency: guard against duplicate events (e.g., store processed event id or rely on UPSERT semantics).
  - [ ] 5.6 Manual QA: create product, buy via Stripe test mode, confirm webhook marks item sold.

- [ ] 6.0 Configure deployment, environment variables, and navigation updates
  - [ ] 6.1 Add `Shop` link in `components/site-nav.tsx` for all pages.
  - [ ] 6.2 Create `next.config.js` redirects for legacy `.html` paths.
  - [ ] 6.3 Prepare `.env.local.example` documenting required env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
  - [ ] 6.4 Configure Vercel project env vars and set the webhook endpoint in Stripe dashboard (or via CLI).
  - [ ] 6.5 Update sitemap if present to include `/shop` (optional) and ensure `/admin` is excluded from any links.
  - [ ] 6.6 Final QA pass: nav works, images load, `/shop` lists products, checkout flow completes, webhook marks sold.



