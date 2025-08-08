# PRD: Shop and Admin (Stripe) for Paintings by Kay

## 1. Overview

Enable customers to purchase selected paintings from the gallery via Stripe Checkout. Add a password-protected admin page at `/admin` (not linked anywhere) to select which existing images are for sale and manage product details. Display all items for sale on a new `/shop` page, also added to the main navigation.

This feature includes migrating the site to Next.js (App Router) hosted on Vercel, integrating Supabase as the data store for products, and Stripe for payments plus a webhook to mark items as sold.

## 2. Goals

- Allow the admin to publish products for sale using existing gallery assets.
- Provide a public `/shop` page listing items for sale with clear pricing and sold status.
- Process payments via Stripe Checkout (GBP, VAT included, free shipping).
- Mark items as sold after successful payment via Stripe webhook.
- Keep `/admin` gated behind a single shared password (MVP) and unlinked from the site.
- Maintain current look-and-feel; minimal design additions for Shop/Admin.

## 3. User Stories

- As a visitor, I can view a list of paintings for sale with their details and price.
- As a visitor, I can purchase a painting using Stripe Checkout.
- As a visitor, I can see when a painting is already sold (and cannot buy it).
- As an admin, I can log in with a single password at `/admin`.
- As an admin, I can select an existing image from `images/gallery/**` and create a product for sale.
- As an admin, I can set Name, Dimensions (W×H), Type, Price, and optional Notes.
- As an admin, I can mark an item as for sale or sold, and edit/delete products.

## 4. Functional Requirements

1. Migration and Routing
   1.1 Migrate to Next.js (App Router) on Vercel, preserving current pages and styles.
   1.2 Add routes: `/shop` (public), `/admin` (password-gated), and API routes for products, checkout, and Stripe webhook.
   1.3 Add `Shop` to the navigation in both locations currently showing nav (existing home and gallery pages).

2. Admin Authentication (MVP)
   2.1 `/admin` shows a password form if not authenticated.
   2.2 Compare against `ADMIN_PASSWORD` env var on the server; on success set an HTTP-only, Secure cookie session (e.g., 12 hours).
   2.3 Protect admin UI and admin API routes by verifying the session cookie.

3. Admin Product Management
   3.1 Admin can browse/select images from existing `images/gallery/**` assets (desktop/mobile/tablet versions). The selected image path will be saved as the canonical product image (use desktop variant for display; provide responsive sources on the shop page).
   3.2 Admin can create a product with fields:
       - Name (required)
       - Dimensions (W×H, e.g., 60×40 cm) (required)
       - Type (required; e.g., Acrylic on canvas)
       - Price (GBP, VAT included) (required)
       - Notes (optional)
       - Image Path (required; chosen from existing assets)
   3.3 Admin can edit product details and toggle `For Sale` on/off.
   3.4 Admin can mark a product as Sold.
   3.5 Admin can delete a product (hard delete) if never sold.

4. Product Data and Storage (Supabase)
   4.1 Use Supabase as the product data store. Server-side API routes will use the Supabase service key; never expose it to the browser.
   4.2 Minimal schema (suggested):
       - `id` (uuid, pk)
       - `name` (text, not null)
       - `dimensions_w_cm` (int, not null)
       - `dimensions_h_cm` (int, not null)
       - `dimensions_label` (text, not null, e.g., "60×40 cm")
       - `type` (text, not null)
       - `price_gbp_pennies` (int, not null)
       - `notes` (text, nullable)
       - `image_path` (text, not null, unique)
       - `is_for_sale` (boolean, not null, default false)
       - `is_sold` (boolean, not null, default false)
       - `stripe_product_id` (text, nullable)
       - `stripe_price_id` (text, nullable)
       - `created_at` (timestamptz, default now())
       - `updated_at` (timestamptz, default now())
   4.3 RLS can be enabled with policies that deny all by default; admin operations happen only through server routes using the service role key.

