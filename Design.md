# Zaravan — Design & Motion System

**Scope:** Homepage-first design direction, extending to the full storefront
**Stack:** Next.js (App Router) · Tailwind CSS · GSAP 3 + ScrollTrigger · Lenis
**Aesthetic:** Minimal, luxurious, serene. Black ground, saffron light.
**Version:** 1.0 — supersedes §6 of `business.md`

---

## 0. Design Thesis

The product is a thread of red-gold that glows when light passes through it. The entire site is built on that single observation: **a dark room, and one source of light.**

Black is the ground, not a theme. Saffron yellow is the light, and it is rationed — it appears where the eye should go and nowhere else. Everything else is silence: off-white type, hairline rules, and large volumes of nothing.

Three rules govern every decision below:

1. **One idea per screen.** If a section carries two messages, it is two sections.
2. **Colour is a resource.** Saffron occupies under 8% of any viewport. Scarcity is what makes it read as precious rather than as a highlighter.
3. **Motion reveals, it does not decorate.** Every animation either uncovers content, communicates material quality, or guides attention. Animation that does none of those three gets cut.

### A note on the palette change

`business.md` §6 specified a cream base with red and gold accents. This document replaces that with black and saffron yellow. The two directions cannot coexist — packaging, photography grade and the brand mark all key off the base colour. **Update `business.md` §6 to match this document before anything goes to print.**

The practical consequences of going dark:

| Gain | Cost |
|---|---|
| Product photography glows; threads on black are genuinely striking | Photography must be reshot on black — cream-linen shots are unusable |
| Motion reads far better; light effects have somewhere to happen | Dark storefronts historically convert slightly lower in food retail |
| Instantly differentiated — every saffron competitor is cream and gold | Packaging must be dark too, or site and product look unrelated |

Mitigation for the conversion risk: keep the **homepage cinematic and dark**, but shift product detail pages and checkout to a **high-contrast, low-motion variant** (see §9.3). Atmosphere sells the brand; clarity sells the jar.

---

## 1. Colour

### 1.1 Tokens

| Token | Name | Hex | Role |
|---|---|---|---|
| `--void` | Void | `#0A0A0A` | Page ground. ~85% of every screen. |
| `--ink` | Ink | `#121110` | Elevated surfaces, cards, nav bar |
| `--ink-2` | Ink Raised | `#1A1917` | Hover surfaces, input fields |
| `--saffron` | Saffron | `#F2B01E` | **The** accent. CTAs, active states, key numerals, the mark |
| `--saffron-lift` | Saffron Lift | `#FFD45E` | Hover state, glow cores, focus rings |
| `--saffron-deep` | Saffron Deep | `#C98A0B` | Pressed state, gradient falloff |
| `--bone` | Bone | `#F5F2EC` | Primary text on dark |
| `--bone-dim` | Bone Dim | `#A8A49B` | Secondary text, captions |
| `--mute` | Mute | `#6E6A63` | Tertiary text, disabled, metadata |
| `--line` | Hairline | `rgba(245,242,236,0.10)` | Dividers, card borders |
| `--line-warm` | Hairline Warm | `rgba(242,176,30,0.22)` | Active dividers, accent rules |

### 1.2 Usage Discipline

- **Saffron is never a background fill** above ~120px of surface area. No saffron hero panels, no saffron section blocks. It is type, rule, icon, glow, and button — nothing larger.
- **Exactly one saffron CTA per viewport.** Two primary buttons on screen means neither is primary.
- Gradients only as light falloff: `radial-gradient(circle, rgba(242,176,30,0.18), transparent 70%)` behind product imagery. Never a linear gradient across a section.
- Never pure `#000000` and never pure `#FFFFFF`. Both feel synthetic against warm product photography.

### 1.3 Contrast Check

| Pair | Ratio | Verdict |
|---|---|---|
| Bone `#F5F2EC` on Void `#0A0A0A` | 17.4:1 | AAA |
| Saffron `#F2B01E` on Void `#0A0A0A` | 10.9:1 | AAA |
| Void `#0A0A0A` on Saffron `#F2B01E` | 10.9:1 | AAA — use for solid CTAs |
| Bone Dim `#A8A49B` on Void | 8.4:1 | AAA |
| Mute `#6E6A63` on Void | 4.2:1 | **AA large text only** — never below 18px |

