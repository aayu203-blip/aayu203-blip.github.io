# Technical SEO Report — partstrading.com
_Skill: rampstack/seo-technical | Date: 2026-05-04_

---

## Crawlability & Indexing

### ✅ robots.txt — Excellent
- All major search engines explicitly allowed
- AI crawlers explicitly allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended)
- Training scrapers blocked (Bytespider, CCBot)
- Sitemap index referenced correctly
- YandexBot has `Crawl-delay: 1` (appropriate for Russian market)

### ✅ Sitemap Index — Correct structure
- `/sitemap_index.xml` returns 200
- 6 child sitemaps: main + one per brand (volvo, komatsu, cat, scania, hitachi)
- Last-modified date present

### ✅ HTTP → HTTPS Redirect
- `http://partstrading.com/` → `301` → `https://partstrading.com/` ✅
- HSTS header: `max-age=31556952` (~1 year) ✅

### ✅ Canonical Tags
- All product pages have correct canonical: `https://partstrading.com/{brand}/{category}/{partnumber}`
- No trailing slash inconsistency
- Homepage canonical: `https://partstrading.com/` ✅

---

## Rendering & JavaScript SEO

### ✅ Static-first HTML injection
All 53,856 product pages have static HTML injected into `<div id="root">` (confirmed via `ptc-ssr` marker). Googlebot's first-pass HTML parse sees real content without executing JavaScript.

### ⚠️ Homepage still JavaScript-only
The homepage (`index.html`) renders all content via React/Babel. Googlebot must execute ~1.8 MB of JS (including Babel transpiler) to index the homepage content. This is the highest-priority rendering fix.

**Impact**: Homepage indexing depends entirely on Googlebot's JS rendering queue — which is processed days to weeks after crawl. Product pages are not affected (static-first).

### ⚠️ Category index pages (`/volvo/`, `/komatsu/`, etc.)
Category index pages are also React-rendered with no static fallback. These pages rank for brand-level queries and should also receive static-first injection.

---

## On-Page Technical

### ✅ Title Tags
- Homepage: 53 chars — clear, keyword-rich ✅
- Product pages: 49–65 chars, pattern `{Brand} {PartNo} — {Name} | {Category} | PTC` ✅
- Category pages: consistent pattern with brand + "Spare Parts India" ✅

### ⚠️ Product page canonical — missing .html extension
Canonical URLs use `/volvo/engine-parts/20739751` (no `.html`). The actual file is `20739751.html`. If the server returns 404 for the extensionless URL, Google's canonical is unresolvable.

**Check**: Confirm whether GitHub Pages resolves extensionless URLs. GitHub Pages does **not** serve `.html` files without the extension by default unless `permalink: pretty` is configured. This needs immediate verification:
```bash
curl -s -o /dev/null -w "%{http_code}" https://partstrading.com/volvo/engine-parts/20739751
```

### ❌ CAT product pages — generic names
Sample CAT page: `3938990lK.html` has title "CAT 3938990lK — Engine Component | Engine Parts | PTC". "Engine Component" is a fallback name with zero keyword value. CAT catalog has poor name coverage.

**Impact**: ~5,286 CAT product pages may have generic names → weak title tags → poor CTR in SERP.

### ⚠️ Scania product page naming
Sample: `2279226.html` — Title: `Scania 2279226 — Seal | G | Parts Trading Company`. The `| G |` fragment is the brand model field being a single letter. Looks broken in SERP.

---

## Structured Data

### ✅ Homepage schema — comprehensive
Types present: `Organization`, `LocalBusiness`, `WebSite` (with `SearchAction`), `Service`

Notable signals:
- `knowsAbout`: 7 specific expertise areas ✅
- `areaServed`: 10 countries ✅
- `foundingDate: "1956"` ✅
- `aggregateRating: 4.8/250 reviews` ✅
- `availableLanguage`: English, Hindi, Russian, Indonesian, French, Arabic, Chinese ✅

### ✅ Product page schema
Types: `Product`, `Offer`, `BreadcrumbList`, `Organization`, `Brand`, `OfferShippingDetails`
- `shippingDetails` added for 10 countries (recently fixed) ✅
- `PriceSpecification` with description ✅

### ⚠️ No `Review` schema on product pages
Product pages have `aggregateRating` potential but no individual `Review` items. Adding even 2–3 reviews per product page would improve rich snippet eligibility.

### ⚠️ `SearchAction` points to WhatsApp
```json
"target": {"urlTemplate": "https://wa.me/919821037990?text={search_term_string}"}
```
Google's sitelinks search box requires a proper search results URL, not WhatsApp. This schema won't trigger the sitelinks search box. Either fix the URL to point to a real search results page or remove the `SearchAction`.

---

## Security Headers

| Header | Status | Value |
|--------|--------|-------|
| Strict-Transport-Security | ✅ | max-age=31556952 |
| Content-Security-Policy | ❌ Missing | — |
| X-Frame-Options | ❌ Missing | — |
| X-Content-Type-Options | ❌ Missing | — |
| Referrer-Policy | ❌ Missing | — |
| Permissions-Policy | ❌ Missing | — |

**Note**: Hosted on GitHub Pages — CSP and other headers must be set via a CDN layer (Cloudflare) or GitHub Pages custom headers file. GitHub Pages does not support `.htaccess` for response headers (the `.htaccess` file is served as a plain text file, not interpreted).

### ⚠️ .htaccess is publicly readable
`https://partstrading.com/.htaccess` returns 200 with the full file content. While GitHub Pages ignores it, exposing server config is undesirable.

**Fix**: Add to robots.txt: `Disallow: /.htaccess` or rename to prevent accidental exposure.

---

## AEO / AI Search

### ✅ AI Crawlers explicitly allowed in robots.txt
### ✅ Rich entity schema (Organization + LocalBusiness)
### ❌ No llms.txt
`https://partstrading.com/llms.txt` returns 404. See AEO-GEO-REPORT.md.

---

## Priority Fixes

| # | Issue | Impact | Effort |
|---|-------|--------|--------|
| 1 | Verify extensionless canonical URL resolution | Critical | 15 min |
| 2 | Add static-first SSR to homepage | High | 2 hrs |
| 3 | Fix SearchAction to real search URL or remove | Medium | 15 min |
| 4 | Fix CAT page generic names | Medium | batch script |
| 5 | Add security headers via Cloudflare | Medium | 30 min |
| 6 | Create llms.txt | Low | 30 min |
| 7 | Add `Disallow: /.htaccess` to robots.txt | Low | 2 min |
