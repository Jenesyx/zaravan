---
name: setup-supabase
description: One-time Supabase foundation for Zaravan — packages, clients, Next 16 proxy session refresh, data access layer, base schema with RLS, product seed, generated types.
disable-model-invocation: true
---

# /setup-supabase

Foundation every store feature depends on. Run once, before `/build-basket`, `/build-account`, `/build-admin`.

1. **Check state.** If `lib/supabase/` or `supabase/migrations/` already exists, report what's there and stop — this is not a re-run command.
2. **Confirm with the user** before installing anything: they need a Supabase project (URL + publishable key) and the Supabase CLI available through `npx`. Ask whether `.env.local` is already filled in. Never ask them to paste keys into chat; they edit `.env.local` themselves.
3. **Verify docs.** Re-read the current Supabase "Setting up Server-Side Auth for Next.js" guide and `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`. Note anything that differs from the `supabase-data` skill and tell the user.
4. **App wiring** (main session, no agent needed):
   - `pnpm add @supabase/supabase-js @supabase/ssr server-only`
   - `lib/supabase/client.ts`, `server.ts`, `proxy.ts`, root `proxy.ts` — bodies from the guide.
   - `lib/dal/auth.ts` with `getCurrentUser()`, `requireUser(next)`, `requireAdmin()`.
5. **Schema** — delegate to the `supabase-architect` agent: base migration with `profiles` (+ signup trigger), `is_admin()`, `addresses`, `products`, `cart_items`, `orders`, `order_items`, `place_order()`, all RLS; `supabase/seed.sql` built from `lib/data/products.ts` (prices × 100 into cents).
6. **Review** — run the `security-reviewer` agent on the migration and `lib/`. Fix critical/high findings before continuing.
7. **Check** — `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`. Report output.
8. **Tell the user** the manual steps left: apply migrations (`npx supabase db push` or the dashboard), run the type-gen command, and promote their own account to admin with one SQL `update public.profiles set role = 'admin' where id = '<their user id>'` in the Supabase SQL editor.
