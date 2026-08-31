# PTC Website — Technical SEO Audit Round 4
**Date:** 2026-05-13  
**Scope:** Technical SEO, Sitemap Validation, Schema Deep-Dive, Backlinks/Authority, Topic Clusters  
**Auditor:** Claude Code (Sonnet 4.6)  
**Note:** All findings from local disk only — Cloudflare blocks live fetching.

---

## Technical SEO Score: 68/100

| Category | Score | Notes |
|---|---|---|
| Crawlability / robots.txt | 10/10 | Clean, explicit, AI-inclusive |
| Sitemap structure | 6/10 | 1,159 invalid URLs with spaces; 41,464 duplicates across sitemap groups |
| Render-blocking resources | 6/10 | app.js loaded without defer on homepage; Google Fonts sync on all pages |
| Core Web Vitals risks | 7/10 | LCP image correctly preloaded; product hero image missing `loading=lazy`; some CLS risk |
| Schema quality | 14/20 | Product schema solid but price:"1" on all pages; Komatsu missing returnPolicy; CAT noscript bug |
| Internal linking | 7/10 | 3+ broken hub links in blog posts; one corrupted `/cat/spare-parts/FreddYshirtmBK4` slug |
| Orphan/404 risk | 8/10 | Brand category indexes all exist; `/volvo/braking/` vs `/volvo/brake-parts/` mismatch found |
| Hreflang | 6/10 | en + x-default only — correct for single-language; no regional variants for IN/AE/RU despite export to 50+ countries |
| Trust signals | 4/10 | No `.well-known/security.txt`; news-sitemap.xml uses wrong domain; no outbound authority links in blog |

---

## 1. Technical SEO Details

### a) robots.txt — `/robots.txt`
**Status: CLEAN — No issues**

- Lines 1–2: Global `Allow: /` — correct
- Lines 8–26: Named bot directives for Google, Bing, Baidu, Yandex (with 1s crawl-delay — appropriate)
- Lines 27–54: AI crawlers explicitly allowed (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) — excellent practice for AI citation indexing
- Lines 56–60: ByteSpider, CCBot disallowed — correct training-data scraper blocks
- Sitemap reference points to correct `sitemap_index.xml`
- **No issues found**

### b) Sitemap structure — see Section 2

### c) 404 / Orphan pages — spot check results

