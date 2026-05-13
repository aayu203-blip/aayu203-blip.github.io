# Round 3 — UI/UX & Design Audit
*Generated: 2026-05-13 · Platform: Desktop + Mobile · Stage: Production · WCAG AA*

---

## Overall Design Score: 68/100

| Page | Score | Primary Issues |
|------|-------|----------------|
| Homepage | 65/100 | Blank before JS loads; excessive animations; Inter font (not Barlow) |
| Category Page | 72/100 | Consistent with product pages; sticky filter ✅ |
| Product Page | 75/100 | Strong dark theme; hero image lazy; OG truncated |
| Blog | 40/100 | Completely different design system — Tailwind/white vs dark |

---

## Inferred Settings
Full audit · Production stage · WCAG AA — all pages analyzed from local source files.

---

## 1. Homepage Design

### Assumptions
- Target user: B2B fleet manager / mining procurement — not a consumer
- Primary task: identify brand → navigate to parts → WhatsApp/call inquiry
- Technical: pure React SPA, no SSR fallback

### P0 — Critical Issues

**P0.1: Blank page state (evaluation gulf)**
Before React loads, users see a completely empty page — no content, no loading state. For users on slow connections or in low-bandwidth regions (mines in Africa/Indonesia), the white-on-black blank persists for 2–5+ seconds. There is no skeleton, no fallback, no spinner.
- Diagnosis: **Evaluation gulf** — user cannot determine if the page is loading
- Fix: Add static HTML SSR fallback inside `<div id="root">` — hero headline, key stats, brand list, contact CTA. Product pages already do this correctly.

**P0.2: Font mismatch — Inter on homepage vs Barlow on product pages**
Homepage CSS loads `Inter` (body font) + `Barlow Condensed` (likely headings in app.js). Product pages and category pages use `Barlow` body + `Barlow Condensed` headings. The switch when navigating from homepage to product page creates a perceptible font identity shift.
- Inter is also listed explicitly in the anti-AI-default font blacklist (`❌ Inter`)
- Fix: Switch homepage body font from Inter to Barlow to match product/category pages

### P1 — Important Issues

**P1.1: Excessive animations (8 animation types)**
`ticker` (40s loop), `act` (28s loop), `fadeUp` ×4 (0.8s each), `pulse` (2s infinite), `shimmer` (hover), `countUp` (0.6s), `glowPulse` (3s infinite), `spin`. For a B2B industrial parts site, animated countups and pulsing glows add noise without communicating trust.
- `@media(prefers-reduced-motion)` IS present ✅ — mitigation in place
- Fix: Remove `glowPulse` (dispatch section) and `pulse` class from non-status elements. Keep `fadeUp` (entrance) and `ticker` (brand strip — serves functional role).

**P1.2: No loading/progress indicator**
The React app loads app.js (large bundle) with no visible feedback. `<noscript>` tag is absent from homepage (unlike product pages which have one).

**P1.3: Skip navigation present ✅ but only for keyboard users**
`<a href="#main-content">Skip to main content</a>` is present — good. But `#main-content` id needs to exist in the React output.

### P2 — Polish

**P2.1: `speakable` schema targets `#faq`** — if the FAQ section has a different ID in React output, speakable is broken.

**P2.2: `noise::before` texture at 3% opacity** — subtle and on-brand. Keep.

**P2.3: Card-shine shimmer effect** — 0.7s shimmer on hover at 4% amber opacity. Subtle, acceptable for dark industrial theme.

---

## 2. Category Page Design

### Score: 72/100 — Consistent with Design System

