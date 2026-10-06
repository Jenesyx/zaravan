---
name: db-change
description: Add or change a Zaravan Supabase table, column, policy, or database function as a reviewed migration, then regenerate types.
disable-model-invocation: true
argument-hint: "<the change, e.g. 'add harvest_year and batch_number to products'>"
---

# /db-change $ARGUMENTS

1. **Describe the change back** to the user in one or two lines: tables touched, who can read/write what afterwards. If it drops or rewrites existing data, get an explicit yes first.
2. **Write the migration** with the `supabase-architect` agent.
3. **Review** with the `security-reviewer` agent. Fix critical/high findings and re-review.
4. **Update app code** that the change breaks: DAL functions in `lib/dal/`, `lib/supabase/database.types.ts` (regenerate, don't hand-edit), seed in `supabase/seed.sql`, and `supabase-data` skill's schema table if the change is structural.
5. **Verify** `pnpm exec tsc --noEmit`, `pnpm lint`.
6. **Report** the migration file, the policy matrix, and the commands the user still has to run (`npx supabase db push`, type generation) if you couldn't run them.