---

## 2. Typography

### 2.1 Families

| Role | Primary (licensed) | Free alternative | Weights used |
|---|---|---|---|
| **Display** | PP Editorial New | **Instrument Serif** (Google) | Ultralight 200 / Light 300, Italic |
| **Interface** | PP Neue Montreal | **Satoshi** (Fontshare) | Light 300, Regular 400, Medium 500 |
| **Data** | Söhne Mono | **Martian Mono** or JetBrains Mono | Regular 400 only |

**Rationale.** The display serif is high-contrast with hairline thins — at 140px on black it does exactly what the brief asks: slender, stylish, unmistakably premium. The grotesque is neutral and carries all functional text without competing. The mono is reserved for technical truth — batch numbers, crocin values, harvest years, prices per gram. That monospace treatment is what visually separates Zaravan from every decorative saffron brand: it says *measured*, not *artisanal*.

**Never use more than these three families.** No icon fonts — SVG only.

### 2.2 Scale

Fluid via `clamp()`. Desktop → mobile.

| Token | Family | Size (clamp) | Line | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | Display 200 | `clamp(3.5rem, 11vw, 11rem)` | 0.92 | `-0.03em` | Hero headline, section openers |
| `display-l` | Display 300 | `clamp(2.75rem, 6vw, 5.5rem)` | 1.0 | `-0.02em` | Section titles |
| `display-m` | Display 300 | `clamp(2rem, 3.6vw, 3.25rem)` | 1.1 | `-0.015em` | Pull quotes, product names |
| `title` | UI 400 | `clamp(1.25rem, 1.6vw, 1.5rem)` | 1.35 | `-0.01em` | Card titles |
| `body-l` | UI 300 | `1.25rem` | 1.6 | `0` | Lead paragraphs |
| `body` | UI 400 | `1.0625rem` | 1.65 | `0` | Body copy |
| `caption` | UI 400 | `0.875rem` | 1.5 | `0` | Captions, helper text |
| `eyebrow` | Mono 400 | `0.75rem` | 1.2 | `0.14em` | Section labels, uppercase |
| `data` | Mono 400 | `0.8125rem` | 1.4 | `0.04em` | Batch no., crocin, $/g |

### 2.3 Rules

- Body measure capped at **68 characters** (`max-w-[62ch]`). Non-negotiable on a dark ground — long lines on black are exhausting to read.
- Display type gets **negative tracking**; mono and eyebrow get **positive tracking**. Nothing sits at zero except body.
- Italic display, used once or twice on the whole homepage, is the entire "ornament" budget. No script fonts, no flourishes, no drop caps.
- Numerals: tabular lining in mono for anything comparable (prices, grams, crocin). Proportional oldstyle in the serif for anything decorative (years, "1961").

---

## 3. Space, Grid & Layout

### 3.1 Spacing

8px base. Only these steps exist: `8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192 · 256`.

| Context | Desktop | Tablet | Mobile |
|---|---|---|---|
| Section padding (vertical) | `192px` | `128px` | `88px` |
| Hero padding | `256px` | `160px` | `112px` |
| Page gutter | `64px` | `40px` | `24px` |
| Grid gutter | `32px` | `24px` | `16px` |
| Element stack (inside block) | `32px` | `24px` | `20px` |

Whitespace is the luxury signal. When a section looks too empty in the mockup, it is correct. Add 25% more vertical padding than feels natural and it will read right on a real screen.

### 3.2 Grid

- 12 columns, `max-w-[1440px]`, centred.
- Text blocks occupy **5–7 columns**, never 12.
- Asymmetry by default: content sits on columns 2–7 or 6–11, rarely centred. Centring is reserved for the hero and the closing statement — two moments on the whole page.
- A persistent **hairline column grid overlay** at 4% opacity is an optional signature detail; toggle behind a flag and test it.