**What works well:**
- Dark theme (#050505) + Barlow system ✅ — matches product pages
- Sticky filter bar (`top: 60px; z-index: 200`) ✅ — critical for long part lists
- Tab button system for category filtering ✅
- Section ghost numbers (`.section-ghost`, 220px Barlow Condensed at 3% amber) — strong typographic character ✅
- Reveal animations with reduced-motion support ✅
- Noise texture layer ✅ — consistent with product pages

### P1 Issues

**P1.1: Schema bug — "Volvo Undercarriage" in ItemList**
Not a visual design issue but breaks user trust if Google surfaces incorrect breadcrumbs.

**P1.2: Breadcrumb only shows 2 levels**
`Home → Komatsu Spare Parts` — missing the current page (Engine Parts) as level 3. Visually the breadcrumb navigation appears incomplete.

### P2: Filter Bar z-index
`filter-sticky` has `z-index: 200`. Navigation is likely `z-index: 1000`. Correct stacking.

---

## 3. Product Page Design

### Score: 75/100

**What works well:**
- Dark theme, consistent with design system ✅
- Brand pill (amber) + category pill (gray) — clear visual hierarchy ✅
- H1 with `clamp(28px, 5vw, 50px)` — responsive typography ✅
- WhatsApp CTA: `background: #25D366` (WG green as mandated) ✅
- Call CTA: ghost border — secondary hierarchy ✅
- Ghost section numbers ✅
- Related parts auto-fill grid ✅
- Specs table with dark card + separator lines ✅
- Compatible models in columns ✅
- Installation notes section ✅
- Region links section ✅

### P1 Issues

**P1.1: Hero image `loading="lazy"` — LCP concern**
The hero product image in the SSR has `loading="lazy"`. For the initial render before product-page.js executes, this defers the hero image load. Remove the attribute or change to `loading="eager"` on the first product image.

**P1.2: Hero image aspect ratio 500×210px (2.38:1)**
This is an unusually wide banner crop for a product image. The `object-fit: cover` hides most of the image. A 4:3 or square crop would show more of the actual part. Consider 500×375 (4:3) or adjust height to at least 280px.

**P1.3: Product description — 1 sentence**
Visually sparse. A single sentence of body text under the H1 leaves a large visual gap before the CTA buttons. The page reads as: H1 → 1 sentence → image → specs. The image section could move above the description to create a better hero block.

### P2 Issues

**P2.1: `onmouseover/onmouseout` inline event handlers**
Breadcrumb links use inline hover styles via JS (`onmouseover="this.style.color='#F0ECE6'"`). These won't respond to keyboard navigation hover and are non-standard. Use CSS `:hover` instead.

**P2.2: Related parts cards use inline `onmouseover/onmouseout`**
Same issue — borderColor changes via inline handlers. Move to CSS.

**P2.3: Region link tags** — good concept, but 16 country links + 6 India state links could overwhelm the page. Consider collapsing to show 6 and reveal rest on click.

---

## 4. Blog Design

### Score: 40/100 — Critical: Different Design System

### P0 — Blocker

**P0.1: Completely different visual identity**
Blog uses Tailwind CSS with `bg-gray-50` (white/light theme), while ALL other pages use `#050505` dark theme. A user navigating from a product page to the blog lands on what looks like a different website.
- Font: Tailwind system font stack vs Barlow Condensed
- Colors: white background + gray text vs near-black background + off-white text
- CTA style: gradient green button vs solid #25D366

The 5× repeated comment `<!-- Canonical nav: white, sticky, clean -->` with no actual nav content confirms this is an incomplete migration/injection.

**Fix**: Inject the canonical nav and footer from ptc-components.js into blog posts, and switch blog CSS to match the dark design system.

**P0.2: No navigation injected**
Despite 5× canonical nav comments, no nav HTML exists in the blog post. Users landing on a blog post have no way to navigate to products, home, or other brands. Immediate exit with no conversion path.

### P1 Issues

**P1.1: WA button uses gradient green instead of solid #25D366**
`from-green-500 to-emerald-400` gradient. Per design system: WA elements must use solid WG #25D366.

**P1.2: CTA section in blog has dark bg** (`bg-gray-900`) but rest of page is white — creates jarring local dark section amid light page, compounding the design inconsistency.

**P1.3: Content depth** — ~400 words visible. Blog posts should be 800–1500 words minimum for SEO. The 3 visible sections (Daily Checks, 500-Hour Service, Undercarriage Wear) are very brief.

### P2 Issues

**P2.1: Star rating or "trust signals" absent** — blog has no author photo, no "X min read", no publication date visible in the UI (only in schema).

**P2.2: Internal linking to parts** — CTA says "We stock OEM and high-quality aftermarket parts for Volvo, Scania, and Komatsu" — but this mentions Volvo/Scania in a Komatsu maintenance guide. Should link to the specific Komatsu parts category.

---

## Design System Consistency Check

| Element | Homepage | Category | Product | Blog |
|---------|----------|----------|---------|------|
| Background | #050505 ✅ | #050505 ✅ | #050505 ✅ | bg-gray-50 ❌ |
| Body font | Inter ❌ | Barlow ✅ | Barlow ✅ | system ❌ |
| Heading font | Barlow Cond ✅ | Barlow Cond ✅ | Barlow Cond ✅ | system ❌ |
| WA button color | unknown | #25D366 ✅ | #25D366 ✅ | gradient ❌ |
| Nav | ptc-components ✅ | ptc-components ✅ | product-page.js ✅ | comments only ❌ |
| Ghost numbers | ✅ | ✅ | ✅ | ❌ |
| Animations | excessive ⚠️ | clean ✅ | clean ✅ | Tailwind ⚠️ |

---

## Priority Fix List (Round 3 Additions)

| # | Page | Issue | Action |
|---|------|-------|--------|
| D1 | Homepage | No SSR fallback | Add static HTML inside `#root` |
| D2 | Homepage | Inter font instead of Barlow | Change body font in `<style>` block |
| D3 | Blog | No nav injected | Load ptc-components nav into all blog posts |
| D4 | Blog | White theme vs dark theme | Switch blog CSS to dark design system |
| D5 | Blog | WA button gradient | Change to solid #25D366 |
| D6 | Product | Hero image lazy | Remove `loading="lazy"` from SSR hero image |
| D7 | Product | Inline hover handlers | Move to CSS :hover (future refactor) |
