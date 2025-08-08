# Resume Note (Do NOT push yet)

## Current state

- Next.js App Router in place with route group `app/(site)/…`; home and gallery styled to match legacy (Quicksand, 16px body, 24px headings, dark grey, centered hero).
- Images moved to `public/images/**`; logo uses WebP (`/images/logos/logo-transparent.webp`).
- Shop scaffolded at `app/(site)/shop/page.tsx`.
- Admin implemented (password gate at `/admin`), with product create/edit/list, gallery image picker.
- Stripe checkout + webhook implemented; webhook marks item as sold.
- Data uses Neon Postgres via `DATABASE_URL` with `pg` (no Supabase). Table auto-creation handled by app on first use.
- Tasks list mostly complete; pending: 6.4 (set Stripe webhook URL in dashboard) and 6.6 (final QA).

## Known items to revisit

- Gallery fullscreen implemented via client script:
  - Files: `app/(site)/gallery/page.tsx`, `app/(site)/gallery/fullscreen-client.tsx`, `app/(site)/gallery/FullscreenMount.tsx`.
  - Behavior: click opens fullscreen; overlay click or Esc closes.
- Ensure per-route layouts are NOT recreated by Next for gallery/shop; both now live under `app/(site)/…` to inherit the main layout. If `app/admin/layout.tsx` gets auto-created, consider deleting it or moving admin to `app/(site)/admin`.
- `sw.js` 404s are expected (no service worker configured).

## Environment/config

- Required: `ADMIN_PASSWORD`, `DATABASE_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`.
- Optional/unused: `STRIPE_PUBLIC_KEY`, `PG*`/`POSTGRES_*`, `NEXT_PUBLIC_STACK_*`, `STACK_SECRET_SERVER_KEY`.
- Production Stripe webhook URL to set later: `https://www.paintingsbykay.co.uk/api/stripe/webhook` (for local use Stripe CLI).

## Local test flow

- `npm run dev` then visit:
  - `/` (restored hero/about/featured/contact with Quicksand)
  - `/gallery` (grid + fullscreen click)
  - `/admin` (login with `ADMIN_PASSWORD`; create product, publish/hide/sold/delete)
  - `/shop` (published products; Buy opens Stripe Checkout)
- After a test purchase (Stripe CLI + test card), webhook marks item Sold; UI should reflect sold state.

## Key files

- Layout/Styling: `app/(site)/layout.tsx`, `app/globals.css`, `styles.css`
- Gallery: `app/(site)/gallery/page.tsx`, `app/(site)/gallery/fullscreen-client.tsx`, `app/(site)/gallery/FullscreenMount.tsx`
- Shop: `app/(site)/shop/page.tsx`, `components/product-card.tsx`, `components/product-buy-button.tsx`
- Admin: `app/admin/page.tsx`, `app/admin/ui/*`, `middleware.ts`
- API: `app/api/admin/**`, `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`
- DB: `lib/db/pg.ts`, `lib/db/products.ts`, `lib/types/product.ts`
- Stripe: `lib/stripe.ts`
- Tasks/PRD: `tasks/tasks-prd-shop-and-admin-stripe.md`, `tasks/prd-shop-and-admin-stripe.md`

## Do not push yet

- Do not push commits to GitHub until local QA passes. Next steps: set Stripe webhook in dashboard (6.4), perform full QA (6.6).



