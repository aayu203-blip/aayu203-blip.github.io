# Bespoke Product Pages — FMX Drivetrain Parts
*Reference file for continuity across sessions. Last updated: 2026-05-16.*

---

## What This Is

10 Volvo FMX drivetrain parts that need full bespoke SEO treatment — the same level as the hollow spring page (`volvo/suspension-chassis/20390836.html`). Each part gets a custom hero, technical specs, FAQ schema, blog post support, and internal cross-linking.

**Reference page (already done):** https://partstrading.com/volvo/suspension-chassis/20390836

---

## The 10 Parts

| Part Number | User Description | DB Description | DB Category | Page Exists | Notes |
|-------------|-----------------|----------------|-------------|-------------|-------|
| 22728175 | *(pipe/sleeve)* | Volvo Pipe | Hardware & Fasteners | ✓ `volvo/hardware-fasteners/22728175.html` | Likely prop shaft component — may need category correction |
| 22717828 | Cradle bushing, FMX500 | Craddle Bush | Suspension & Chassis | ✓ `volvo/suspension-chassis/22717828.html` | |
| 22913290 | Cradle assembly / Bogie, FMX500 | Cradel Bush | Steering Parts ⚠️ | ✓ `volvo/steering-parts/22913290.html` | Wrong category — should be Suspension & Chassis |
| 25818663 | Propeller shaft | **NOT IN DB** | — | ✗ NEEDS CREATING | No product page, not in search-db.js |
| 23707800 | Centre bearing | Center Bearing | Bearing & Bushing | ✓ `volvo/bearing-bushing/23707800.html` | |
| 21081177 | Flange | **NOT IN DB** | — | ✗ NEEDS CREATING | No product page, not in search-db.js |
| 23715461 | Clutch plate, FMX500 | Clutch Plate | Transmission Parts | ✓ `volvo/transmission-parts/23715461.html` | |
| 23417523 | Clutch cylinder CPCA, FMX460 | Clutch Slave Cylinder | Brake Parts ⚠️ | ✓ `volvo/brake-parts/23417523.html` | Wrong category — should be Transmission Parts |
| 24211409 | Clutch cylinder CPCA, FMX500 | Clutch Actuator | Transmission Parts | ✓ `volvo/transmission-parts/24211409.html` | |
| 23441664 | Clutch disc, FMX460 | Clutch Disc | Steering Parts ⚠️ | ✓ `volvo/steering-parts/23441664.html` | Wrong category — should be Transmission Parts. Also fits Renault FH/FM/C/K/T (xref: 23463974) |

---

## System Groups

These parts belong to two physical drivetrain systems on the Volvo FMX truck. Group them — each group shares one blog post and links internally.

### Group A — Propeller Shaft Assembly (4 parts)
Physical chain: Propeller shaft → Centre bearing → Flange → Pipe/sleeve

| Part | Description | Status |
|------|-------------|--------|
| 25818663 | Propeller shaft | ✗ Create from scratch |
| 23707800 | Centre bearing | ✓ Standard page exists |
| 21081177 | Flange | ✗ Create from scratch |
| 22728175 | Pipe / sleeve | ✓ Standard page exists (wrong category?) |

**Supporting blog post to create:** `blog/volvo-fmx-propeller-shaft-assembly-guide.html`

---

### Group B — Bogie / Cradle System (2 parts)
FMX500-specific rear bogie suspension components.

| Part | Description | Status |
|------|-------------|--------|
| 22717828 | Cradle bushing, FMX500 | ✓ Standard page exists |
| 22913290 | Cradle assembly / Bogie, FMX500 | ✓ Standard page exists (wrong category — steering → suspension) |

**Supporting blog post to create:** `blog/volvo-fmx500-bogie-cradle-repair-guide.html`

---

### Group C — Clutch System (4 parts) ✅ SPRINT 1 COMPLETE
Highest commercial search volume. FMX460 and FMX500 variants. One part (23441664) also fits Renault trucks — wide audience.

