---
name: build-admin
description: Build or extend the Zaravan store-owner admin panel — dashboard, product and stock management, order management and status changes, customer list.
disable-model-invocation: true
argument-hint: "[optional: dashboard | products | orders | customers]"
---

# /build-admin $ARGUMENTS

Goal: the family can run the store without a developer — edit products, prices, stock, and move orders through fulfilment (`Business.md` §8: "update without a developer").

1. **Preconditions.** Supabase foundation with `is_admin()` and admin RLS policies on `products`, `orders`, `order_items`, `profiles`. Missing → `/setup-supabase` or `supabase-architect`, then stop.
2. **Gate first.** `app/admin/layout.tsx` calls `requireAdmin()`; non-admins get `notFound()`. Build and review this gate before any admin page.
3. **Slices** (only `$ARGUMENTS` if given, else in order, checking in between):
   1. `orders` — list filtered by status, detail, advance status along the lifecycle in `commerce-rules`, cancel with confirmation
   2. `products` — list, edit name/description/price/stock/active; Signature-line price change needs explicit confirm; no discount fields
   3. `dashboard` — counts by order status, orders awaiting dispatch (24 h promise), low stock
   4. `customers` — read-only list with order count and lifetime total, link to their orders
4. **Implement** with the `panel-engineer` agent; schema/policy changes → `supabase-architect`.
5. **Review** — `security-reviewer` is mandatory on every admin slice (gate on page *and* action, no data leak to customers). `design-reviewer` for tables, density, a11y.
6. **Verify** `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`; if possible check that a non-admin test user gets a 404 on `/admin` and on direct action calls.
7. **Report** done / next.
