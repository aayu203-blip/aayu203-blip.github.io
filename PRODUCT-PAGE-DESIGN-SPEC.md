# PTC Product Page — Canonical Design Spec

**This is the approved, live design for all product pages on partstrading.com.**
Every product page must render this design. Never revert to the static SSR fallback.

---

## How It Works

All product pages share a single template engine:

1. **`/assets/js/product-page.js`** — the React app that renders the full page UI.
2. **Each product HTML file** (e.g. `/scania/cab-body-parts/2611116.html`) contains:
   - A `<div id="root">` with inline SSR fallback HTML (for crawlers / no-JS)
   - A `<script>const P = {...};</script>` block with the part's data
   - A `<script src="/assets/js/product-page.js"></script>` that mounts the React app over the SSR

Editing `product-page.js` updates **every product page on the site instantly**.

---

## Visual Design — Non-Negotiable Rules

### Typography
- **Display / headings:** `'Barlow Condensed', sans-serif` — always 900 weight, UPPERCASE
- **Body / UI text:** `'Barlow', sans-serif` — loaded from Google Fonts on every page
- Both fonts are declared at the top of `product-page.js` as `D` and `B` constants

### Colours
- Background: `#050505` (near-black)
- Cards: `#0D0D0D`
- Alt sections: `#080808`
- Primary text: `#F0ECE6` (warm off-white)
- Muted text: `rgba(255,255,255,0.45)`
- **Amber accent: `#FFB81C`** — used for all interactive, CTA, and decorative elements
- **WhatsApp green: `#25D366`** — used exclusively for WhatsApp CTAs
- **Amber is ONLY for amber things. Green is ONLY for WhatsApp.**

### 5 Brand-Page Features (always present)

1. **Reading progress bar** — 3px amber line pinned to very top of viewport, grows as user scrolls. `zIndex: 10000`.
2. **Amber vertical rule on hero H1** — 4px wide × full H1 height amber rectangle, sits left of the `<h1>` via flexbox gap.
3. **Ghost section numbers** — `01`, `02`, `03`… in Barlow Condensed 900 at `font-size: 220px`, `opacity: 0.03`, amber, positioned `absolute top:-30px right:0` inside each section wrapper. Hidden on mobile.
4. **Sticky left sidebar** — 220px wide, hidden below 1100px. Contains:
   - "On this page" TOC with scroll-spy (IntersectionObserver, `rootMargin: -20% 0px -70% 0px`)
   - Active item shown by animated amber dot (7px, glowing) + bold text
   - Inactive items: 5px muted dot
   - "Ready to Order?" WhatsApp card pinned below TOC
5. **Intersection Observer reveal** — every section content div has class `.reveal` (opacity 0). When it enters viewport at threshold 0.08, `.in` is added, triggering `revealUp` keyframe (translateY 32px → 0, 0.7s cubic-bezier(0.22,1,0.36,1)).

### Page Structure (top to bottom)
```
ReadingProgress (fixed, z:10000)
AnnouncementBar (amber ticker — scrolling text)
Nav (sticky, backdrop-blur, mega-menu dropdowns for Brand + Category)
StickyFilterBar (sticky below nav — category chips + model chips for current part)
ProductHero
  └─ Breadcrumb
  └─ 2-col grid: [badges + amber-ruled H1 + part number + description + CTAs + trust strip] | [image + quick specs]
XrefStrip (cross-reference numbers bar)
Main content area (max-width 1360, flex row):
  └─ ProductSidebar (220px, sticky)
  └─ Content column:
      CompatibleModels  (Section id=sec-compatible, ghost=01)
      Specifications    (Section id=sec-specs,      ghost=02)
      RelatedParts      (Section id=sec-related,    ghost=03)
      Reviews           (Section id=sec-reviews,    ghost=04)
      FAQ               (Section id=sec-faq,        ghost=05)
      CategoryDesc      (Section id=sec-order)
BottomCTA (full-width amber block)
Footer
WAFloatPill (fixed bottom-right, appears on scroll)
SearchModal (full-screen overlay)
```

### Hero Section Rules
- H1: Barlow Condensed 900, `clamp(38px, 5vw, 68px)`, UPPERCASE, line-height 0.92
- H1 left rule: `width:4px, background:#FFB81C, borderRadius:2px, alignSelf:stretch, minHeight:52px`
- Part number displayed as `<code>` in amber on dark amber-tinted background
- "Copy part number" button inline next to part number
- Countdown timer: shows hours/minutes until 3 PM IST cut-off for same-day dispatch. Urgent = amber pulse.
- Two primary CTAs: **WhatsApp (green)** and **Get Formal Quote (ghost border)**
- Trust strip: 5 items with emoji icons, `gap:16`, `borderTop` separator

### CTA Rules
- WhatsApp buttons: always `background: #25D366`, white text. Pre-filled WA message includes part number, name, brand.
- Quote / amber CTAs: `background: #FFB81C`, `color: #050505`
- Ghost/outline CTAs: transparent background, `border: 1.5px solid rgba(255,255,255,0.07)`, hover turns amber

---

## Known Issue Fixed (2026-05-13)

**1,052 pages had a broken script tag** that prevented `product-page.js` from loading:

```html
<!-- BROKEN (was) -->
<scr<script>const P = {...};</script>ript src="/assets/js/product-page.js"></script>

<!-- FIXED (now) -->
<script>const P = {...};</script>
<script src="/assets/js/product-page.js"></script>
```

The fix was applied via Python across all affected files. If new pages are generated and this pattern appears again, run the fix script or check the generation pipeline.

---

## CSS Classes Required in Every Product Page HTML

These classes are in the `<style>` block of each product HTML (not in `product-page.js`):

```css
@keyframes revealUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
.reveal { opacity: 0; }
.reveal.in { animation: revealUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
.section-ghost { position:absolute;top:-30px;right:0;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:1;color:#FFB81C;opacity:0.03;user-select:none;pointer-events:none;letter-spacing:-0.04em;z-index:0; }
.sidebar-col { width:220px; flex-shrink:0; }
.toc-link { display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;border:none;background:transparent;width:100%;text-align:left;transition:all 0.2s; }
.toc-dot { width:5px;height:5px;border-radius:50%;flex-shrink:0;transition:all 0.25s; }
@media(max-width:1100px){ .sidebar-col { display:none!important; } }
@media(max-width:768px){ .section-ghost { display:none!important; } }
```

---

## Files

| File | Purpose |
|------|---------|
| `/assets/js/product-page.js` | Single source of truth for all product page UI |
| `/assets/js/react.production.min.js` | Local React 18.3.1 (self-hosted) |
| `/assets/js/react-dom.production.min.js` | Local ReactDOM 18.3.1 (self-hosted) |
| `/assets/images/categories/{catSlug}.jpg` | Category hero image used in product image zone |
| `/assets/images/ptc-logo.webp` | Logo used in nav + footer |
