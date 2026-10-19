# FlowerVsFlorist — flowervsflorist.com

E-commerce flower shop with same-day delivery across the USA. Operated by **M&R Marketing Group, LLC**, 331 3rd Street, Macon, GA 31201.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · MySQL + Drizzle ORM · Stripe Checkout · Nodemailer (SMTP)

## Features

- **Storefront:** 47 products, 25 SEO category pages (occasions, flower types, collections), product pages with sizes (Standard/Deluxe/Premium) and add-ons, filters and sorting, search, wishlist
- **Checkout:** delivery date picker with same-day cut-off (2 PM ET weekdays, 12 PM weekends), delivery windows, free card message, promo codes, Stripe Checkout (Apple Pay / Google Pay), "pay later" mode when Stripe isn't configured
- **Customers:** accounts, order history, saved addresses, wishlist sync, order tracking
- **Content & SEO:** blog (8 articles), 51 state landing pages (`/flower-delivery/[state]`), JSON-LD (Florist, Product, Breadcrumb, FAQ, BlogPosting), sitemap.xml, robots.txt, canonical URLs
- **Admin (`/admin`):** dashboard, orders (status updates + customer emails), products (with image upload), coupons, blog posts, review moderation, messages, subscribers (CSV export), customers
- **Emails:** order confirmation, new-order alert, status updates, newsletter welcome (WELCOME10), contact form

## Local development

```bash
npm install
npm run db:local        # terminal 1: throwaway MySQL on port 3307 (keep open)
cp .env.example .env    # set DATABASE_URL="mysql://root@127.0.0.1:3307/flowervsflorist"
npm run dev             # tables + catalog are created automatically on first start
```

Admin password hash: `npm run hash-password -- "your-long-password"` → put the output in `ADMIN_PASSWORD_HASH`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js dev server / production build / production server |
| `npm run db:setup` | Create tables and seed the catalog (also runs automatically at server start) |
| `npm run db:generate` | Generate a new migration after editing `src/lib/db/schema.ts` |
| `npm run export-sql` | Back up the database to `deploy/database.sql.gz` |
| `npm run fetch-images` | Re-download the Unsplash catalog photos into `public/images` |
| `npm run hash-password -- "pw"` | Create `ADMIN_PASSWORD_HASH` |

## Project structure

```
src/app/(site)/        storefront pages      src/data/       seed catalog, categories, blog, policies
src/app/admin/         admin panel           src/lib/        db, auth, pricing, delivery rules, mailer, Stripe
src/app/api/           checkout, webhook…    drizzle/        SQL migrations
src/components/        UI components         public/images/  product & brand photos (WebP)
```

Deployment (Vietnamese): see [HUONG-DAN-DEPLOY-HOSTINGER.md](HUONG-DAN-DEPLOY-HOSTINGER.md).

## Image credits

Photography from [Unsplash](https://unsplash.com) under the Unsplash License (free for commercial use). Replace with the shop's own product photos when available — upload them in Admin → Products.
