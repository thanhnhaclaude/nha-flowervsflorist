# FlowerVsFlorist — Design System (Master)

Direction: **vibrant mass-market florist** (1-800-Flowers / FTD energy) with an editorial serif for warmth. Conversion-first: strong CTA repetition, urgency (same-day countdown), trust signals near every purchase decision.

Tokens live in `src/app/globals.css` (`@theme`). Never hard-code hex values in components.

## Color

| Token | Hex | Use |
|---|---|---|
| `plum-600` | #7a1f5c | Brand, headings, secondary buttons, selected states |
| `plum-700/800/900` | #63184a / #4d1239 / #340b26 | Promo bar, footer, overlays |
| `rose-600` / `rose-700` | #e11d48 / #be123c | Primary CTA (Add to cart, Checkout) and its hover |
| `blush` / `petal` | #fff5f8 / #fde8f0 | Section backgrounds, tiles |
| `gold` | #f5a524 | Accents, stars, bullet dots (never text on white) |
| `leaf` / `leaf-soft` | #15803d / #e8f6ec | Same-day delivery, success, free-delivery meter |
| `ink` / `muted` | #2a1520 / #6b5560 | Body text (both ≥ 4.5:1 on white) |
| `line` | #f0e2e9 | Borders, dividers |

## Typography

- Display: **Playfair Display** (`font-display`) for h1–h3, prices on hero cards, logo
- Body/UI: **Nunito Sans** (`font-sans`), 16px base, line-height 1.6
- Eyebrows: 12px, 800 weight, 0.14em tracking, uppercase, `rose-600`

## Components

- Buttons: `.btn` + `.btn-primary | .btn-plum | .btn-outline | .btn-white`, pill shape, min-height 48px (40px for `.btn-sm`)
- Inputs: `.field` (48px, 1.5px border, plum focus ring), `.label`, `.error-text` next to the field
- Cards: `.card` (radius 1.25rem, soft plum shadow); product images 4:5, category tiles 1:1, blog covers 7:4
- Containers: `.container-x` (max 1320px, 16px gutter on mobile, 24px from md)

## Motion

- 200–300ms color/transform transitions; image zoom on hover (scale 1.04–1.05, 500ms)
- `animate-fade-up` for hero/menus, `animate-slide-in` for the cart drawer, marquee promo bar
- All motion is disabled under `prefers-reduced-motion`

## Rules

- SVG icons only (lucide-react), no emoji icons
- Touch targets ≥ 44px; visible focus ring (`:focus-visible` rose outline)
- Show ratings only from approved real reviews; compare-at prices only when they are genuine previous prices
- Every page: one h1, breadcrumbs on deep pages, JSON-LD where relevant
