# On-Page SEO Report — partstrading.com
_Skill: rampstack/seo-onpage | Date: 2026-05-04_

---

## Homepage

| Element | Value | Assessment |
|---------|-------|------------|
| Title (53c) | "Heavy Equipment Parts. Today. \| Parts Trading Company" | ✅ Good — action-oriented, brand at end |
| Meta desc (140c) | "OEM & aftermarket heavy equipment spare parts — Volvo, Scania, Komatsu, CAT & more. 51,000+ parts, same-day dispatch from Mumbai. Est. 1956." | ✅ Good — USPs clear, within limit |
| Canonical | `https://partstrading.com/` | ✅ |
| H1 | Rendered by React: "Heavy Equipment Parts. Today." | ✅ (static-first not injected yet on homepage) |
| OG title | "PTC — Heavy Equipment Parts. Anywhere. Fast." | ✅ Social-optimized variant |
| OG image | `warehouse-shelves.jpg` 1200×630 | ✅ |
| Schema | Organization, LocalBusiness, WebSite, Service | ✅ Comprehensive |

**Issue**: `keywords` meta tag absent — not a ranking factor but some aggregators use it.

**Issue**: Homepage H1 is only visible after React executes. For Googlebot's first HTML pass, the static-injected `<div id="root">` content does not exist on the homepage (only product pages were injected). Googlebot must render JS to see the H1.

---

## Category Index Pages

All 5 brand index pages (`/volvo/`, `/komatsu/`, `/cat/`, `/scania/`, `/hitachi/`) have:

| Brand | Title | Desc |
|-------|-------|------|
| Volvo | "Volvo Spare Parts India \| OEM & Aftermarket \| Parts Trading Company" | ✅ |
| Komatsu | "Komatsu Spare Parts India \| OEM & Aftermarket \| Parts Trading Company" | ✅ |
| CAT | "CAT Spare Parts India \| OEM & Aftermarket \| Parts Trading Company" | ✅ |
| Scania | "Scania Spare Parts India \| OEM & Aftermarket \| Parts Trading Company" | ✅ |
| Hitachi | "Hitachi Spare Parts India \| OEM & Aftermarket \| Parts Trading Company" | ✅ |

**Assessment**: Good. "Spare Parts India" captures the primary commercial intent for each brand. Descriptions include equipment models (EC, PC, 320 series etc.) which is excellent for long-tail matching.

---

## Product Pages (Sample — 5 pages audited)

### ✅ Title Pattern
`{Brand} {PartNo} — {Name} | {Category} | PTC`

This is nearly optimal for product pages:
- Part number is in title (users search by PN) ✅
- Brand name at start (matches "Volvo 20739751" queries) ✅
- Category provides context ✅
- PTC brand at end ✅

Length range: 49–65 chars — all within ideal range.

### ✅ Meta Descriptions
All follow: `Buy {Brand} {PartNo} — {Name} for {Model list}. OEM-spec aftermarket. Same-day dispatch from Mumbai.`

Includes: model compatibility (long-tail traffic), trust signal ("OEM-spec"), urgency ("Same-day dispatch"), location. Well-structured.

### ✅ Static H1
All product pages have `<h1>` in static HTML: `{PartNo} — {Name}`. Crawlable without JS.

### ✅ Shipping Schema
All product pages have `shippingDetails` for 10 countries. Google Merchant Center compliance fixed.

### ⚠️ CAT pages — generic names
Pages with `name: 'Engine Component'` produce weak titles: `CAT 3938990lK — Engine Component | Engine Parts | PTC`.
- Zero descriptive value for search intent
- "Engine Component" is not a query anyone types
- Estimated ~2,000–3,000 CAT pages affected

**Fix**: Enrich CAT catalog data from FridayParts or OEM parts manuals to get real part names.

### ⚠️ Scania pages — model field bleeding into title
Some Scania pages show `| G |` in title (single-letter model name from catalog). Example: `Scania 2279226 — Seal | G | Parts Trading Company`

**Fix**: Filter model names shorter than 3 characters before including in title template.

### ⚠️ No `og:title` on product pages
The audit shows `og:title: MISSING` on product pages. If product pages are shared on LinkedIn, WhatsApp, etc., the Open Graph preview will have no title.

**Fix**: Add to product page template:
```html
<meta property="og:title" content="{Brand} {PartNo} — {Name}">
<meta property="og:description" content="{meta description}">
<meta property="og:type" content="product">
```

---

## Internal Linking

### ✅ Breadcrumb schema
All product pages have `BreadcrumbList` schema: Home → Brand → Category → Part ✅

### ⚠️ No visible breadcrumb navigation in static HTML
The breadcrumb is only in JSON-LD schema — there's no visible `<nav>` breadcrumb rendered in static HTML. Googlebot can parse the schema breadcrumb, but users (and Googlebot's visual render) see no navigation trail.

### ⚠️ Homepage → product pages — no direct links
The homepage doesn't link to any individual product pages. Internal link equity flows from homepage → category pages (via nav) → product pages, but there are no featured/popular part links on the homepage.

**Opportunity**: Add a "Popular Parts" section or "Recently Searched" to homepage linking to high-value product pages.

---

## URL Structure

- Product pages: `/volvo/engine-parts/20739751` — clean, no tracking params ✅
- Canonical uses extensionless URL; GitHub Pages resolves both with/without `.html` ✅
- All lowercase ✅
- Hyphens as separators ✅

---

## Priority Fixes

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Add `og:title`, `og:description`, `og:type=product` to product page template | Python script, 30 min | Medium |
| 2 | Filter single-char model names from Scania/other titles | Python script, 20 min | Medium |
| 3 | Enrich CAT generic part names from catalog | Data work, days | High (2k+ pages) |
| 4 | Add static-first injection to homepage | 2 hrs | High |
| 5 | Add "Popular Parts" section to homepage with internal links | 1 hr | Medium |
| 6 | Add visible breadcrumb nav to product pages | 1 hr | Low |