5. Shop Page
   5.1 `/shop` lists items where `is_for_sale = true` and shows `Sold` overlay for `is_sold = true` (those should not be purchasable).
   5.2 Product card: image, name, dimensions/type, price, and a "Buy" button when available.
   5.3 Clicking "Buy" calls a server API to create a Stripe Checkout Session and redirects the user.
   5.4 SEO-friendly SSR/metadata; responsive layout; maintain existing aesthetic.

6. Checkout and Payment (Stripe)
   6.1 Currency: GBP; prices include VAT; free shipping.
   6.2 Server route creates a Stripe Checkout Session for quantity 1 using `price_data` from the product (do not trust client price).
   6.3 Success URL: `/shop?success=1&session_id={CHECKOUT_SESSION_ID}`; Cancel URL: `/shop?canceled=1`.
   6.4 Webhook at `/api/stripe/webhook` listens for `checkout.session.completed` and marks the item as sold (`is_sold=true`, `is_for_sale=false`).
   6.5 If a sold item is attempted for purchase, the server must reject session creation and return an error to the client.

7. Image Handling
   7.1 Leverage existing `images/gallery/` assets. Use desktop variant for Checkout image URL; use `<picture>` with WebP sources on `/shop` for responsive loading.
   7.2 Optionally generate a manifest or server-side list of gallery assets for the admin selector.

8. Navigation
   8.1 Add `Shop` to the nav on the homepage and gallery page.

9. Error and Edge Cases
   9.1 Handle race conditions: if two sessions initiate for the same item, both might complete. MVP acceptance: low probability; webhook will mark sold; subsequent admin visibility shows sold. Future enhancement: add `reserved_until` to block parallel purchases.
   9.2 Graceful error states on `/shop` (failed load, checkout creation error) and `/admin` (validation, save errors).

## 5. Non-Goals

- Multi-user admin accounts, roles, or OAuth.
- Multiple quantities per item or variants.
- Shipping calculations, taxes beyond included VAT, or address-dependent logic.
- File uploads for new images (admin is limited to selecting existing assets).
- Discount codes, gift cards, or multi-currency.

## 6. Design Considerations

- Keep typography and styling consistent with current site.
- Product card layout: image top, name + dimensions/type, price, Buy button; when sold, show overlay and disable Buy.
- Admin: simple, form-based UI; table/list of products with edit controls.
- Accessibility: alt text from product name; clear sold state.

## 7. Technical Considerations

- Next.js (App Router) structure:
  - `app/(site)/page.tsx` (home), `app/gallery/page.tsx`, `app/shop/page.tsx`, `app/admin/page.tsx`.
  - API routes: `app/api/products/*`, `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`.
- Admin auth: Password check against `ADMIN_PASSWORD` in a server action or route; set signed, HTTP-only cookie; middleware can protect `/admin` and `/api/admin/*` if needed.
- Supabase: Use service role key server-side only. Prefer server components / server actions for admin mutations.
- Stripe: Use `STRIPE_SECRET_KEY` for session creation and `STRIPE_WEBHOOK_SECRET` for verification. Include absolute image URLs in Checkout.
- Environment variables (Vercel): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Image listing for admin: generate at runtime from `public/images/gallery/**` or ship a JSON manifest generated at build.
- Deployment: Continue on Vercel; ensure webhook route is configured and accessible; verify build output.

## 8. Success Metrics

- Admin can create and publish at least one product using existing images.
- `/shop` shows published items with correct pricing and sold states.
- Stripe Checkout completes and webhook marks the item as sold.
- Sold items are no longer purchasable and display a "Sold" overlay.
- Nav includes `Shop` and links correctly.

## 9. Open Questions

- Confirm display format for Type (e.g., "Acrylic on canvas").
- Confirm desired price formatting (e.g., `£1,200`).
- Should admin receive an email notification on sale? (Out of scope for MVP unless requested.)
- Should we show sold items on `/shop` (grayed out) or hide them? (MVP: show grayed out.)