**Confirmed working:**
- `/volvo/engine-parts/` index.html — EXISTS
- `/volvo/index.html` — EXISTS
- `/komatsu/index.html` — EXISTS
- `/cat/index.html` — EXISTS
- `/about.html` — EXISTS
- `/cat/spare-parts/FreddYshirtmBK4.html` — EXISTS (but `FreddYshirtmBK4` is clearly a corrupted slug — see issue #3 below)

**BROKEN internal links found in blog posts:**

| Blog Post | Broken Link | Status |
|---|---|---|
| `blog/komatsu-pc200-parts-india.html` line 182 | `/equipment-models/komatsu/komatsu-pc200-8-parts.html` | MISSING |
| `blog/komatsu-pc200-parts-india.html` line 338 | `/pages/hubs/brand-komatsu.html` | MISSING |
| `blog/komatsu-pc200-parts-india.html` line 339 | `/equipment-models/komatsu/komatsu-pc200-7-parts.html` | MISSING |
| `blog/cat-320-excavator-parts-india.html` line 178 | `/equipment-models/caterpillar/caterpillar-320d-parts.html` | MISSING |
| `blog/cat-320-excavator-parts-india.html` line 339 | `/pages/hubs/brand-cat.html` | MISSING |
| `blog/cat-320-excavator-parts-india.html` line 340 | `/pages/hubs/brand-caterpillar.html` | MISSING |
| `blog/cat-320-excavator-parts-india.html` line 341 | `/equipment-models/caterpillar/caterpillar-320d-parts.html` | MISSING |
| `blog/cat-320-excavator-parts-india.html` line 342 | `/equipment-models/caterpillar/caterpillar-320-parts.html` | MISSING |
| `blog/volvo-spare-parts-guide.html` line 275 | `/volvo/braking/21615193` | MISSING (category should be `/volvo/brake-parts/`) |

**Note:** The `/equipment-models/` directory EXISTS but contains only model-level pages (e.g. `caterpillar-320d-parts.html` is MISSING despite other model pages being present). The `/pages/hubs/` directory does NOT exist at all.

### d) Render-blocking resources

**Homepage (`index.html`):**
```
Line 73: <script src="/assets/js/react.production.min.js" ...>   ← NO defer/async  
Line 74: <script src="/assets/js/react-dom.production.min.js" ...>   ← NO defer/async  
Line 421: <script src="/assets/js/app.js"></script>   ← NO defer/async  
Line 68-69: Google Fonts loaded synchronously   ← render-blocking CSS
```

**Product pages (Volvo, CAT — all share same template):**
```
Line 26: <script src="/assets/js/react.production.min.js" ...>   ← NO defer/async  
Line 27: <script src="/assets/js/react-dom.production.min.js" ...>   ← NO defer/async  
Line 116: <script src="/assets/js/product-page.js"></script>   ← NO defer/async  
```

**Mitigation:** Product pages have a full SSR fallback rendered in `#ptc-ssr`, so the user sees content even before JS executes. This significantly reduces perceived LCP impact of blocking scripts. The React scripts load the hydrated UI on top. Still, blocking two 40KB+ scripts before first byte is suboptimal.

**Google Fonts** — `rel="stylesheet"` without `media="print" onload` pattern = render-blocking. Font swap is not configured.

### e) Core Web Vitals risks

| Metric | Risk Level | Finding |
|---|---|---|
| LCP | LOW | Hero image has `rel="preload" fetchpriority="high"` on homepage (line 63). Product hero image (`engine.jpg`) has explicit `width=500 height=210` — good for LCP. |
| CLS | MEDIUM | Product hero image has fixed dimensions in HTML attribute but uses `style="width:100%;height:210px"` override — could cause layout shift if CSS loads late. No `loading="lazy"` on product hero (which is correct — it IS the LCP candidate). However, React hydration may shift content. |
| INP | MEDIUM | React loaded synchronously before SSR content. Any interaction before React hydrates goes to the SSR static version, which lacks interactive elements. Long hydration time = poor INP window. |
| TTFB | N/A | Cloudflare CDN handles this — no local data available. |

---

## 2. Sitemap Analysis

### Index file: `sitemap_index.xml` (25 child sitemaps)

All child sitemaps have `<lastmod>2026-05-05</lastmod>` or `2026-05-06` — well-dated, consistent.

### Child sitemap URL counts:

| Sitemap | URLs | Issues |
|---|---|---|
| `sitemap-komatsu.xml` | 25,395 | 52 space-containing URLs |
| `sitemap-cat.xml` | 19,704 | 203 space-containing URLs |
| `sitemap-new-products-1.xml` through `8.xml` | 70,463 total | 552 space-containing URLs; 41,464 duplicate with brand sitemaps |
| `sitemap-products-1.xml` | 16,500 | 73 space-containing URLs; mixed `/pages/` and `/volvo/` paths |
| `sitemap-volvo.xml` | 1,405 | 0 issues |
| `sitemap-hitachi.xml` | 1,965 | 0 issues |
| `sitemap-scania.xml` | 1,893 | 0 issues |
| `sitemap-kobelco.xml` | 821 | 0 issues |
| `sitemap-john-deere.xml` | 95 | 1 space-containing URL |
| `sitemap-blog.xml` | 69 | Includes `blog/index.html` — correct |
| `sitemap-main.xml` | 97 | Contains 3 case-study blog URLs also in `sitemap-blog.xml` |
| `sitemap-models.xml` | 1,170 | Not audited in depth |
| `sitemap-india.xml` | 2,184 | Not audited in depth |
| `sitemap-location-1.xml` | 7,056 | Not audited in depth |
| `sitemap-suppliers.xml` | 588 | Not audited in depth |
| `sitemap-equipment.xml` | 391 | Not audited in depth |
| **TOTAL across all sitemaps** | **~207,255** | Before deduplication |

### Critical Sitemap Issues:

**Issue 1: 1,159 URLs with spaces (invalid XML/URL)**  
File: `sitemap-products-1.xml`, `sitemap-cat.xml`, `sitemap-new-products-*.xml`, others  
Example: `https://partstrading.com/products/0.0256 in` (line from sitemap-products-1.xml)  
Spaces in URLs are invalid per RFC 3986 and will cause Googlebot to reject these entries. They should be percent-encoded (`%20`) or the pages should have clean slugs.

**Issue 2: 41,464 duplicate URLs between new-products sitemaps and brand sitemaps**  
`sitemap-new-products-1.xml` through `8.xml` overlap with `sitemap-komatsu.xml` and `sitemap-cat.xml` by 41,464 URLs.  
Total wasted entries: ~41K URLs that Google sees twice.  
Impact: Crawl budget dilution. Google may deprioritize the sitemaps as poorly maintained.

**Issue 3: 3 case-study blog posts duplicate between `sitemap-main.xml` and `sitemap-blog.xml`**  
Affected:
- `https://partstrading.com/blog/case-study-dubai-fleet-scania-volvo.html`
- `https://partstrading.com/blog/case-study-jharkhand-komatsu-mining.html`
- `https://partstrading.com/blog/case-study-nairobi-cat-grader.html`

**Issue 4: `news-sitemap.xml` uses wrong domain**  
Line 5: `<loc>https://partstradingcompany.com/</loc>` — uses `partstradingcompany.com` not `partstrading.com`  
This file is also NOT referenced in `sitemap_index.xml`, making it orphaned and useless.

**Issue 5: `sitemap-products-1.xml` has priority `0.6` on all entries with no `<lastmod>` tags**  
Unlike brand sitemaps which have `<lastmod>`, the products-1 sitemap omits lastmod entirely — Google uses this for recrawl scheduling.

**Issue 6: Volvo sitemap has only 1,405 entries but site has ~12,174 Volvo parts**  
This appears severely undercounting Volvo. The new-products sitemaps cover some of these but the dedicated brand sitemap is incomplete.

---

## 3. Schema Deep-Dive

### Volvo product page: `/volvo/engine-parts/0061335.html`

Schema type: `@graph` containing `Product` + `BreadcrumbList`

**Product schema:**
- `name`, `description`, `mpn`, `sku`, `image` — present
- `brand` → `{"@type":"Brand","name":"Volvo"}` — correct
- `itemCondition` → `NewCondition` — correct (even for aftermarket — matches Google's expectation)
- `aggregateRating` → `{"ratingValue":"4.8","reviewCount":"201"}` — present
- `offers` → `Offer` with `availability: InStock` — present
- `priceSpecification` → `{"price":"1","priceCurrency":"INR"}` — **ISSUE: price "1" is a placeholder**
- `shippingDetails` → 77 destination countries — thorough
- `hasMerchantReturnPolicy` → 7-day return — present
- `BreadcrumbList` → 4-level (Home > Volvo Parts > Volvo Engine Parts > Part) — correct

**Verdict: Strong schema, only price issue**

### CAT product page: `/cat/engine-parts/005602.html`

Schema identical in structure to Volvo — same `@graph` with `Product` + `BreadcrumbList`.

**Differences from Volvo:**
- `reviewCount: 148` (vs 201 for Volvo) — both appear synthetic/templated
- `hasMerchantReturnPolicy` present — same structure
- All shipping destinations identical

**CRITICAL BUG on CAT page (and ~16,223 other CAT pages):**  
Line 100: The `<noscript>` tag is NOT closed before the `<script>const P = {` block.  
The HTML reads: `...Email: parts@partstrad<script>const P = {`  
The email address is truncated mid-string and the `</noscript>` is missing, so the browser treats the `const P = {...}` data variable assignment as noscript text rather than JavaScript, **breaking React hydration** on all affected pages.

```
Line 100: <noscript><h1>...</h1>...<p>WhatsApp: +91-98210-37990 | Email: parts@partstrad<script>const P = {
```

This affects **16,223 CAT pages** and **35 Volvo pages** (confirmed by grep). Komatsu, Hitachi, and Scania pages appear clean.

### Komatsu product page schema (previously analyzed, confirmed):

- Same `Product` + `BreadcrumbList` `@graph` structure
- **Missing `hasMerchantReturnPolicy`** — Komatsu product schema does not include return policy; Volvo and CAT do. This inconsistency means Komatsu products may not show enhanced rich results for return policy.

### Schema comparison summary:

| Feature | Volvo | CAT | Komatsu |
|---|---|---|---|
| Product schema | YES | YES | YES |
| BreadcrumbList | YES | YES | YES |
| shippingDetails (77 countries) | YES | YES | YES |
| hasMerchantReturnPolicy | YES | YES | **NO** |
| price placeholder (:"1") | YES | YES | YES |
| noscript bug | 35 pages | 16,223 pages | NO |

### Blog index page: `/blog/index.html`

**Schema type: `CollectionPage`**  
```json
{
  "@type": "CollectionPage",
  "name": "Knowledge Hub...",
  "publisher": {"@type": "Organization", "name": "Parts Trading Company"}
}
```
Missing: `breadcrumbList`, `dateModified`, `image`. A `CollectionPage` without breadcrumbs won't show breadcrumb rich results in SERPs — add a `BreadcrumbList` (Home > Blog).

### Homepage speakable schema vs SSR content:

Schema at line 57: `"cssSelector": ["#faq", "#home h1", "#home p"]`

SSR content at lines 328 and 361:
```
line 328: <section id="home" ...>
line 361: <section id="faq" ...>
```

**Verdict: MATCH** — the speakable selectors `#home h1`, `#home p`, and `#faq` all have corresponding elements in the SSR fallback. This is correctly configured after the Round 3 fix.

### Category index pages:

Spot-checked `/volvo/index.html`:
- Has `Organization`, `BreadcrumbList`, `ItemList` (6 subcategory links) — good
- No `WebPage` schema explicitly but `ItemList` covers the page type
- `hreflang="en"` + `x-default` present

Spot-checked `/cat/index.html`:
- Same structure: `BreadcrumbList` + `ItemList` — confirmed

---

## 4. Link & Authority Signals

### a) `.well-known/security.txt`
**MISSING** — no `.well-known/` directory at all.  
A `security.txt` is increasingly used as a trust signal for security researchers and some indexers. Low priority but easy win.

### b) Outbound external links in blog posts
**NONE FOUND** — checked `komatsu-excavator-maintenance-guide.html`, `volvo-d13-engine-common-problems-and-fixes.html`, `scania-spare-parts-india-guide.html`, `hitachi-zx200-parts-india.html`.

No outbound links to authoritative sources (manufacturer sites, OEM documentation, industry bodies, IS standards). Blog posts link only to:
- WhatsApp CTAs (`wa.me`)
- Internal product pages
- Other PTC blog posts

**Impact:** Google's E-E-A-T evaluation looks for "expert" signals including citations to primary sources. No outbound links to `volvo.com`, `komatsu.com`, `cat.com`, ISO standards, or industry publications weakens E-E-A-T signals.

### c) Internal links with `rel="nofollow"`
**NONE FOUND** — checked homepage, Volvo product page, CAT product page. No internal nofollow links. Good.

WhatsApp and external CTAs correctly use `rel="noopener"` (not nofollow) — appropriate.

### d) sameAs links in homepage schema
```json
"sameAs": [
  "https://www.instagram.com/partstradingco",
  "https://www.linkedin.com/company/81588687/",
  "https://wa.me/919821037990"
]
```
- Instagram URL: `partstradingco` — valid format
- LinkedIn URL: numeric company ID `81588687` — valid format (but better to use the vanity URL if one exists)
- WhatsApp: included as sameAs — unusual; WhatsApp is not a social profile. Remove from sameAs or replace with actual company website if a secondary domain exists.

### e) hreflang links
- Product pages: `hreflang="en"` + `hreflang="x-default"` present on all sampled pages
- Blog posts: same pattern
- **No regional variants (en-IN, en-AE, en-NG, etc.)** despite serving customers in 50+ countries

**Recommendation:** For highest-volume markets (India, UAE, Nigeria), consider `hreflang="en-IN"` and `hreflang="en-AE"` alongside `en` and `x-default`. This is low priority given single-language content.

---

## 5. Topic Cluster Map & Gap Analysis

### Blog post inventory by brand/topic (88 posts + index.html):

| Brand/Topic | Count | Posts |
|---|---|---|
| **Komatsu** | **19** | PC138, PC200, PC228, PC300, PC400, WA380, D65 dozer, undercarriage, hydraulic pump, engine overheating, maintenance guide, monitor panel, genuine oil, motor grader blade, wheel loader bucket, final drive oil, forklift hydraulic, PC200 vs PC210, bulldozer final drive |
| **CAT/Caterpillar** | **11** | 320 excavator, 323D/325D, 330D, 336 excavator, 950 wheel loader, C9 engine, D6 dozer, C15 rebuild, hydraulic contamination, cat-c9 engine parts |
| **Volvo** | **17** | Spare parts guide, part number ID, EC210 parts, EC300 parts, FH truck, L90 wheel loader, D13 problems, EC210 track tensioning, VCE vs Penta, articulated hauler suspension, wheel loader hydraulic, i-shift transmission, Penta marine maintenance, injector replacement, excavator error codes, serial numbers |
| **Scania** | **14** | Spare parts guide, brake problems, fuel system bleed, brake pad replacement, DC13 engine, R-series maintenance, ADBlue faults, retarder failures, V8 oil consumption, gearbox planet gear, bus air suspension, 500kVA generator, PDE vs HPI injectors, general overview |
| **Hitachi** | **3** | ZX120 parts, ZX200 parts, ZX330 parts |
| **Kobelco** | **3** | SK135 parts, SK210 parts, SK330 parts |
| **John Deere** | **1** | 310K backhoe parts |
| **Case studies** | **3** | Jharkhand Komatsu mining, Dubai Scania/Volvo fleet, Nairobi CAT grader |
| **Generic maintenance** | **21** | OEM vs aftermarket (3 posts), filter replacement, turbocharger failure, hydraulic hose, diesel injector testing, DPF cleaning, bearing clearance, grease for excavator pins, counterfeit parts, rock breaker, concrete pump, crane wire rope, excavator swing motor, alternator wiring, radiator flush, air filter myths, battery maintenance, dump truck hydraulic, cylinder liner cavitation |

### Gap analysis:

**Severely under-covered brands:**
- **Hitachi** — 3 posts, all "X parts India" format only. Zero how-to guides, zero troubleshooting. Brand has 3,521 parts. Missing: ZX series maintenance, EX series final drive, Isuzu engine in Hitachi excavators.
- **Kobelco** — 3 posts, all "X parts India" format. Brand has 820 parts. Missing: SK200 series hydraulics, Kobelco vs Komatsu comparison.
- **John Deere** — 1 post for 95 parts. Missing: 310/410 backhoe maintenance, G-Series excavator, JD engine parts.

**Strong coverage:**
- **Komatsu** — 19 posts with depth: troubleshooting, maintenance, model comparisons. Best cluster.
- **Scania** — 14 posts including engine variants, system-specific guides, case study. Strong.
- **Volvo** — 17 posts with model-specific and technical depth. Strong.

**Missing pillar pages (hub opportunities):**

| Missing Pillar | Rationale | Suggested URL |
|---|---|---|
| `/pages/hubs/brand-komatsu.html` | Linked from blog posts — currently 404 | `/komatsu/parts-guide/` |
| `/pages/hubs/brand-cat.html` | Linked from blog posts — currently 404 | `/cat/parts-guide/` |
| Hitachi Complete Parts Guide | 3,521 parts, only 3 thin blog posts | `/blog/hitachi-excavator-parts-guide.html` |
| Kobelco Complete Parts Guide | 820 parts, no depth blog posts | `/blog/kobelco-excavator-parts-guide.html` |
| India-specific buying guide (consolidated) | Multiple India landing pages in sitemap, no blog pillar | `/blog/heavy-equipment-parts-india-guide.html` |
| Mining equipment parts hub | Jharkhand case study exists but no pillar | `/blog/mining-equipment-parts-india.html` |
| Export/international shipping guide | Shipping to 50+ countries — no content about process | `/blog/export-heavy-equipment-parts-from-india.html` |

**Internal linking issues in blog cluster:**

| Post | Links to | Status |
|---|---|---|
| `komatsu-pc200-parts-india.html` | `/equipment-models/komatsu/komatsu-pc200-8-parts.html` | 404 |
| `komatsu-pc200-parts-india.html` | `/pages/hubs/brand-komatsu.html` | 404 |
| `cat-320-excavator-parts-india.html` | `/equipment-models/caterpillar/caterpillar-320d-parts.html` | 404 |
| `cat-320-excavator-parts-india.html` | `/pages/hubs/brand-cat.html` | 404 |
| `volvo-spare-parts-guide.html` | `/volvo/braking/21615193` | 404 (should be `/volvo/brake-parts/21615193`) |
| `volvo-spare-parts-guide.html` | `/cat/spare-parts/FreddYshirtmBK4` | EXISTS but clearly a corrupted slug |

**Cross-brand linking:** Blog posts occasionally link across brands (e.g., Komatsu post links to CAT product pages). This is SEO-neutral at best. Internal links should primarily pass authority from blog → same-brand category pages.

---

## 6. Prioritized Fix List

### P1 — Critical (Fix within 1 week)

**1. CAT/Volvo noscript bug — 16,258 pages with broken HTML**  
**File pattern:** `/cat/**/*.html` (16,223 pages), `/volvo/**/*.html` (35 pages)  
**Problem:** `<noscript>` block not properly closed before `<script>const P = {` — breaks React hydration on all affected pages  
**Fix:** In the HTML generator for these pages, ensure `</noscript>` appears before `<script>const P = {`. The `</noscript>` tag must close before the data script block begins.  
**Impact:** Hydration failure = poor INP, potential crawl issues, no JS-rendered content for bots that execute JS.

**2. Sitemap invalid URLs — 1,159 URLs with spaces**  
**Files:** `sitemap-cat.xml` (203), `sitemap-new-products-*.xml` (552), `sitemap-products-1.xml` (73), `sitemap-komatsu.xml` (52), others  
**Fix:** URL-encode spaces as `%20` in all `<loc>` tags, OR exclude parts with spaces from sitemaps if those pages have irregular slugs. Run `fix_sitemap_spaces.py` (file exists at root) and verify it covers all files.  
**Impact:** Google rejects invalid XML — these 1,159 URLs are silently ignored by crawlers.

**3. Fix broken blog → hub links (404s)**  
**Files:** `blog/komatsu-pc200-parts-india.html`, `blog/cat-320-excavator-parts-india.html`, `blog/cat-320-excavator-parts-india.html`, `blog/volvo-spare-parts-guide.html`  
**Fix options:** Either (a) create the hub pages that are linked (`/pages/hubs/brand-komatsu.html`, etc.), or (b) redirect/replace the links to existing category indexes (`/komatsu/`, `/cat/`).  
**Priority links to fix:**  
- `blog/komatsu-pc200-parts-india.html` line 182, 338, 339 → redirect to `/komatsu/` or existing model page  
- `blog/cat-320-excavator-parts-india.html` line 178, 339–342 → redirect to `/cat/`  
- `blog/volvo-spare-parts-guide.html` line 275 → change `/volvo/braking/21615193` to `/volvo/brake-parts/21615193`

### P2 — High Priority (Fix within 2 weeks)

**4. Remove or consolidate sitemap-new-products duplicate URLs (41,464 duplicates)**  
**Files:** `sitemap-new-products-1.xml` through `8.xml`  
**Fix:** These 8 sitemaps overlap with `sitemap-komatsu.xml` and `sitemap-cat.xml` by 41K URLs. Either remove the brand-specific URLs from the new-products sitemaps (keep only truly new parts not yet in brand sitemaps), or retire new-products sitemaps entirely once all parts are in brand sitemaps.  
**Impact:** Crawl budget waste; Google may flag sitemap maintenance quality issues.

**5. Fix case-study duplicate entries in sitemap-main.xml vs sitemap-blog.xml**  
**File:** `sitemap-main.xml` lines 5–7  
Remove the 3 blog case-study entries from `sitemap-main.xml`. They belong only in `sitemap-blog.xml`.

**6. Add `hasMerchantReturnPolicy` to Komatsu product schema**  
**File:** Komatsu product page template (generated via script)  
Volvo and CAT pages include this; Komatsu does not. Add the same return policy block to all Komatsu product pages to ensure consistent rich result eligibility.

**7. Fix `app.js` render-blocking on homepage**  
**File:** `index.html` line 421  
Change: `<script src="/assets/js/app.js"></script>`  
To: `<script src="/assets/js/app.js" defer></script>`  
The React scripts on product pages are harder to defer (SSR hydration depends on them loading), but `app.js` on the homepage can safely defer.

### P3 — Medium Priority (Fix within 1 month)

**8. Add outbound authority links to top blog posts**  
Add 1–2 outbound links per post to manufacturer documentation, OEM part lookup tools, or industry standards. Examples:  
- Komatsu posts → link to `partskomatsu.com` or Komatsu service manual references  
- Scania posts → link to Scania parts.com or Scania technical documentation  
- General maintenance posts → link to ISO standards or SAE references  
This strengthens E-E-A-T and aligns with Google's quality guidelines for "helpful content."

**9. Fix `news-sitemap.xml` domain and add to sitemap index**  
**File:** `news-sitemap.xml` line 5  
Change `partstradingcompany.com` to `partstrading.com` and add relevant blog posts as news items.  
Then add to `sitemap_index.xml`:  
```xml
<sitemap>
  <loc>https://partstrading.com/news-sitemap.xml</loc>
  <lastmod>2026-05-13</lastmod>
</sitemap>
```

**10. Add `BreadcrumbList` schema to `blog/index.html`**  
**File:** `blog/index.html` lines 21–34  
Currently has `CollectionPage` but no breadcrumb schema. Add:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Home","item":"https://partstrading.com/"},
    {"@type":"ListItem","position":2,"name":"Blog","item":"https://partstrading.com/blog/index.html"}
  ]
}
```

**11. Create `.well-known/security.txt`**  
Simple trust signal. Content:
```
Contact: mailto:partstrading@gmail.com
Expires: 2027-05-13T00:00:00.000Z
```

**12. Address `price:"1"` in all product schemas**  
All product pages have `priceSpecification.price: "1"` — a placeholder. Google may use this in Shopping rich results with incorrect pricing. Two options:  
- Option A: Remove `priceSpecification` entirely and rely only on the `"Contact for pricing"` description text  
- Option B: Set price to `"0"` with appropriate context (free quote) — but this can also confuse  
- Option C: Keep as-is but add `"description":"Contact for pricing — proforma invoice on request"` (already present)  
Recommended: Remove `priceSpecification` from the schema since no actual price is shown; keep `Offer` with `availability: InStock` only.

### P4 — Lower Priority (Backlog)

**13. Create Hitachi and Kobelco pillar blog posts**  
- `/blog/hitachi-excavator-parts-complete-guide.html` — target `hitachi excavator parts India`, `hitachi zx200 parts`
- `/blog/kobelco-excavator-parts-guide.html` — target `kobelco sk200 parts India`

**14. Create model-level equipment pages for top models**  
The `/equipment-models/caterpillar/` and `/equipment-models/komatsu/` directories exist and some pages are present. Prioritize creating:
- `caterpillar-320d-parts.html` — most-linked missing page
- `komatsu-pc200-7-parts.html` — second-most linked missing page
- `komatsu-pc200-8-parts.html`

**15. Resolve WhatsApp in `sameAs` schema**  
`https://wa.me/919821037990` is a CTA link, not a social profile. Remove from `sameAs` on homepage schema (line 45). Replace with additional social profiles if available (YouTube, Facebook Business).