| Part | Description | Status |
|------|-------------|--------|
| 23715461 | Clutch Plate, FMX500 | ✅ Bespoke page + 9 real product images + YouTube video embed |
| 23417523 | Central Slave Cylinder, FMX460 | ✅ Bespoke page (moved from brake-parts → transmission-parts) |
| 24211409 | Clutch Actuator, FMX500 I-Shift | ✅ Bespoke page with VCADS Pro calibration guide |
| 23441664 | Clutch Disc, FMX460 + Renault C/K/T | ✅ Bespoke page (moved from steering-parts → transmission-parts) |

**Supporting blog post:** `blog/volvo-fmx-clutch-replacement-guide.html` ✅ Live

**Cross-reference found in DB for 23441664:**
- Also known as: `23463974`
- Also fits: Volvo 9700, 9900, FH, FM, FMX — and Renault C, K, T (2005 onwards)
- DB entries: `23463974` and `FPPY2603072` both reference 23441664 in their description

---

## Sprint Order (Recommended)

1. **Sprint 1 — Clutch System** (Group C) — do this first, highest ROI
2. **Sprint 2 — Bogie/Cradle System** (Group B) — simpler, 2 parts
3. **Sprint 3 — Propeller Shaft System** (Group A) — most complex, 2 parts need creating

---

## How to Build a Bespoke Page (The Pattern)

The bespoke system works via three `window` globals that product-page.js checks before rendering. If set, these override the standard page layout.

### File: The standard product page
Each part already has (or will have) a standard page like `volvo/transmission-parts/23715461.html`. It loads `product-page.js` which renders the standard layout.

### The override hook (what makes it bespoke)
In the product page HTML, add a `<script>` block BEFORE the product-page.js script tag that sets:

```js
// 1. Override the sidebar section list (labels in the TOC)
window.PTC_CUSTOM_SECS = [
  {id:'sec-hero',    label:'Overview'},
  {id:'sec-specs',   label:'Specifications'},
  {id:'sec-compat',  label:'Compatibility'},
  {id:'sec-install', label:'Installation'},
  {id:'sec-faq',     label:'FAQ'},
  {id:'sec-reading', label:'Related Reading'},
];

// 2. Override the hero HTML
window.PTC_CUSTOM_HERO = function() {
  return '...full hero HTML string...';
};

// 3. Override the main content sections
window.PTC_CUSTOM_SECTIONS = function() {
  return '...all section HTML concatenated as string...';
};
```

### Reference: product-page.js hook location
File: `assets/js/product-page.js`
The hooks are checked in the `render()` function — look for `window.PTC_CUSTOM_HERO`, `window.PTC_CUSTOM_SECS`, `window.PTC_CUSTOM_SECTIONS`.

### Reference: 20390836.html structure (the template to follow)
File: `volvo/suspension-chassis/20390836.html` (~967 lines)
- Lines 1–430: `<head>` with CSS, JSON-LD schemas (Product, FAQPage, BreadcrumbList, Speakable, VideoObject)
- Line 431: `window.PTC_CUSTOM_SECS = [...]`
- Line 452: `window.PTC_CUSTOM_HERO = function() { ... }`
- Line 539: `window.PTC_CUSTOM_SECTIONS = function() { ... }`
- Line ~960: closing `</script>` and product-page.js `<script>` tag

---

## What Each Bespoke Page Must Have

### Hero section elements
- [ ] Part number in monospace amber
- [ ] H1 with descriptive name + model fitment (e.g. "Volvo FMX500 Clutch Plate — 23715461")
- [ ] Star rating row (4.8 ★, N verified orders)
- [ ] Amber rule divider
- [ ] Short copy (2–3 sentences: what it is, what it does, why ours)
- [ ] Cross-reference numbers (OEM alternates, Renault equivalents if applicable)
- [ ] Primary CTA: amber "Get Formal Quote" → WA link
- [ ] Secondary CTA: green "WhatsApp" direct
- [ ] 5 trust badges: Same-day dispatch / Ships 50+ countries / GST invoice + HSN / OEM-spec / 60-min response

