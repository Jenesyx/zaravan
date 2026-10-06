---
name: supabase-data
description: How Zaravan talks to Supabase — client setup, Next.js 16 proxy session refresh, data access layer, schema, Row Level Security, admin role, migrations and generated types. Use whenever code reads or writes the database, checks who the user is, or adds a table or policy.
user-invocable: false
paths:
  - "lib/supabase/**"
  - "lib/dal/**"
  - "supabase/**"
  - "proxy.ts"
  - "app/**/actions.ts"
---

# Supabase in Zaravan

Backend is Supabase (Postgres + Auth + RLS). Verified against Supabase "Server-Side Rendering / Next.js" docs and the local Next.js 16 docs in `node_modules/next/dist/docs/`. Re-check those before changing setup — both move fast.

## Setup (once)

```bash
pnpm add @supabase/supabase-js @supabase/ssr server-only
```

`.env.local` (never committed; `.gitignore` already covers `.env*`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

No service-role / secret key in this app unless the user explicitly asks — admin power comes from RLS, not from bypassing it.

## Files

| File | Role |
|---|---|
| `lib/supabase/client.ts` | `createBrowserClient` — client components only |
| `lib/supabase/server.ts` | `createServerClient` with `await cookies()` — server components, server functions, route handlers |
| `lib/supabase/proxy.ts` | `updateSession(request)` — refreshes the auth cookie |
| `proxy.ts` (project root) | Next 16 **Proxy** (renamed from Middleware). Calls `updateSession`. Matcher excludes `_next/static`, `_next/image`, images, favicon |
| `lib/dal/*.ts` | Data access layer, `import "server-only"` at top. Every read/write of user or admin data goes through here |
| `supabase/migrations/*.sql` | Schema + RLS, one file per change |
| `lib/supabase/database.types.ts` | Generated types — never hand-edit |

Copy the client/server/proxy bodies from the current Supabase Next.js guide rather than from memory.

## Auth rules

- Identity on the server: `supabase.auth.getClaims()`. **Never** trust `getSession()` on the server — the cookie can be forged.
- Proxy is an optimistic check only (redirect signed-out users away from `/account`, `/admin`). Real authorization happens in the DAL and in RLS.
- DAL helpers: `requireUser()` → claims or `redirect("/sign-in?next=…")`; `requireAdmin()` → `requireUser()` then `is_admin()` check, else `notFound()` (don't reveal `/admin` exists). `forbidden()` / `unauthorized()` are experimental in Next 16 — don't use them.
- Every server function (`"use server"`) re-checks auth itself. A page being protected does not protect the function it posts to.

## Schema

| Table | Key columns | RLS |
|---|---|---|
| `profiles` | `id uuid pk → auth.users`, `full_name`, `role text check in ('customer','admin') default 'customer'` | owner select/update own row; owner **cannot** change `role` (column grant or trigger); admin select all |
| `addresses` | `id`, `user_id`, name, line1, line2, city, region, postal_code, country (ISO-2), `is_default` | owner full CRUD on own rows |
| `products` | `slug text pk`, name, grade, weight_g numeric, format, `price_cents int`, `price_per_gram_cents int null`, description, image, `stock int`, `is_active bool`, `sort int` | public select where `is_active`; admin full |
| `cart_items` | `user_id`, `product_slug`, `quantity int check 1..10`, pk(user_id, product_slug) | owner full on own rows |
| `orders` | `id uuid`, `user_id`, `status`, `subtotal_cents`, `shipping_cents`, `total_cents`, `shipping_address jsonb`, `created_at` | owner select own; insert only via `place_order` function; admin select/update |
| `order_items` | `order_id`, `product_slug`, snapshot name/grade/weight, `unit_price_cents`, `quantity` | owner select via parent order; admin select |

- Admin check: `public.is_admin()` — `security definer`, `stable`, `set search_path = ''`, returns whether `profiles.role = 'admin'` for `(select auth.uid())`. Use it in admin policies.
- In policies write `(select auth.uid())`, not bare `auth.uid()` (Supabase RLS performance guidance).
- Order placement is one Postgres function `place_order(address jsonb)` (`security definer`): reads the caller's `cart_items`, prices from `products`, checks stock, inserts `orders` + `order_items`, decrements stock, clears the cart — all in one transaction. The client never computes the stored total.
- Profile row created by trigger on `auth.users` insert.
- RLS enabled on **every** table in `public`, no exceptions.

## Migrations and types

```bash
npx supabase init
npx supabase migration new <name>
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > lib/supabase/database.types.ts
```

Regenerate types after every migration. Seed products from `lib/data/products.ts` in `supabase/seed.sql`.
