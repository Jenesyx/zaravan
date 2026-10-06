---
name: ui-change
description: Make a frontend or UI/UX change to Zaravan — redesign or add a homepage section, build a product page or component, adjust layout, copy, or motion — to Design.md.
disable-model-invocation: true
argument-hint: "<what to change, e.g. 'build Grades section (04)' or 'product card hover'>"
---

# /ui-change $ARGUMENTS

1. **Locate the spec.** Find the `Design.md` section(s) for `$ARGUMENTS` (§5 components, §6 homepage sections, §9.3 commerce variant) and any copy in `Business.md` §7. Quote the governing lines back to the user in two or three bullets.
2. **Spec gaps.** If the request contradicts `Design.md` (a second accent colour, light mode, Framer Motion, cinematic motion on checkout) or the spec is silent on something that changes the result, ask the user one question before building. If they choose to depart from `Design.md`, say that `Design.md` should be updated to match and offer to do it.
3. **Build** with the `ui-builder` agent. Give it the spec excerpt, target files, and the motion level for that surface.
4. **Review** with the `design-reviewer` agent. Fix blocker/major findings and re-review.
5. **Verify** `pnpm lint`, `pnpm exec tsc --noEmit`. If the dev server can run, look at the result at desktop and 375 px width, and once with reduced motion emulated; describe what you saw.
6. **Report** files changed and any spec point deliberately not met.