### 3.3 Breakpoints

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

Below `lg`, pinned and horizontal-scroll sections degrade to vertical stacks (see §6).

---

## 4. Motion System

### 4.1 Stack

| Library | Purpose | Notes |
|---|---|---|
| **GSAP 3** | Core timeline engine | All choreography |
| **ScrollTrigger** | Scroll-linked reveals, pinning, scrubbing | — |
| **SplitText** | Line/char splitting for type reveals | Club GreenSock. Free alt: `split-type` (npm) |
| **Lenis** | Smooth scroll | Must be synced to ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` |
| **GSAP Flip** | Product grid filtering, layout transitions | — |
| **GSAP Observer** | Section-locked interactions (grade explorer) | — |
| **OGL** or **Three.js** | Hero particle field / shader glow | Optional. Only if it ships under 40KB gzipped. |

Framer Motion is **not** used alongside GSAP. Two competing animation runtimes in one app produces jank and doubles bundle size. Pick GSAP and commit.

### 4.2 Easing Tokens

```js
export const EASE = {
  out:    'power3.out',        // default reveal
  inOut:  'power2.inOut',      // state changes, morphs
  expo:   'expo.out',          // hero, large-scale entrances
  soft:   'circ.out',          // image masks, scale
  spring: 'elastic.out(1, 0.6)', // magnetic cursor return only
};
```

CSS equivalents for Tailwind transitions:

```css
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out:cubic-bezier(0.65, 0, 0.35, 1);
```

### 4.3 Duration Scale

| Token | Value | Use |
|---|---|---|
| `instant` | `0.15s` | Hover colour, focus ring |
| `quick` | `0.35s` | Buttons, links, small state changes |
| `base` | `0.6s` | Standard element reveal |
| `slow` | `1.0s` | Section entrances, image masks |
| `cinematic` | `1.6s` | Hero headline, preloader |

**Stagger:** `0.06s` for characters, `0.08s` for lines, `0.12s` for cards. Never more than 8 staggered items — beyond that the last item feels broken.

### 4.4 Core Patterns

Reusable across the site. Build these once as hooks.

| Pattern | Behaviour |
|---|---|
| `maskReveal` | Element clipped by `clip-path: inset(100% 0 0 0)` → `inset(0)`, `1.0s`, `expo.out`. The workhorse for images. |
| `lineRise` | SplitText by line, each line in an `overflow-hidden` wrapper, `y: 110% → 0`, `0.9s`, stagger `0.08` |
| `charFade` | SplitText by char, `opacity: 0 → 1` + `y: 20 → 0`, stagger `0.02`. Eyebrows and short labels only. |
| `counterScrub` | Numbers count up on `ScrollTrigger` scrub. Crocin values, years, gram counts. |
| `parallaxImage` | Inner `<img>` scaled 1.15, `yPercent: -8 → 8` scrubbed. Subtle — anything stronger looks cheap. |
| `magnetic` | Cursor attraction within 80px radius, `x/y` lerp at 0.18, `elastic.out` return. Primary CTA and nav only. |
| `glowPulse` | Radial saffron glow, opacity `0.12 → 0.22` over `4s`, `sine.inOut`, infinite. Behind hero product only. |

### 4.5 Reduced Motion — Mandatory

```js
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: reduce)', () => {
  gsap.set('[data-anim]', { clearProps: 'all', opacity: 1, y: 0, clipPath: 'none' });
  ScrollTrigger.getAll().forEach(t => t.kill());
  lenis.destroy(); // fall back to native scroll
});
```

Under reduced motion the site must still be **complete and beautiful** — static, high-contrast, fully readable. Never ship a layout where content is invisible until an animation fires; every animated element starts from a CSS state that is already legible if JS fails.

---

## 5. Component Library

### 5.1 Buttons

| Variant | Spec |
|---|---|
| **Primary** | Saffron `#F2B01E` fill, Void text, `52px` height, `28px` horizontal padding, `2px` radius (nearly square). Hover: background lifts to `#FFD45E`, label `x: 2px`, arrow glyph `x: 4px`. Magnetic within 80px. |
| **Secondary** | Transparent, `1px` Hairline border, Bone text. Hover: border → Hairline Warm, background → `--ink-2`. |
| **Text link** | Bone, mono eyebrow style. Underline drawn left→right on hover via `scaleX` on a `1px` pseudo-element, `0.35s`, `ease-out`. |
| **Icon** | `44px` square minimum touch target, Hairline border, `50%` radius. |

