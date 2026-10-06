---
name: zaravan-design
description: Zaravan visual and motion system — tokens, type, BEM CSS conventions, component specs, which surfaces get cinematic motion vs the restrained commerce variant, accessibility and performance rules. Use before building or changing any UI, page, section, component, or animation.
user-invocable: false
paths:
  - "app/**/*.tsx"
  - "app/**/*.css"
  - "components/**"
  - "lib/motion/**"
  - "tailwind.config.js"
---

# Zaravan design system

`Design.md` is the spec. Its **v1.1 Overrides** block at the top wins over the older sections. Read the section you're touching before you write code: tokens §1, type §2, layout §3, motion §4, components §5, homepage sections §6, perf §8, a11y §9.

Copy rules from v1.1: no em or en dashes in visible text; at most one small-caps eyebrow above a section headline per three sections; quotes fit in three lines; Phosphor icons only; no custom cursor; no `window` scroll listeners.

## Thesis in three rules

1. One idea per screen.
2. Saffron is rationed, under 8% of any viewport: the primary action and the focus ring. Selected states use Bone. Never decoration.
3. Motion reveals, it doesn't decorate. No reason → cut it.

## Tokens — never hardcode

- Colours: `void #0A0A0A`, `ink #121110` / `ink-raised #1A1917`, `saffron #F2B01E` / `lift #FFD45E` / `deep #C98A0B`, `bone #F5F2EC` / `bone-dim #A8A49B`, `mute #6E6A63`, hairlines `rgba(245,242,236,.10)` and warm `rgba(242,176,30,.22)`.
- They exist twice: CSS vars in `app/globals.css` and Tailwind theme in `tailwind.config.js`. Change both or neither.
- `mute` never below 18px. Body weight ≥ 400. Dark only — no light mode, no theme toggle.
- One radius, `var(--radius)` (2px), for every surface. 1px borders (`--line`, `--line-strong`).
- Fonts via CSS vars `--font-display` (Cormorant Garamond, headings; italic for emphasis), `--font-ui` (Geist, body), `--font-mono` (Geist Mono, labels, data, prices-per-gram).

## Styling convention

- Existing code is BEM classes in `app/home.css` (`.block__element--modifier`), not Tailwind utilities. Match it.
- New surfaces get their own stylesheet next to the route: `app/(shop)/shop.css`, `app/account/account.css`, `app/admin/admin.css`, imported from that route's `layout.tsx`. Don't keep growing `home.css`.
- Reuse shared blocks before inventing: `.shell`, `.display-l`, `.label`, `.data`, `.action-link--primary|secondary|text`, `.icon-button`, `.field`, `.spec`, `ActionLink`, `ProductDialog`.

## Which motion level where

| Surface | Motion |
|---|---|
| Homepage, About, Journal | Full cinematic system, `lib/motion/*` hooks |
| Product page, basket drawer, checkout (`Design.md` §9.3) | Restrained: only `useMaskReveal` / `useLineRise` at `DURATION.base`. No pinning, no scrub, no custom cursor. Image, price, grade, weight, Add to basket visible on load with **zero** animation dependency |
| Account panel, admin panel | No GSAP. CSS transitions only for hover/focus/state (`DURATION.quick` equivalent, `var(--ease-out)`). These are tools, not stories |

Cart drawer spec (`Design.md` §5.5): right slide-in 480px, Ink ground, Void backdrop 60% + blur, 0.5s `expo.out`. Under reduced motion it appears instantly.

## Motion hook contract

Follow the existing hooks in `lib/motion/`:

- Gate on `useMotionEnabled()`; content must be fully legible before JS runs.
- Animated elements carry `data-anim`.
- Heavy sections gate on `useNearViewport`.
- Tokens from `lib/motion/tokens.ts` only.
- `transform` / `opacity` only. `will-change` on start, cleared on complete.
- Kill tweens, ScrollTriggers, and revert splits in cleanup.
- Never add Framer Motion or a second animation runtime.

## Components to build to spec (`Design.md` §5)

Buttons §5.1, nav with cart + currency on the right §5.2, product card §5.3, price ladder §5.4, input (bottom rule only, floating mono label) §5.5, accordion §5.5, cart drawer §5.5.

## Accessibility (hard requirements)

- Visible saffron-lift focus ring, never removed. Touch targets ≥ 44×44.
- One `<h1>` per page, sequential headings, landmarks, skip link stays first.
- Dialogs/drawers: native `<dialog>` with `showModal()` (pattern already used in `components/sections/products.tsx`), focus returns to trigger on close, Esc closes.
- Live region announces basket changes ("Added Zaravan Select, 5 g").
- Forms: real `<label>`, error text linked with `aria-describedby`, never colour-only errors.

## Performance budget (`Design.md` §8)

LCP < 2.0 s, CLS < 0.02, INP < 200 ms, homepage JS < 180 KB gz. Every image has explicit dimensions. Account and admin routes must not import GSAP, Lenis, or split-type.

`MotionProvider` currently wraps everything in `app/layout.tsx`. The first time account or admin routes are added, move it into the layout of a `(shop)` route group (homepage + product pages + basket) so `/account` and `/admin` ship without the motion runtime. Root layout keeps fonts, skip link, and global CSS only.
