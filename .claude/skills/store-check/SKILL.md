---
name: store-check
description: Pre-merge gate for Zaravan — lint, type-check, build, then security and design review of the current diff.
disable-model-invocation: true
---

# /store-check

1. `git status` and `git diff --stat` against `master` — list what changed.
2. Run, and report output verbatim on failure:
   ```bash
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm build
   ```
3. In parallel, on the changed files:
   - `security-reviewer` — if anything under `supabase/`, `lib/supabase/`, `lib/dal/`, `lib/cart/`, `proxy.ts`, `app/admin/`, `app/account/`, checkout, or any `actions.ts` changed.
   - `design-reviewer` — if anything under `app/`, `components/`, `lib/motion/`, or a stylesheet changed.
4. Summarise as a single list: check → pass/fail, then findings grouped by severity. Don't fix anything unless the user asks — this command reports.