### Sections
1. **Technical Specifications** — dimensions, material, OEM spec, torque values where known
2. **Vehicle Compatibility** — explicit table of models (FMX460, FMX500, year ranges)
3. **Installation / Replacement Guide** — step-by-step, tools, torque specs, what to check
4. **FAQ** — minimum 12 questions as both visible accordion AND FAQPage JSON-LD schema
5. **Related Reading** — 4 blog post cards linking to supporting content

### Schema (JSON-LD in `<head>`)
- [ ] `Product` schema with `offers`, `brand`, `sku`, `description`
- [ ] `FAQPage` schema (must match visible FAQ questions exactly)
- [ ] `BreadcrumbList` schema
- [ ] `WebPage` with `Speakable` cssSelectors

---

## Sprint 1 Detailed Brief (Clutch Group — start here)

### Pre-work (DB + category fixes)
- Move 23417523 from `volvo/brake-parts/` → `volvo/transmission-parts/` (update DB url field)
- Move 23441664 from `volvo/steering-parts/` → `volvo/transmission-parts/` (update DB url field)

### Blog post: `blog/volvo-fmx-clutch-replacement-guide.html`
Suggested title: "Volvo FMX Clutch System Replacement — CPCA Cylinder, Clutch Disc & Plate Guide (FMX460 & FMX500)"
Sections: What is the FMX CPCA clutch system · Signs of clutch wear · Replacement procedure · FMX460 vs FMX500 differences · Part numbers to order · FAQ
Must link to: all 4 product pages (23715461, 23417523, 24211409, 23441664)

### Product pages

**23715461 — Clutch Plate FMX500**
- H1: "Volvo FMX500 Clutch Plate — Part 23715461"
- Key specs: friction material, spline count, OD/ID dimensions
- Fits: FMX500 (confirm exact year range)
- Cross-refs: check for Renault equivalents

**23417523 — Clutch Cylinder CPCA FMX460**
- H1: "Volvo FMX460 Clutch Cylinder CPCA — Part 23417523"
- Also known as: 21580956 appears in a DB description mentioning 23417523 as cross-ref
- Key specs: bore diameter, stroke, operating pressure
- Fits: FMX460

**24211409 — Clutch Cylinder CPCA FMX500**
- H1: "Volvo FMX500 Clutch Cylinder CPCA — Part 24211409"
- Sister part to 23417523 (FMX460 equivalent)
- Key specs: same as 23417523 but FMX500 spec

**23441664 — Clutch Disc FMX460**
- H1: "Volvo FMX460 Clutch Disc — Part 23441664 (Also fits FH, FM, FMX, Renault C/K/T)"
- Also known as: 23463974
- Also fits: Volvo 9700, 9900, FH, FM, FMX; Renault C, K, T (2005–present)
- This wide fitment is the biggest SEO opportunity — mention Renault prominently

---

## Sprint 2 Detailed Brief (Bogie/Cradle Group)

### Pre-work
- Move 22913290 from `volvo/steering-parts/` → `volvo/suspension-chassis/` (update DB)

### Blog post: `blog/volvo-fmx500-bogie-cradle-repair-guide.html`
Title: "Volvo FMX500 Bogie Cradle Assembly — Bushing Wear, Inspection & Replacement"
Links to: 22717828 and 22913290 product pages

### Product pages
**22717828 — Cradle Bushing FMX500**
**22913290 — Cradle Assembly / Bogie FMX500**
- These two should cross-link to each other (you replace both together)

---

## Sprint 3 Detailed Brief (Propeller Shaft Group)

### Pre-work (most complex sprint)
Two parts need to be created entirely:

