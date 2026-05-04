# PTC Website — Master Priority Checklist
_Consolidated from: PERFORMANCE, ACCESSIBILITY, SEO-TECHNICAL, SECURITY, ONPAGE-SEO, AEO-GEO reports_
_Last updated: 2026-05-04_

Legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low · ✅ Done

---

## 🔴 TIER 1 — Do These First (Highest Impact, Site-Wide)

### A. Build Pipeline — Eliminate Babel Standalone
> The single biggest win. Babel in-browser (~1.63 MB) causes LCP >4s on mobile. Every page loads it.

- [ ] Set up Vite build pipeline (`npm create vite@latest`)
- [ ] Convert `<script type="text/babel">` JSX to proper `.jsx` files
- [ ] Run build, verify output replaces inline Babel with compiled bundle (~140 KB)
- [ ] Update deployment to push `dist/` to GitHub Pages
- [ ] **Paired**: Once Babel is gone, CSP can drop `unsafe-inline` → tighten security headers

**Effort**: 1–2 days · **Reports**: PERFORMANCE (P1), SECURITY

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

### C. Static-First Rendering — Homepage & Category Pages
> Product pages (53,856) already have static HTML injected. Homepage and 5 brand index pages still JS-only.

- [ ] Add static-first HTML injection to `index.html` (homepage)
- [ ] Add static-first HTML injection to `volvo/index.html`
- [ ] Add static-first HTML injection to `komatsu/index.html`
- [ ] Add static-first HTML injection to `cat/index.html`
- [ ] Add static-first HTML injection to `scania/index.html`
- [ ] Add static-first HTML injection to `hitachi/index.html`
- [ ] **Paired**: Fixes GMC "Product page unavailable" (475 products), speeds Googlebot indexing

**Effort**: 2–3 hrs · **Reports**: SEO-TECHNICAL, PERFORMANCE (P2)

---

## 🟠 TIER 2 — High Impact, Moderate Effort

### D. Product Page Data Quality — CAT & Scania
> ~2,000–3,000 CAT pages have "Engine Component" as name. Some Scania pages have single-letter model bleeding into title.

- [ ] Identify all CAT pages with generic names: `grep -rl "Engine Component" cat/ | wc -l`
- [ ] Enrich CAT names from FridayParts catalog (`fridayparts_new_catalog.json` has 5,286 CAT entries)
- [ ] Write script to update CAT page titles/descriptions/schema names from catalog
- [ ] Fix Scania single-letter model filter: strip model names < 3 chars from title template
- [ ] Re-run generator for affected pages only
- [ ] **Paired**: Also fix OG tags (see item E below) in the same pass

**Effort**: 1 day · **Report**: ONPAGE-SEO, SEO-TECHNICAL

---

### E. Add OG Tags to Product Pages
> All 53,856 product pages are missing `og:title`, `og:description`, `og:type="product"`.
> Affects social sharing previews (WhatsApp, LinkedIn link unfurls).

- [ ] Write Python script to inject into product page `<head>`:
  ```html
  <meta property="og:title" content="{Brand} {PartNo} — {Name}">
  <meta property="og:description" content="{meta description}">
  <meta property="og:type" content="product">
  ```
- [ ] Run across all 53,856 pages
- [ ] **Paired**: Run together with CAT/Scania name fixes (item D) — same file pass

**Effort**: 1 hr (script) + runtime · **Report**: ONPAGE-SEO

---

### F. Fix SearchAction Schema (Homepage)
> `WebSite` schema has `SearchAction` pointing to WhatsApp (`wa.me/...`). Google requires a real search URL — won't trigger sitelinks search box. Currently misleads Googlebot.

- [ ] Either: replace with a real search URL (e.g. `https://partstrading.com/?q={search_term_string}`) if a search results page exists
- [ ] Or: remove the `SearchAction` block entirely from `WebSite` schema if no search results page
- [ ] **Paired**: While editing homepage schema, also bump `textMuted` color (item H)

**Effort**: 10 min · **Report**: SEO-TECHNICAL

---

### G. Hero Image Preload
> Hero background image (`team-warehouse.jpg`) is set via JS `backgroundImage` CSS — browser can't discover it until React renders, delaying LCP.

- [ ] Add to `<head>` of `index.html`:
  ```html
  <link rel="preload" as="image" href="assets/images/team-warehouse.jpg" fetchpriority="high">
  ```
- [ ] **Paired**: Also add `dns-prefetch` for ipapi.co (geolocation API):
  ```html
  <link rel="dns-prefetch" href="https://ipapi.co">
  ```

**Effort**: 5 min · **Report**: PERFORMANCE (P2, P5)

---

### H. Accessibility — Contrast + Tab Panel ARIA
> `textMuted` (#9A9A9A on #050505) is 3.9:1 — borderline WCAG AA fail (need 4.5:1 for normal text).
> Models section tabs missing `role="tabpanel"` + `aria-controls`.

- [ ] Bump `textMuted` in `DARK_T`: `'#9A9A9A'` → `'#ABABAB'` (4.6:1 contrast)
- [ ] In `EquipmentModels`: wrap models grid in `<div role="tabpanel" aria-labelledby="tab-{brand}">`
- [ ] Add `id="tab-{b.name}"` to each brand tab button
- [ ] **Paired**: While in EquipmentModels, also fix mobile `width: 240` on filter input (already done ✅)

**Effort**: 20 min · **Report**: ACCESSIBILITY

---

## 🟡 TIER 3 — Medium Impact, Quick Wins

### I. Update llms.txt Part Count
> llms.txt claims "18,000+ parts" — site has 53,856. AI assistants will cite the wrong number.

- [ ] Edit `llms.txt`: update "18,000+" → "53,000+"
- [ ] Audit `llms-full.txt` — verify it has comprehensive brand/category/country listing
- [ ] **Paired**: Add per-brand part counts to llms.txt (from homepage BrandGrid data)

**Effort**: 10 min · **Report**: AEO-GEO

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

### M. Remove or Restrict .htaccess
> `.htaccess` is publicly accessible at `/.htaccess` (200). GitHub Pages ignores it anyway.

- [ ] Delete `.htaccess` from repo (it has zero effect on GitHub Pages)
- [ ] Or: add `Disallow: /.htaccess` to `robots.txt` as a minimum

**Effort**: 2 min · **Report**: SECURITY, SEO-TECHNICAL

---

### N. Reduce Google Fonts Payload
> Loading 4 weights for Inter + 5 weights for Barlow Condensed. Audit which weights are actually used.

- [ ] Check which Inter weights are used in JSX (`fontWeight: 400/500/600/700`)
- [ ] Check which Barlow Condensed weights are used
- [ ] Remove unused weights from Google Fonts URL
- [ ] Target: Inter 400+600+700, Barlow Condensed 700+800+900 (drop 500)

**Effort**: 15 min · **Report**: PERFORMANCE (P4)

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

### Q. Add Speakable Schema to FAQ
> Marks FAQ answers as suitable for voice/audio AI responses.

- [ ] Add `Speakable` schema to FAQ section in homepage JSON-LD

**Effort**: 30 min · **Report**: AEO-GEO

---

### R. GMC "Vehicles" Category (5 products)
> 5 products incorrectly categorised as "Vehicles" in Google Merchant Center.

- [ ] Identify the 5 affected product pages (check GMC dashboard for URLs)
- [ ] Fix `category` field in their schema

**Effort**: 30 min · **Report**: GMC dashboard (prior session)

---

## ✅ Already Done (This Session)

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

---

_Update this file as items are completed. Change `- [ ]` to `- [x]` and move to Done section._
