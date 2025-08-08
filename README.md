# Paintings by Kay (Next.js)

Modern Next.js App Router site for Kay Duff’s artwork. Server-rendered pages, Stripe Checkout, and an admin dashboard for managing products.

## Tech Stack
- Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- Stripe (Checkout + webhook)
- Postgres (Neon or compatible) via `pg`

## Local Development
1. Copy `.env.local` and set required variables:
   - `ADMIN_PASSWORD` — password for `/admin`
   - `DATABASE_URL` — Postgres connection string
   - `STRIPE_SECRET_KEY` — Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://www.paintingsbykay.co.uk` (no trailing slash)
2. Install deps and run dev server:
   - `npm install`
   - `npm run dev`

## Routes
- `/` — Home
- `/gallery` — Responsive gallery with fullscreen client behavior
- `/shop` — SSR products for sale; integrates Stripe Checkout
- `/admin` — Password-gated admin (create/publish/hide/sold/delete)

### API
- `POST /api/checkout` — creates Stripe Checkout Session
- `POST /api/stripe/webhook` — marks item sold on successful payment
- `GET/POST /api/admin/products` — list/create products (auth via cookie + middleware)
- `PATCH/DELETE /api/admin/products/[id]` — update/delete product

## Deployment (Vercel)
1. Project Settings → General
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
2. Project Settings → Environment Variables
   - Set all vars from the Local Development section
3. Project Settings → Domains
   - Add and assign: `www.paintingsbykay.co.uk` and `paintingsbykay.co.uk` to THIS project
   - Choose a primary (e.g., `www`) and configure redirect from the other to it
4. DNS (at registrar)
   - `www` CNAME → `cname.vercel-dns.com`
   - Apex `@` A/ALIAS → `76.76.21.21`
5. Redirects
   - Legacy static files removed. Ensure there is NO redirect of `/` → `/index.html`
   - Next.js redirects are defined in `next.config.js` for `/index.html` and `/index` → `/`
6. Redeploy and Invalidate Cache to pick up changes

### Stripe
- Set the production webhook URL in Stripe Dashboard: `https://www.paintingsbykay.co.uk/api/stripe/webhook`
- Use test card details for testing in Stripe Test Mode

## Notes
- Service worker is not configured; `GET /sw.js 404` is expected
- Static legacy files `index.html` and `gallery.html` were removed to avoid routing conflicts

## Troubleshooting
- 404 at custom domain but preview URL works: the domain isn’t assigned to this project or has a conflicting redirect. Assign the domain(s) to this project in Vercel → Domains and remove any `/index.html` forwarding.