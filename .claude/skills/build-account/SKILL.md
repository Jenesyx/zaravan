---
name: build-account
description: Build or extend the Zaravan customer experience panel — sign in / sign up / reset, /account overview, profile, saved addresses, order history and order detail.
disable-model-invocation: true
argument-hint: "[optional: auth | profile | addresses | orders]"
---

# /build-account $ARGUMENTS

Goal: a signed-in customer can manage themselves and see their orders. Static, calm, legible — no motion runtime on these routes (`zaravan-design`).

1. **Preconditions.** `lib/supabase/`, `lib/dal/auth.ts`, and `profiles` / `addresses` / `orders` / `order_items` must exist. If not → `/setup-supabase` first, stop.
2. **Route groups.** If `MotionProvider` is still in `app/layout.tsx`, move it into a `(shop)` group layout first (see `zaravan-design`), and confirm the homepage still renders identically.
3. **Slices** (only `$ARGUMENTS` if given, else in order, checking in between):
   1. `auth` — `app/(auth)/sign-in`, `sign-up`, `reset-password`; nav shows account link / sign-in state; guest basket merges on sign-in if the basket exists
   2. `profile` — name, email display, sign out
   3. `addresses` — CRUD, one default, used by checkout
   4. `orders` — history list (date, status, total) and `orders/[id]` detail from `order_items` snapshots, with the delivery promise copy from `Business.md` §4
4. **Implement** with the `panel-engineer` agent; schema gaps → `supabase-architect`.
5. **Review** in parallel with `security-reviewer` (ownership checks, redirect safety) and `design-reviewer` (forms, focus, no GSAP on these routes). Fix and re-review.
6. **Verify** `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`; if possible sign up a test user locally and walk each page.
7. **Report** what's done and what's next.
