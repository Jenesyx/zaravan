---
name: build-basket
description: Build or extend the Zaravan basket — add-to-basket, cart drawer, basket page, guest cart with merge on sign-in, shipping threshold, checkout ending in a pending_payment order.
disable-model-invocation: true
argument-hint: "[optional: the slice to build, e.g. drawer | merge | checkout]"
---

# /build-basket $ARGUMENTS

Goal: a working basket per the `commerce-rules` skill and `Design.md` §5.5 / §9.3.

1. **Preconditions.** `lib/supabase/` and the `cart_items` / `orders` / `place_order` schema must exist. If not, tell the user to run `/setup-supabase` first and stop.
2. **Plan the slice.** If `$ARGUMENTS` names a slice, do only that. Otherwise build in this order, one slice per pass, checking in with the user between slices:
   1. `lib/cart/` pure logic + guest cart provider + "Add to basket" on the product carousel and product dialog in `components/sections/products.tsx`
   2. Nav basket button with live count + cart drawer
   3. Signed-in cart in `cart_items` + merge on sign-in
   4. `/basket` page
   5. `/checkout` — address (reuse saved addresses when signed in), review, place order → confirmation page
3. **Schema gaps** found along the way → `supabase-architect` agent.
4. **Implement** the slice with the `cart-engineer` agent. Give it the slice, the files it should touch, and what's already built.
5. **Review** in parallel: `security-reviewer` (money, server trust, RLS) and `design-reviewer` (drawer spec, restrained motion, a11y). Fix blockers/critical/high, then re-run the reviewer that flagged them.
6. **Verify** `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`. If the dev server can run, add an item, change quantity, cross the $75 threshold, reload (guest persistence), with reduced motion on.
7. **Report** what works, what's stubbed (payment), and the next slice.