**16. Consider hreflang for key export markets**  
If content is ever localized for Russian, Arabic, or Indonesian audiences (major export markets), hreflang infrastructure should be in place. Currently, `en` + `x-default` is correct and sufficient for English-only content.

---

## Summary of Findings

| Priority | Issue | Pages Affected | Effort |
|---|---|---|---|
| P1 | CAT/Volvo noscript broken HTML | 16,258 | High (script needed) |
| P1 | Sitemap invalid URLs (spaces) | 1,159 URLs | Low (`fix_sitemap_spaces.py` exists) |
| P1 | Broken blog internal links (404s) | 9 broken links | Low |
| P2 | Sitemap duplicate URLs | 41,464 duplicates | Medium |
| P2 | Komatsu missing returnPolicy schema | 21,606 pages | Medium (template edit) |
| P2 | app.js render-blocking (homepage) | 1 page | Trivial |
| P3 | No outbound authority links in blog | 88 posts | High (content edit) |
| P3 | news-sitemap.xml wrong domain | 1 file | Trivial |
| P3 | blog/index.html missing BreadcrumbList | 1 page | Trivial |
| P3 | price:"1" placeholder in schema | 62,636+ pages | Medium (template edit) |
| P4 | Hitachi/Kobelco blog gap | 0 new posts needed | Medium |
| P4 | Missing equipment model hub pages | ~5 pages | Medium |