All buttons: `:focus-visible` gets a `2px` Saffron Lift outline at `3px` offset. Never remove focus rings.

### 5.2 Navigation

- Fixed, `72px` tall, background `transparent` over hero → `rgba(10,10,10,0.72)` + `backdrop-blur-xl` + bottom hairline once scrolled past `80vh`.
- Hides on scroll down, reappears on scroll up (`0.4s`, `power2.out`).
- Wordmark left, three links centre, cart + currency right.
- Link hover: the label swaps via a vertical roll — two copies stacked in an `overflow-hidden` wrapper, `y: 0 → -100%`, `0.4s`.
- **Mobile:** full-screen overlay, Void ground, `display-l` links, staggered `lineRise` in, clip-path circle expand from the toggle.

### 5.3 Product Card

- Ink surface, `1px` Hairline, `4px` radius, `24px` padding.
- Image area `4:5`, product on black with a soft saffron radial glow behind it.
- Hover: card `y: -6px`, border → Hairline Warm, glow opacity `0.12 → 0.24`, image scale `1 → 1.04`. All `0.5s`, `ease-out`.
- Content order: mono grade eyebrow → serif product name → mono weight + `$/g` → price in Saffron.
- Cursor over card becomes a `72px` saffron-outlined circle reading **VIEW** in mono.

### 5.4 Price Ladder

A mono table with a hairline between rows. On scroll-in, each row's `$/g` figure counts down via `counterScrub` — a small, honest flourish that makes the descending per-gram price physically visible. This is the single best motion idea on the site because the animation *is* the argument.

### 5.5 Other Components

| Component | Notes |
|---|---|
| **Marquee** | Infinite horizontal loop, GSAP `xPercent`, pauses on hover, reverses direction on scroll direction change |
| **Accordion** | FAQ + grade details. Height auto via GSAP, `0.5s`, `power2.inOut`. Saffron `+` rotates to `×`. |
| **Input** | Bottom-rule only (`1px` Hairline). Focus: rule → Saffron, scales from centre. Label floats up as mono eyebrow. |
| **Cart drawer** | Right slide-in `480px`, Ink ground, Void backdrop at 60% + blur. `0.5s`, `expo.out`. |
| **Certificate viewer** | Framed lab PDF preview, mono metadata overlay, hairline corner marks |
| **Custom cursor** | `8px` Bone dot + `36px` Hairline ring lerping behind it at 0.12. Desktop + fine pointer only. Disabled under reduced motion. |
| **Section eyebrow** | Mono uppercase, preceded by a `32px` saffron hairline that draws in via `scaleX` |

---

## 6. Homepage — Section by Section

Ten sections. Each one uses a **different** motion primitive so the page never repeats itself.

---

### 00 · Preloader

*Motion idea: the light arriving.*

- Void screen. Centred mono counter `000 → 100`, tabular figures, `2.0s`.
- Behind it, a single saffron thread SVG draws itself via `strokeDasharray`.
- At 100: counter fades, thread scales up and blurs out, full screen wipes upward via `clip-path` to reveal the hero.
- **Session-gated** — `sessionStorage` flag so it plays once per session, never on repeat navigation. Hard-cap at `2.5s` regardless of asset load.

---

### 01 · Hero

*Motion idea: emergence from darkness.*

- Full viewport, Void. Extreme macro of saffron threads, lit from one side, on black. Video preferred (silent, looping, 6s, `<2MB` AV1/H.265) — still image fallback.
- `glowPulse` radial behind the threads.
- Headline in `display-xl`, revealed by `lineRise`, `cinematic` duration, starting `0.2s` after the preloader wipe:

  > ### Red gold from Khorasan.

