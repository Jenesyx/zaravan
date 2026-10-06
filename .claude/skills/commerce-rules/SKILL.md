---
name: commerce-rules
description: Zaravan store business rules — catalogue, prices, money handling, shipping, cart limits, order lifecycle, checkout stub. Use whenever code touches products, prices, the basket, orders, shipping, checkout, or the admin catalogue.
user-invocable: false
paths:
  - "lib/data/**"
  - "lib/cart/**"
  - "lib/orders/**"
  - "app/(shop)/**"
  - "app/account/**"
  - "app/admin/**"
  - "components/cart/**"
  - "supabase/**"
---

# Zaravan commerce rules

Source of truth is `Business.md`. When a rule here and `Business.md` disagree, `Business.md` wins — stop and tell the user.

## Catalogue

- Ten retail SKUs, `Business.md` §3.2. Today they live in `lib/data/products.ts`; once Supabase is in, the `products` table is canonical and `lib/data/products.ts` becomes the seed only.
- Product identity is the existing slug (`signature-vial`, `kitchen-large`, …). Keep slugs stable — they are URLs and cart keys.
- Gift Box (SKU 9) has no per-gram price (`pricePerGram: null`). Never compute or display `$/g` for it.
- Chef / Trade 50 g (SKU 10) is purchasable. The wholesale ladder (100 g – 1 kg) is **quote only, trade accounts only** — never add it to the basket.
- **Never discount the Signature line.** No percentage codes that apply to Signature SKUs. Value goes through bundles and the gift box (`Business.md` §3.2 pricing logic).

## Money

- Store and compute money as **integer cents** (`price_cents`). Format only at render time. The current `price: number` (whole dollars) in `lib/data/products.ts` converts as `price * 100`.
- Currency is USD only until the user decides otherwise.
- **The client never sends a price.** The basket sends `{ slug, quantity }`; the server reads prices from the `products` table and recomputes every total. Any total shown client-side is a preview.

## Shipping (`Business.md` §4)

- Free over **$75** subtotal; otherwise flat **$12** worldwide. Threshold compares subtotal in cents: `subtotal_cents > 7500`.
- Duties are DDP for EU, UK, US, CA — state "duties and taxes included" plainly at basket and checkout.
- Basket UI shows distance to free shipping when under threshold ("$X from free shipping").
- Returns: 30 days unopened. Dispatch within 24 h, Sunday–Thursday.

## Basket

- Quantity per line: integer 1–10. Remove the line at 0. Clamp, don't error.
- Guest basket lives client-side (localStorage key `zaravan.cart.v1`, shape `{ items: { slug, quantity }[] }`); signed-in basket lives in Supabase `cart_items`. On sign-in, merge guest into server (sum quantities, clamp) then clear local.
- Inactive or out-of-stock products stay visible in the basket, marked unavailable, and are excluded from totals and checkout.

## Orders

- Statuses: `pending_payment` → `paid` → `packed` → `shipped` → `delivered`; side exits `cancelled`, `refunded`. Only admins move status past `pending_payment`.
- `order_items` snapshot `name`, `grade`, `weight`, `unit_price_cents` at order time — later catalogue edits never rewrite history.
- Shipping address is snapshotted onto the order, not referenced.

## Checkout — stubbed on purpose

Payment processing is **unresolved** (`Business.md` §5: most PSPs restrict Iranian-origin goods). Until the user names a processor:

- Checkout creates an order in `pending_payment` and shows a confirmation that says payment is not yet connected.
- Do **not** install or wire Stripe, PayPal, Shopify Payments, or any PSP SDK. Ask first.

## Reviews and testimonials

Testimonial copy in `lib/data/testimonials.ts` is tone reference only (`Business.md` §7.4). Any review feature must store reviews tied to a real delivered order — never seed fabricated reviews into the database.
