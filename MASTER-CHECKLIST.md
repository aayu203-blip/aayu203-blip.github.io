# PTC Website — Master Priority Checklist
_Consolidated from: PERFORMANCE, ACCESSIBILITY, SEO-TECHNICAL, SECURITY, ONPAGE-SEO, AEO-GEO reports_
_Last updated: 2026-05-04 (A, C, E, F, G, H, I, M, N, Q completed · D partial · B, J, K, L, O, P, R pending)_

Legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low · ✅ Done

---

## 🔴 TIER 1 — Do These First (Highest Impact, Site-Wide)

### A. Build Pipeline — Eliminate Babel Standalone ✅
> The single biggest win. Babel in-browser (~1.63 MB) causes LCP >4s on mobile. Every page loads it.

- [x] Pre-compile JSX template once with esbuild → `assets/js/product-page.js` (63 KB)
- [x] Strip Babel CDN tag + inline JSX from all 53,856 product pages (strip_babel.py)
- [x] Each page now loads: `<script>const P={...}</script>` + `<script src="/assets/js/product-page.js">`
- [ ] **Paired**: CSP can now drop `unsafe-inline` → tighten security headers (do with item B)

**Effort**: Done · **Reports**: PERFORMANCE (P1), SECURITY

---

### B. Security Headers via Cloudflare
> GitHub Pages can't set response headers. All 5 standard security headers are missing.

- [ ] Move DNS to Cloudflare (free plan, ~15 min)
- [ ] Add Transform Rule: `X-Frame-Options: SAMEORIGIN`
- [ ] Add Transform Rule: `X-Content-Type-Options: nosniff`
- [ ] Add Transform Rule: `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Add Transform Rule: `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [ ] Add Transform Rule: Content-Security-Policy (start permissive, tighten after Babel removed)
- [ ] **Paired**: While in Cloudflare, enable Brotli compression (GitHub Pages only does gzip)

**Effort**: 45 min · **Report**: SECURITY

---

### C. Static-First Rendering — Homepage & Category Pages ✅
> Product pages (53,856) already have static HTML injected. Homepage and 5 brand index pages still JS-only.

- [x] Add static-first HTML injection to `index.html` (homepage) — nav, H1, brand grid, FAQ, footer
- [x] `volvo/index.html` — already had `#seo-static` div from prior work
- [x] `komatsu/index.html` — already had `#seo-static` div
- [x] `cat/index.html` — already had `#seo-static` div
- [x] `scania/index.html` — already had `#seo-static` div
- [x] `hitachi/index.html` — already had `#seo-static` div

**Effort**: Done · **Reports**: SEO-TECHNICAL, PERFORMANCE (P2)

---

## 🟠 TIER 2 — High Impact, Moderate Effort

### D. Product Page Data Quality — CAT & Scania (partial ✅)
> ~2,000–3,000 CAT pages have "Engine Component" as name. Some Scania pages have single-letter model bleeding into title.

- [ ] Enrich CAT names from FridayParts catalog — **blocked**: FridayParts keys (short numeric) don't match CAT part number format. Needs separate data source or manual mapping.
- [x] Fix Scania single-letter model filter: strip model names < 3 chars from title (done via inject_og_tags.py)

**Effort**: CAT enrichment deferred · **Report**: ONPAGE-SEO, SEO-TECHNICAL

---

### E. Add OG Tags to Product Pages ✅
> All 53,856 product pages were missing `og:title`, `og:description`, `og:type="product"`.

- [x] Inject `og:title`, `og:description`, `og:type=product`, `og:url` into all 53,856 product pages
- [x] Scania `| G |` single-char model bleed fixed in og:title simultaneously

**Effort**: Done · **Report**: ONPAGE-SEO

---

### F. Fix SearchAction Schema + Search Results Page ✅
> `WebSite` schema was pointing SearchAction at WhatsApp. Created real search page.