**25818663 — Propeller Shaft**
1. Determine correct category directory (suggest `volvo/drivetrain/` — create if needed, or use `volvo/spare-parts/`)
2. Create standard `volvo/[category]/25818663.html` using product-page.js
3. Add to `assets/js/search-db.js`: `{part:'25818663',desc:'Propeller Shaft',brand:'Volvo',cat:'Drivetrain',url:'/volvo/drivetrain/25818663'}`
4. Then build bespoke overlay

**21081177 — Flange**
Same process. Suggest `volvo/drivetrain/21081177.html`.

**22728175 — Pipe / Sleeve (prop shaft component)**
Currently in `volvo/hardware-fasteners/` — may want to move to `volvo/drivetrain/`. Check with Aayush what this pipe actually is before moving.

### Blog post: `blog/volvo-fmx-propeller-shaft-assembly-guide.html`
Title: "Volvo FMX Propeller Shaft Assembly — Shaft, Centre Bearing, Flange & Sleeve Replacement"
Links to: 25818663, 23707800, 21081177, 22728175

---

## Key File Paths (Quick Reference)

| File | Purpose |
|------|---------|
| `assets/js/product-page.js` | Standard product page renderer — check for `PTC_CUSTOM_HERO/SECTIONS/SECS` |
| `assets/js/search-db.js` | 63,835-entry search database — needs updating when new parts added |
| `assets/js/ptc-components.js` | Shared dark nav + footer injector for blog/utility pages |
| `assets/js/app.js` | Homepage React app (search bar, hero, sections) |
| `volvo/suspension-chassis/20390836.html` | **The template** — copy this structure for every bespoke page |
| `blog/volvo-rubber-spring-20390836-guide.html` | Example of a supporting blog post |

---

## Bespoke Pages Already Done

| Page | Status | Blog support |
|------|--------|-------------|
| `volvo/suspension-chassis/20390836.html` | ✅ Complete | 5 blog posts |
| `volvo/transmission-parts/23715461.html` | ✅ Complete (2026-05-16) | `blog/volvo-fmx-clutch-replacement-guide.html` |
| `volvo/transmission-parts/23417523.html` | ✅ Complete (2026-05-16) | Same blog post |
| `volvo/transmission-parts/24211409.html` | ✅ Complete (2026-05-16) | Same blog post |
| `volvo/transmission-parts/23441664.html` | ✅ Complete (2026-05-16) | Same blog post |

---

## Status Tracking

| Part | DB fixed | Page exists | Bespoke done | Blog done |
|------|----------|-------------|--------------|-----------|
| 22728175 | — | ✓ | ✗ | ✗ |
| 22717828 | — | ✓ | ✗ | ✗ |
| 22913290 | ✗ (category) | ✓ | ✗ | ✗ |
| 25818663 | ✗ (not in DB) | ✗ | ✗ | ✗ |
| 23707800 | — | ✓ | ✗ | ✗ |
| 21081177 | ✗ (not in DB) | ✗ | ✗ | ✗ |
| 23715461 | ✓ | ✓ | ✅ 2026-05-16 | ✅ 2026-05-16 |
| 23417523 | ✓ (moved to transmission) | ✓ | ✅ 2026-05-16 | ✅ 2026-05-16 |
| 24211409 | ✓ | ✓ | ✅ 2026-05-16 | ✅ 2026-05-16 |
| 23441664 | ✓ (moved to transmission) | ✓ | ✅ 2026-05-16 | ✅ 2026-05-16 |

---

## Notes / Things to Clarify with Aayush

- **22728175**: DB says "Volvo Pipe" — what exactly is this? A propeller shaft sleeve? A dust cover? Need to confirm before writing specs.
- **25818663**: No data at all in DB — need the actual part spec (length, spline count, flange type) to write accurate specs.
- **21081177**: Same — need spec data to write the page properly.
- **22913290**: User said "Cradle assly Bogie" — confirm this is the full bogie cradle frame, not just a bushing carrier.
- **FMX460 vs FMX500 year ranges**: Need confirmed production years for each variant to populate compatibility tables accurately.