- Sub-line `body-l`, Bone Dim, delayed `0.5s`:

  > Single-origin saffron, hand-picked by the third generation of one family and verified by laboratory before it leaves the farm.

- One primary CTA: **Shop the harvest →** (magnetic).
- Bottom-left: mono stack — `EST. 1961 / KHORASAN, IRAN`. Bottom-right: scroll cue, a `1px` saffron line pulsing `y` infinitely.
- On scroll: hero content `y: -80px` and fades while the media scales `1 → 1.12`, scrubbed. The next section slides *over* it.

---

### 02 · Proof Marquee

*Motion idea: continuous movement — the first time the page moves on its own.*

- `96px` band, top and bottom hairlines, Ink ground.
- Mono uppercase, infinite loop, separated by saffron `·`:
  `SINGLE-ORIGIN KHORASAN · ISO 3632-2 CATEGORY I · 2026 HARVEST · CROCIN 287 · WORLDWIDE IN UNDER 7 DAYS · DUTIES PAID`
- Speed inverts with scroll direction. Slows to 30% on hover.

---

### 03 · The Family

*Motion idea: horizontal time — the only sideways section on the page.*

- Pinned, horizontal scroll driven by vertical input. Four panels: **1961 · 1987 · 2009 · Today.**
- Each panel: full-bleed documentary photograph (`maskReveal` on entry), a `display-l` year in serif, two sentences of body copy.
- The year numeral parallaxes at a different rate from its image — a depth cue that costs nothing.
- A saffron progress hairline runs along the bottom edge of the viewport for the section's duration.
- **Below `lg`:** collapses to a vertical stack with standard `maskReveal` per panel. Do not attempt horizontal scroll on mobile.

---

### 04 · Grades

*Motion idea: direct manipulation — the user drives the animation.*

- Pinned. Five grades: Super Negin, Negin, Sargol, Pushal, Dasteh.
- Left: mono list, active item in Saffron with a `1px` indicator bar that morphs between positions.
- Right: macro thread photography cross-fading between grades, with a saffron glow whose intensity scales to the grade's crocin value.
- Below the image: three `counterScrub` figures — crocin, picrocrocin, safranal — that animate to each grade's real values on switch.
- Driven by GSAP `Observer`: scroll steps through grades one at a time; also clickable and keyboard-navigable.
- **Below `lg`:** horizontal swipe carousel, no pinning.

---

### 05 · Products

*Motion idea: rearrangement — GSAP Flip.*

- Section title `display-l`, left-aligned on columns 2–7.
- Filter row (mono): `All · Super Negin · Negin · Sargol · Gift`. Filtering re-lays the grid with **Flip**, `0.7s`, `power3.inOut` — cards physically travel to new positions rather than popping.
- 3-column grid desktop, 2 tablet, 1 mobile (`32px` gutter).
- Cards enter on scroll with `maskReveal`, stagger `0.12s`.
- Closing link: **View all ten →**

---

### 06 · Traceability

*Motion idea: assembly — parts converging into a whole.*

The hardest-working section on the page, because it carries the only defensible moat.

- Split layout. Left: `display-l` headline + body + **See a live certificate →**. Right: an animated jar label that builds itself as the section scrolls — batch number types in (mono), harvest year counts up, crocin value counts up, QR code draws in square by square, saffron hairline frame draws last.
- Three `counterScrub` stats beneath: `2026` harvest · `287` crocin · `100%` all-red stigma.
- Background: a very low-opacity (4%) repeating mono batch-number pattern, parallaxing slowly.

---

### 07 · Testimonials

*Motion idea: drift — slow, ambient, uncommanded.*

- Three vertical columns of quote cards, each drifting upward at a **different** speed, scrubbed to scroll. The centre column is slowest, which naturally weights attention there.
- Cards: Ink surface, hairline border, `40px` padding. Serif `display-m` quote, mono attribution (`Name, City, Country`). Hover pauses that column's drift and warms its border.
- **No star ratings, no avatars, no carousel dots, no auto-play.** The restraint is the credibility.
- Top and bottom of the section masked with a `120px` Void gradient so cards fade rather than clip.
- **Copy:** use the drafted quotes in `business.md` §7.3 as layout placeholder only. They must be replaced with verified reviews before launch — see §7.4 of that document. Build the component to read from a CMS collection so the swap is a data change, not a rebuild.