- [x] Created `/search.html` — full search results page using existing `productSearchDB`
- [x] Updated `WebSite` schema `SearchAction.urlTemplate` → `https://partstrading.com/search?q={search_term_string}`
- [x] HeroSearch Enter key now navigates to `/search?q=...` instead of WhatsApp fallback
- [x] Search page: brand filters, show-more pagination, WhatsApp fallback for no results, keyboard-accessible

**Effort**: Done · **Report**: SEO-TECHNICAL

---

### G. Hero Image Preload ✅
- [x] Added `<link rel="preload" as="image" href="assets/images/team-warehouse.jpg" fetchpriority="high">`
- [x] Added `<link rel="dns-prefetch" href="https://ipapi.co">`

**Effort**: Done · **Report**: PERFORMANCE (P2, P5)

---

### H. Accessibility — Contrast + Tab Panel ARIA ✅
- [x] `textMuted` in `DARK_T`: `'#9A9A9A'` → `'#ABABAB'` (4.6:1 contrast ratio)
- [x] EquipmentModels: models grid wrapped in `<div role="tabpanel" aria-labelledby="tab-{brand}">`
- [x] Brand tab buttons get `id="tab-{brand}"` + `aria-controls="tabpanel-{brand}"`

**Effort**: Done · **Report**: ACCESSIBILITY

---

## 🟡 TIER 3 — Medium Impact, Quick Wins

### I. Update llms.txt Part Count ✅
- [x] Updated "18,000+" → "53,000+" in intro paragraph and Key Facts section
- [x] Added per-brand part counts to brand links (Komatsu 25,400+, CAT 20,700+, etc.)
- [x] Added Search Parts link, expanded Export Markets, added Industries Served section

**Effort**: Done · **Report**: AEO-GEO

---

### J. Self-Host CDN Scripts
> React/ReactDOM/Babel load from unpkg.com. Variable latency, especially from India/Africa.

- [ ] Download to `/assets/js/`: `react.production.min.js`, `react-dom.production.min.js`, `babel.min.js`
- [ ] Update `<script src>` on homepage + all pages to use `/assets/js/...`
- [ ] Keep existing SRI hashes — they're the same files
- [ ] **Note**: Makes this a ~moot point if Babel is eliminated (item A). Do this only if item A is delayed.

**Effort**: 30 min · **Report**: PERFORMANCE (P3)

---

### K. Case Studies → Blog Posts
> The 3 case studies (Jharkhand/mining, Dubai/fleet, Nairobi/road) are prime AI citation content. Currently buried in JS-rendered sections — not individually crawlable or citable.

- [ ] Create `/blog/case-study-jharkhand-komatsu-mining.html`
- [ ] Create `/blog/case-study-dubai-fleet-scania-volvo.html`
- [ ] Create `/blog/case-study-nairobi-cat-grader.html`
- [ ] Add `Article` schema to each with `author`, `datePublished`, `headline`, `description`
- [ ] Add to sitemap and blog index
- [ ] **Paired**: Link from the homepage Case Studies section to the new pages

**Effort**: 3 hrs · **Report**: AEO-GEO

---

### L. Search Panel Focus Trap (Accessibility)
> When the full-screen search panel opens, focus should be trapped inside. Current implementation uses a timeout-based focus call — fragile with assistive tech.

- [ ] In `HeroSearch`: on panel open, trap focus to panel container
- [ ] On panel close, return focus to the search trigger button
- [ ] Test with keyboard-only navigation

**Effort**: 1 hr · **Report**: ACCESSIBILITY

---

### M. Remove .htaccess ✅
- [x] Deleted `.htaccess` — had zero effect on GitHub Pages, was publicly readable

**Effort**: Done · **Report**: SECURITY, SEO-TECHNICAL

---

### N. Reduce Google Fonts Payload ✅
- [x] Barlow Condensed: dropped weight 500 (unused) → now loads 600;700;800;900
- [x] Inter: keeps 400;500;600;700 (all used in JSX)

