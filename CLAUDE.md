# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

Zaravan — storefront for a single-origin saffron brand, currently a single-page homepage. Next.js 16 (App Router) + React 19, GSAP 3 / ScrollTrigger / Lenis / split-type for motion. Checkout is not connected yet (the product UI says "ordering opens at launch").

Two spec documents drive everything — read the relevant section before changing content or visuals:

- `Business.md` — brand voice, SKU table and prices (§3.2), homepage copy (§7), testimonial legal note (§7.4).
- `Design.md` — design + motion system. **Supersedes `Business.md` §6** (palette is black + saffron, not cream). Its **v1.1 Overrides** block at the top (type, radius, copy rules, hero sequence, product layout) wins over the older sections. Motion patterns §4.4, reduced motion §4.5, performance rules §8, accessibility §9, missing assets §11.

## Store build-out (in progress)

The homepage is being extended into a store: basket + checkout, customer account panel (`/account`), store-owner admin panel (`/admin`), plus frontend/UI rework. Backend decision: **Supabase** (Postgres + Auth + RLS). Payment processor is unresolved (`Business.md` §5) — checkout stops at a `pending_payment` order; don't wire a PSP without asking.

Workflow lives in `.claude/`:

- Commands: `/setup-supabase` (run first, once), `/build-basket`, `/build-account`, `/build-admin`, `/ui-change <what>`, `/db-change <what>`, `/store-check` (pre-merge gate).
- Agents: `supabase-architect` (migrations/RLS), `cart-engineer`, `panel-engineer` (auth/account/admin), `ui-builder`, and read-only `security-reviewer` / `design-reviewer`.
- Rules auto-load as skills: `commerce-rules` (prices, cents, shipping, order lifecycle), `supabase-data` (clients, Proxy, DAL, schema, RLS), `zaravan-design` (tokens, motion level per surface, a11y, perf).

## Commands

Package manager is pnpm (`packageManager: pnpm@10.33.0`).

```bash
pnpm dev      # dev server, http://localhost:3000
pnpm build
pnpm lint     # eslint (flat config: next core-web-vitals + typescript)
```

No test runner is configured. Type-check with `pnpm exec tsc --noEmit`.

## Architecture

- `app/page.tsx` composes the homepage from `components/sections/*` in order: Nav, Hero, ProofMarquee, Signature (`#products`), Collection, Features (`#features`, the standards section), Testimonials, ClosingStatement, Footer. Nav links, the hero CTA and footer links depend on those ids. `app/layout.tsx` loads Cormorant Garamond / Geist / Geist Mono via `next/font/google` as `--font-display`, `--font-ui`, `--font-mono`.
- **Styling is hand-written BEM CSS in `app/home.css`** (`.signature__panel`, `.tile--large`, `.action-link--primary`, …), with tokens as CSS vars in `app/globals.css` (including `--radius`, `--gutter`, `--space-section`, `--nav-h`, the z-index scale). Tailwind v4 is loaded through `@config "../tailwind.config.js"` in `globals.css`; keep the CSS vars and the Tailwind config in sync when changing a token.
- **Content lives in `lib/data/`**, transcribed from `Business.md`: `products.ts` (10 SKUs, `signatureLine` / `collection` splits, price formatters), `testimonials.ts` (draft copy, must be replaced before launch), `hero.ts` (frame-sequence settings). Product shots are `public/images/products/<sku-id>.png`, one per SKU id. `next.config.ts` serves them as AVIF/WebP.
- **Hero film:** `public/videos/frames/f_001.webp…f_144.webp`, cut from `public/videos/hero-section-video.mp4` with the ffmpeg command in `lib/data/hero.ts`. `useHeroScroll` pins the hero, opens the CSS-clipped frame (`--frame-*`, `--shift-*`, `--frame-scale` on `.hero`, read back by the hook), and draws frames to a canvas by scroll progress. The `<picture>` poster is frame one, or the last frame under reduced motion. Change the film by regenerating frames and updating `frameCount`.
- `components/ui/product-dialog.tsx` is the shared native-`<dialog>` details view used by Signature and Collection.

### Motion system (spans several files)

- `components/ui/motion-provider.tsx` is the single owner of GSAP setup: registers ScrollTrigger, uses `gsap.matchMedia()` to split reduced-motion vs. no-preference, starts Lenis only on fine-pointer non-touch devices (driven by `gsap.ticker`, synced via `lenis.on("scroll", ScrollTrigger.update)`), and debounces `ScrollTrigger.refresh()` on resize. It exposes `useMotionEnabled()`.
- `lib/motion/use-*.ts` — one hook per pattern (`useLineRise`, `useMaskReveal`, `useReveal` for `[data-reveal]` batches, `useNumberTween`, `useMagnetic`, plus section hooks `useHeroScroll`, `useNavMotion`, `useMarqueeMotion`, `useFooterMotion`). Timing values come from `lib/motion/tokens.ts` (`EASE`, `DURATION`, `STAGGER`); don't hardcode eases/durations.
- No `window` scroll listeners: scroll-driven state (nav background and hide, marquee direction) uses `ScrollTrigger.create`. The provider does not kill all triggers under reduced motion; each hook tears itself down when `enabled` flips.
- Conventions every motion hook follows:
  - Bail out unless `useMotionEnabled()` is true; the static DOM must already be fully legible (no content hidden until JS runs).
  - Animated elements carry `data-anim` — the reduced-motion branch clears props on `[data-anim]`, so new animated elements need it.
  - Heavy sections gate timeline creation with `useNearViewport(sectionRef)` (IntersectionObserver, 2 viewport heights) and pass the result as `active`.
  - Animate `transform`/`opacity` only; set `will-change` on start and clear it on complete.
  - Kill every tween/ScrollTrigger and revert any split-type split in the effect cleanup. Text splitting waits for `document.fonts.ready` and rebuilds on width change.
- Don't put `data-anim` on the hero's clipped media layer: the reduced-motion reset sets `clipPath: none` on `[data-anim]` and would drop the frame.
- In dev, changing `next.config.ts` restarts the server; image-optimizer requests in flight at that moment can hang until the dev server is restarted again.