---

### 08 · Delivery

*Motion idea: travel — a line crossing distance.*

- Minimal world map rendered as a saffron dot matrix on Void (SVG, no map library).
- Three arcs draw from Khorasan to Frankfurt, New York and Toronto, sequentially, `strokeDasharray` reveal, `1.2s` each, `0.3s` apart, on scroll-in.
- Each destination shows a mono label with its transit window: `2–4 DAYS · 3–5 DAYS · 3–6 DAYS`.
- Beneath: three hairline-separated statements — **Dispatched within 24 hours · Duties and taxes paid · Under 7 days or shipping refunded.**

---

### 09 · Closing Statement

*Motion idea: scale — one sentence, enormous.*

- The only other centred section besides the hero. `256px` vertical padding, nothing else on screen.
- `display-xl`, mixed roman and italic, revealed by `lineRise` on scroll-in:

  > ### From our field to your kitchen, *nothing in between.*

- Single secondary CTA below: **Read our story →**

---

### 10 · Footer

*Motion idea: arrival — the page settles.*

- Void ground, top hairline.
- Oversized wordmark in `display-xl` at 8% opacity, bleeding off the bottom edge, parallaxing up slightly as the footer enters.
- Four columns: Shop · Learn · Trade · Contact. Mono links with the underline-draw hover.
- Newsletter: bottom-rule input, saffron submit arrow. Copy: *Harvest notes, twice a year. Nothing else.*
- Bottom bar: mono legal row, currency switcher, payment marks in Mute.

---

## 7. Tailwind Configuration

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        void:    '#0A0A0A',
        ink:     { DEFAULT: '#121110', raised: '#1A1917' },
        saffron: { DEFAULT: '#F2B01E', lift: '#FFD45E', deep: '#C98A0B' },
        bone:    { DEFAULT: '#F5F2EC', dim: '#A8A49B' },
        mute:    '#6E6A63',
      },
      borderColor: {
        hairline: 'rgba(245,242,236,0.10)',
        warm:     'rgba(242,176,30,0.22)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans:    ['var(--font-ui)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 11vw, 11rem)',   { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-l':  ['clamp(2.75rem, 6vw, 5.5rem)',  { lineHeight: '1',    letterSpacing: '-0.02em' }],
        'display-m':  ['clamp(2rem, 3.6vw, 3.25rem)',  { lineHeight: '1.1',  letterSpacing: '-0.015em' }],
        'eyebrow':    ['0.75rem',   { lineHeight: '1.2',  letterSpacing: '0.14em' }],
        'data':       ['0.8125rem', { lineHeight: '1.4',  letterSpacing: '0.04em' }],
      },
      spacing: {
        section:    '12rem',   // 192
        'section-md':'8rem',   // 128
        'section-sm':'5.5rem', // 88
        gutter:     '4rem',    // 64
      },
      maxWidth: { shell: '1440px', prose: '62ch' },
      borderRadius: { card: '4px', btn: '2px' },
      transitionTimingFunction: {
        out:   'cubic-bezier(0.16, 1, 0.3, 1)',
        inout: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      backgroundImage: {
        glow: 'radial-gradient(circle, rgba(242,176,30,0.18) 0%, transparent 70%)',
      },
    },
  },
};
```

Font loading via `next/font/local` with `display: 'swap'` and preloaded subsets. Variable fonts only where available — the display serif at two weights is `~34KB` woff2 subset to Latin.

---

## 8. Performance Budget

Animation-heavy and fast are not mutually exclusive, but only if the budget is enforced from day one.

| Metric | Target | Enforcement |
|---|---|---|
| LCP | `< 2.0s` | Hero poster frame as priority image; video loads after |
| CLS | `< 0.02` | Every image and video gets explicit dimensions |
| INP | `< 200ms` | No layout-thrashing in scroll handlers |
| JS bundle (homepage, gzipped) | `< 180KB` | GSAP core + ScrollTrigger + Lenis ≈ 55KB. Budget the rest. |
| Hero video | `< 2MB` | AV1 with H.265 fallback, 6s loop, no audio track |
| Lighthouse Performance | `≥ 90` mobile | CI gate on every PR |

**Non-negotiable rules:**

- Animate `transform` and `opacity` only. Never `top`, `left`, `width`, `height`, or `margin`.
- `will-change` applied on animation start, removed on complete. Never left in static CSS.
- `ScrollTrigger.refresh()` on resize, debounced `200ms`.
- All heavy sections (03, 04, 06, 08) lazy-mounted via `IntersectionObserver` — GSAP timelines are not created until the section is within `200vh`.
- Kill every timeline and ScrollTrigger on unmount. Memory leaks in an SPA with this much motion will surface as scroll jank after three navigations.
- Disable Lenis and the custom cursor entirely on touch devices.

---

## 9. Accessibility & Variants

### 9.1 Baseline

- `prefers-reduced-motion` fully honoured (§4.5) — this is a hard requirement, not a nice-to-have.
- Keyboard: every interactive element reachable; visible Saffron focus ring; pinned sections must not trap focus, and the grade explorer needs arrow-key stepping.
- Semantic landmarks, one `<h1>`, sequential heading order.
- Decorative motion layers marked `aria-hidden`.
- Skip-to-content link, visually hidden until focused.
- Minimum touch target `44×44px`.

### 9.2 Dark-Only Consideration

The site is dark by design, not by theme toggle. No light mode. Because of this, extra care on:
- Never using Mute `#6E6A63` below 18px.
- Body text at `400` weight minimum — light weights on dark grounds smear on low-quality displays.