**Effort**: Done · **Report**: PERFORMANCE (P4)

---

## 🟢 TIER 4 — Low Impact / Nice to Have

### O. Add "Popular Parts" Internal Links to Homepage
> Homepage links to categories but never to individual product pages. No internal link equity flows to best/most-searched products.

- [ ] Identify top 8–12 product pages by likely search volume (high-demand part numbers)
- [ ] Add a "Popular Parts" or "Most Searched" section to homepage
- [ ] Link directly to those product pages

**Effort**: 2 hrs · **Report**: ONPAGE-SEO

---

### P. Visible Breadcrumb Navigation on Product Pages
> Breadcrumb is only in JSON-LD schema — no visible `<nav>` element rendered in static HTML.

- [ ] Add visible breadcrumb HTML above H1 in static-first injected content
- [ ] Style to match dark theme

**Effort**: 1 hr · **Report**: ONPAGE-SEO

---

### Q. Add Speakable Schema ✅
- [x] Added `WebPage` + `SpeakableSpecification` JSON-LD targeting `#faq`, `#home h1`, `#home p`

**Effort**: Done · **Report**: AEO-GEO

---

### R. GMC "Vehicles" Category (5 products)
> 5 products incorrectly categorised as "Vehicles" in Google Merchant Center.

- [ ] Identify the 5 affected product pages (check GMC dashboard for URLs)
- [ ] Fix `category` field in their schema

**Effort**: 30 min · **Report**: GMC dashboard (prior session)

---

## ✅ Already Done

- ✅ Body CSS `font-family: 'Barlow'` → `'Inter'` (was missed when B constant was changed)
- ✅ SRI integrity hashes added to React/ReactDOM/Babel on homepage
- ✅ `<link rel="preload">` for React + ReactDOM scripts
- ✅ Skip navigation link added (WCAG 2.4.1)
- ✅ `:focus-visible` styles added (WCAG 2.4.7)
- ✅ `id="main-content"` on `<main>` landmark (WCAG 2.4.3)
- ✅ `useIsMobile` hook + full mobile responsive layout (all sections)
- ✅ Inter font replacing Barlow for body text
- ✅ GMC shipping schema added to all 53,856 product pages
- ✅ GMC image sizes fixed (303×210 → 800×600 equivalents, og:meta corrected)
- ✅ P3-A static-first HTML injection on all 53,856 product pages
- ✅ SRI hashes on product pages (React/ReactDOM/Babel)
- ✅ robots.txt AI crawlers configured
- ✅ llms.txt created
- ✅ Sitemap index with 6 child sitemaps
- ✅ **A**: Babel stripped from all 53,856 product pages → `assets/js/product-page.js` (63 KB replaces 1.63 MB)
- ✅ **C**: Static-first HTML injected into homepage + confirmed on 5 brand index pages
- ✅ **D** (partial): Scania single-char model bleed fixed in titles/og:title
- ✅ **E**: `og:title`, `og:description`, `og:type=product`, `og:url` added to all 53,856 product pages
- ✅ **F**: Search results page created at `/search.html`; WebSite SearchAction schema updated; HeroSearch Enter → `/search?q=...`
- ✅ **G**: Hero image preload + ipapi.co dns-prefetch added to `<head>`
- ✅ **H**: `textMuted` #9A9A9A → #ABABAB (4.6:1 contrast); EquipmentModels tabpanel ARIA added
- ✅ **I**: llms.txt updated to 53,000+ parts with per-brand counts
- ✅ **M**: `.htaccess` deleted (no effect on GitHub Pages, was publicly readable)
- ✅ **N**: Barlow Condensed weight 500 dropped (unused)
- ✅ **Q**: Speakable schema added to homepage

---

_Update this file as items are completed. Change `- [ ]` to `- [x]` and move to Done section._