### 9.3 Commerce Variant

Homepage, About and Journal run the full cinematic system. **Product detail, cart and checkout run a restrained variant:**

- No pinning, no horizontal scroll, no scrubbed sequences.
- Reveals limited to `maskReveal` and `lineRise` at `base` duration.
- No custom cursor.
- Product imagery, price, grade, weight and the Add to Cart button are **visible on load, above the fold, with zero animation dependency**.

Atmosphere is for the first thirty seconds. After that the customer is trying to buy something, and every additional animation is friction.

---

## 10. Build Order

1. Tailwind config, font loading, colour tokens, type scale — the design system as code, before any section exists
2. Lenis + GSAP + ScrollTrigger provider, `matchMedia` reduced-motion guard
3. Motion primitive hooks: `useMaskReveal`, `useLineRise`, `useCounterScrub`, `useMagnetic`
4. Nav, footer, button, input, card — the static component shell
5. Hero (01) and Closing (09) — the two centred bookends establish the whole tone
6. Products (05) and Testimonials (07) — the two CMS-driven sections
7. Grades (04) and Traceability (06) — the two heaviest builds
8. Family (03) and Delivery (08)
9. Preloader (00) and Marquee (02) — last, because they are the easiest to cut under deadline
10. Performance pass, reduced-motion pass, accessibility audit, CI gate

---

## 11. Assets Required Before Build

| Asset | Spec | Blocker for |
|---|---|---|
| Hero video | Macro threads on black, single-source light, 6s silent loop | Section 01 |
| Grade photography | 5 macro shots, identical lighting and framing, on black | Section 04 |
| Product shots | 10 SKUs, `4:5`, on black with controlled rim light | Section 05 |
| Archive/family photography | 4 images spanning 1961 → today | Section 03 |
| Lab certificate PDF | Real ISO 3632-2 report, current batch | Section 06 |
| Wordmark | SVG, single saffron thread motif, optimised for stroke-draw animation | Preloader, nav, footer |
| Real testimonials | Minimum 3, verified | Section 07 |

**Photography must be reshot on black.** Cream-linen product shots cannot be composited onto a dark ground convincingly — the edge light is wrong and it will be the first thing that looks cheap.