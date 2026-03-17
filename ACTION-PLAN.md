# SEO Action Plan — partstrading.com
**Generated:** 2026-03-17
**Current Score:** 69/100 — Moderate
**Target Score (90 days):** 82–88/100
**Audit Reference:** FULL-AUDIT-REPORT.md

---

## Executive Summary

partstrading.com has strong fundamentals — 70-year brand heritage, excellent TTFB, comprehensive schema coverage, above-average AI readiness, and a well-structured homepage. However, three critical issues are blocking significant SERP performance: (1) broken hreflang implementation across 18,715+ pages, (2) a 9.7MB lazy-loaded video as the LCP element on every page load, and (3) missing `price` in Product schema making all 18,715 product pages ineligible for Google's Product rich results.

Fixing these three issues alone is estimated to unlock: faster mobile loading (LCP improvement), rich result eligibility for 18k+ pages, and elimination of an internationalization signal failure. The remaining actions build topical authority and E-E-A-T signals for long-term ranking durability.

---

## Phase 1 — Immediate Blockers (Week 1–2)

*These fixes address confirmed Critical-severity issues. Execute before any other work.*

---

### Action 1.1 — Fix or Remove Broken Hreflang Tags
**Priority:** Critical | **Effort:** Low | **Impact:** High
**Category:** Technical SEO
**Finding:** All 11 non-English hreflang subdomain targets return HTTP 000. Google receives broken alternate language signals on every page crawl.

**Implementation steps:**

Option A — Remove hreflang temporarily (recommended if translated pages do not exist):
1. Remove all `<link rel="alternate" hreflang="...">` tags from `index.html` except `hreflang="en"` and `hreflang="x-default"`
2. In product page templates, remove all hreflang alternate tags pointing to `/ru/`, `/cn/`, `/te/` etc. paths
3. Re-deploy to Vercel
4. Re-add hreflang only when translated pages actually exist and return HTTP 200

Option B — Deploy translated subdomains (if international expansion is imminent):
1. Create Vercel projects for each subdomain: `ta.partstrading.com`, `ru.partstrading.com`, etc.
2. Set up DNS A records pointing each subdomain to Vercel
3. Ensure each subdomain returns translated content with reciprocal hreflang tags pointing back to `partstrading.com`

**Files to edit:**
- `/Users/aayush/Downloads/PTC Website/index.html` lines 100–112 (homepage hreflang tags)
- All product page templates in `/pages/` directory (lines 24–37 in each)

---

### Action 1.2 — Fix Hero LCP: Add Static WebP Image + Remove `loading="lazy"` from Video
**Priority:** Critical | **Effort:** Medium | **Impact:** Very High
**Category:** Performance / Image Optimization
**Finding:** 9.7MB background video with `loading="lazy"` is the LCP element. Mobile LCP is estimated at 4–8+ seconds.

**Implementation steps:**

1. Create a hero WebP image:
   - Design a static 1920×1080 frame (or representative image) of the hero visual
   - Compress to <150KB using Squoosh or cwebp: `cwebp -q 80 hero.jpg -o hero.webp`
   - Place at `/assets/images/hero.webp` and `/assets/images/hero.jpg` (fallback)

2. Add preload in `<head>` (before line 85 in index.html):
   ```html
   <link rel="preload" as="image" href="/assets/images/hero.webp"
         fetchpriority="high" type="image/webp">
   ```

3. Replace the hero section markup (around line 954–960) to lead with an img element:
   ```html
   <picture>
     <source srcset="/assets/images/hero.webp" type="image/webp">
     <img src="/assets/images/hero.jpg" alt="Heavy equipment spare parts - Parts Trading Company Mumbai"
          width="1920" height="1080" fetchpriority="high"
          class="hero-bg-image absolute inset-0 w-full h-full object-cover">
   </picture>
   <video autoplay loop muted playsinline preload="none"
          class="hero-video absolute inset-0 w-full h-full object-cover"
          aria-hidden="true">
     <source src="/PTC Hero Video.mp4" type="video/mp4">
   </video>
   ```

4. Remove `loading="lazy"` from the video tag
5. Change video `preload` from `"metadata"` to `"none"` (let it load after LCP)
6. Add CSS so the img is positioned as background: `position: absolute; inset: 0; object-fit: cover; z-index: 0;`

**Expected outcome:** Mobile LCP should drop from ~5–8s to <2.5s (Good threshold).

---

### Action 1.3 — Add Price to Product Schema Template
**Priority:** Critical | **Effort:** Low–Medium | **Impact:** Very High
**Category:** Schema / Structured Data
**Finding:** All 18,715 product pages lack `price` in Product `Offer` — ineligible for Product rich results.

**Implementation steps:**

Since these are static HTML pages (likely generated from a template/script), locate the generation source:

1. Find the product page generator (likely a Python/Node script in the project root or `/deployment/`)
2. In the `Offer` object within the JSON-LD block, add:
   ```json
   "offers": {
     "@type": "Offer",
     "priceCurrency": "INR",
     "price": "0",
     "priceValidUntil": "2027-12-31",
     "availability": "https://schema.org/InStock",
     "itemCondition": "https://schema.org/NewCondition",
     "description": "Price on request — contact for quote",
     "seller": {
       "@type": "Organization",
       "name": "Parts Trading Company",
       "url": "https://partstrading.com"
     }
   }
   ```

   Note: Using `"price": "0"` with a description clarifying "contact for quote" is acceptable for quote-based B2B suppliers. Alternatively use `priceSpecification` with a range if typical price ranges are known.

3. Re-generate and re-deploy all product pages

**Expected outcome:** All 18,715 product pages become eligible for Google Product rich results — potential for significant SERP real estate increase.

---

### Action 1.4 — Re-deploy Vercel to Apply Security Headers
**Priority:** Warning | **Effort:** Very Low | **Impact:** Medium
**Category:** Technical SEO / Security
**Finding:** vercel.json correctly defines CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy, but live HTTP responses do not include them.

**Implementation steps:**

1. Verify current Vercel deployment status:
   ```bash
   vercel ls
   vercel inspect [deployment-url]
   ```
2. Check if vercel.json is being committed and pushed:
   ```bash
   git status  # ensure vercel.json is not in .gitignore
   git add vercel.json && git commit -m "Ensure security headers in vercel.json"
   git push
   ```
3. After deployment, verify with:
   ```bash
   curl -I https://partstrading.com | grep -i "content-security\|x-frame\|x-content\|referrer\|permissions"
   ```

**Expected outcome:** Security headers score goes from 45/100 to 95/100; eliminates 5 missing header warnings.

---

## Phase 2 — Quick Wins (Week 2–4)

*High-impact changes with low implementation complexity.*

---

### Action 2.1 — Fix Heading Text Splitting
**Priority:** Warning | **Effort:** Low | **Impact:** Medium
**Category:** On-Page SEO / Accessibility
**Finding:** H1 and H2 tags split text with `<span>` elements causing concatenated words in plain-text extraction: `"BrandsWe Support"`, `"If you haveEarthmovers"`.

**Implementation steps:**

1. Find each heading with animated spans (search for `<h1` and `<h2` in index.html)
2. Ensure whitespace exists around animated text spans:
   ```html
   <!-- Before (broken): -->
   <h1>If you have<span class="animate">Earthmovers,</span>We have the Parts.</h1>

   <!-- After (fixed): -->
   <h1>If you have <span class="animate">Earthmovers,</span> We have the Parts.</h1>
   ```
3. Alternatively, use `::before`/`::after` CSS pseudo-elements for decorative text effects without altering HTML text content
4. Test with: `python3 parse_html.py /tmp/ptc_page.html --url https://partstrading.com --json | python3 -c "import json,sys; data=json.load(sys.stdin); print(data['h1'], data['h2'][:5])"`

---

### Action 2.2 — Fix Organization Schema Logo URL
**Priority:** Warning | **Effort:** Very Low | **Impact:** Low–Medium
**Category:** Schema / Structured Data
**Finding:** Organization schema uses relative `/images/logo.png` — Google requires absolute URL.

**Implementation steps:**

In `index.html` line 122, change:
```json
"logo": "/images/logo.png",
```
to:
```json
"logo": "https://partstrading.com/assets/images/ptc-logo.webp",
```

Also ensure the image at that URL is 112×112px minimum, in JPEG/PNG/WebP format, accessible without authentication.

---

### Action 2.3 — Fix Inventory Number Inconsistency
**Priority:** Warning | **Effort:** Very Low | **Impact:** Medium (trust signal)
**Category:** Content Quality
**Finding:** "5,000+" in hero stats vs "18,000+" in meta description, Organization schema, and body copy.

**Implementation steps:**

1. Determine the actual SKU count (check the product pages directory: 18,715 files in `/pages/`)
2. Use 18,000+ or "18,000+ parts" as the unified figure across:
   - Hero stats section (currently "5000+ Parts in Inventory")
   - Meta description
   - Organization schema `hasOfferCatalog` description
   - Any body copy mentioning the count
3. Search for all instances: `grep -n "5,000\|5000\|18,000\|18000" index.html`

---

### Action 2.4 — Fix Twitter/X Share Link (403 Error)
**Priority:** Warning | **Effort:** Very Low | **Impact:** Low
**Category:** Technical SEO
**Finding:** Twitter share button links to `twitter.com/intent/tweet` which returns 403.

**Implementation steps:**

Find the Twitter share link in index.html and update domain:
```html
<!-- Before: -->
<a href="https://twitter.com/intent/tweet?url=...">X</a>

<!-- After: -->
<a href="https://x.com/intent/tweet?url=...">X</a>
```

---

### Action 2.5 — Add Explicit Width/Height to All img Tags
**Priority:** Warning | **Effort:** Low | **Impact:** Medium (CLS improvement)
**Category:** Image Optimization / Performance
**Finding:** All 13 img tags lack explicit width/height, causing cumulative layout shift.

**Implementation steps:**

Add `width` and `height` to each img tag. For Tailwind-sized images, the intrinsic dimensions should match the CSS display size:
```html
<!-- Logo (currently): -->
<img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company">

<!-- Fixed: -->
<img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company"
     width="160" height="48">

<!-- Brand logo (currently): -->
<img alt="Volvo Logo" class="... w-16 h-16 ..." src="assets/logos/volvo.svg">

<!-- Fixed: -->
<img alt="Volvo spare parts logo" class="... w-16 h-16 ..."
     src="assets/logos/volvo.svg" width="64" height="64">
```

---

### Action 2.6 — Switch Tailwind from CDN to Production Build
**Priority:** Warning | **Effort:** Medium | **Impact:** High (performance)
**Category:** Performance
**Finding:** `<script src="https://cdn.tailwindcss.com/">` loads 300KB+ of unpurged CSS at runtime.

**Implementation steps:**

1. Install Tailwind CLI:
   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```

2. Create `tailwind.config.js`:
   ```js
   module.exports = {
     content: ["./**/*.html", "./assets/js/**/*.js"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

3. Create `assets/css/input.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. Build purged CSS:
   ```bash
   npx tailwindcss -i ./assets/css/input.css -o ./assets/css/tailwind.min.css --minify
   ```

5. Replace in `index.html`:
   ```html
   <!-- Before: -->
   <script src="https://cdn.tailwindcss.com/"></script>

   <!-- After: -->
   <link rel="stylesheet" href="/assets/css/tailwind.min.css">
   ```

6. Run build before each Vercel deployment; add to Vercel build command

**Expected outcome:** CSS payload reduced from ~300KB to <20KB. Significant improvement to render-blocking time.

---

### Action 2.7 — Update Logo img Tag to Use WebP
**Priority:** Warning | **Effort:** Very Low | **Impact:** Low–Medium
**Category:** Image Optimization
**Finding:** Logo img uses PNG; WebP version exists at `ptc-logo.webp`.

**Implementation steps:**

Wrap the logo img in a `<picture>` element:
```html
<!-- Before: -->
<img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company" ...>

<!-- After: -->
<picture>
  <source srcset="/assets/images/ptc-logo.webp" type="image/webp">
  <img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company"
       width="160" height="48" ...>
</picture>
```

---

## Phase 3 — Strategic Improvements (Month 2–3)

*Higher-effort changes that build long-term ranking durability and topical authority.*

---

### Action 3.1 — Build Content Cluster: Brand Hub Articles
**Priority:** Strategic | **Effort:** High | **Impact:** Very High
**Category:** Content Quality / E-E-A-T

**Target:** Publish 20 articles minimum at 1,500+ words each. Focus on:

**Tier 1 — High commercial intent (publish first):**
1. "Volvo FH13 Engine Parts: Complete Guide to OEM vs Aftermarket in India"
2. "Komatsu PC200 Hydraulic Pump: Part Numbers, Symptoms & Sourcing Guide"
3. "Scania R-Series Spare Parts India: What Fleet Managers Need to Know"
4. "CAT 320 Excavator Parts: Aftermarket Alternatives vs Genuine CAT"
5. "Rock Drifter Parts India: Sandvik, Epiroc, Atlas Copco — A Buyer's Guide"

**Tier 2 — Informational / E-E-A-T support:**
6. "How to Read Volvo Part Numbers: A Complete Reference"
7. "OEM vs Aftermarket Heavy Equipment Parts: What's the Real Difference?"
8. "Equipment Downtime Costs in India: Why Fast Parts Sourcing Matters"
9. "Shipping Heavy Equipment Parts to Russia: Customs & Documentation Guide"
10. "India's Mining States: Heavy Equipment Parts Demand by Region"

**Content requirements per article:**
- Minimum 1,500 words
- At least 1 original image or diagram
- Author attribution (a named person with role and years of experience)
- `datePublished` and `dateModified` in Article schema
- 5–10 internal links to relevant product pages and brand hubs
- 3–5 FAQ items at end of article (for AI overview extraction)

---

### Action 3.2 — Create About Page with Team and Credentials
**Priority:** Strategic | **Effort:** Medium | **Impact:** High
**Category:** E-E-A-T

**Implementation steps:**

1. Create `/about.html` with:
   - Company history narrative (1956 founding, key milestones in timeline format)
   - Named team members with roles and years in industry (minimum 3 people)
   - Industry memberships or certifications (IEEMA, CII, ISO if applicable)
   - Photo of the store/warehouse at Vijay Chambers, Grant Road
   - Photo of physical inventory or parts handling

2. Add About link to primary navigation

3. Add `Person` schema for key staff members:
   ```json
   {
     "@type": "Person",
     "name": "[Name]",
     "jobTitle": "Director / Technical Manager",
     "worksFor": { "@type": "Organization", "name": "Parts Trading Company" },
     "knowsAbout": ["Volvo spare parts", "Komatsu excavator parts", "Heavy equipment"],
     "yearsInRole": "30+"
   }
   ```

---

### Action 3.3 — Add Privacy Policy and Terms of Service Pages
**Priority:** Strategic | **Effort:** Low | **Impact:** Medium (Trust / E-E-A-T)
**Category:** E-E-A-T / Technical SEO

**Implementation steps:**

1. Create `/privacy-policy.html` covering:
   - Data collected (name, email, phone via contact form)
   - reCAPTCHA usage (Google's data collection via reCAPTCHA v3)
   - EmailJS usage
   - Google Analytics usage
   - Contact for data requests

2. Create `/terms.html` covering:
   - Quotation terms (non-binding until confirmed in writing)
   - Return/replacement policy for parts
   - Export compliance statement
   - Intellectual property (brand trademarks)

3. Add footer links to both pages

4. Add to Organization schema:
   ```json
   "hasCredential": [
     { "@type": "URL", "url": "https://partstrading.com/privacy-policy.html" }
   ]
   ```

---

### Action 3.4 — Add Verifiable Review Integration
**Priority:** Strategic | **Effort:** Medium | **Impact:** High
**Category:** E-E-A-T / Schema

**Implementation steps:**

1. Claim/optimize Google Business Profile for "Parts Trading Company" at the Mumbai address
2. Request reviews from verified customers — target minimum 25 reviews to validate the 4.8 rating
3. Add Google Business Profile link to the website footer and Contact section
4. Add `Review` schema to homepage for the 3 existing testimonials (with reviewer names):
   ```json
   {
     "@type": "Review",
     "author": { "@type": "Person", "name": "Manoj Kumar Singh" },
     "reviewRating": { "@type": "Rating", "ratingValue": "5" },
     "reviewBody": "We reduced equipment downtime significantly after switching to PTC for our Volvo FH13 parts...",
     "datePublished": "2025-06-01"
   }
   ```
5. List on IndiaMART, TradeIndia, ExportersIndia — collect verified ratings on those platforms
6. Add platform-attributed ratings to homepage (e.g., "4.7 on IndiaMART" with link)

---

### Action 3.5 — Expand ItemList Schema to All 12 Brands
**Priority:** Maintenance | **Effort:** Very Low | **Impact:** Low–Medium
**Category:** Schema

**Implementation steps:**

In index.html, update the ItemList schema (lines 315–361) to include all 12 supported brands:
JCB, Doosan, Liebherr, Atlas Copco/Epiroc, Volvo CE, Bell Equipment — currently only 6 are listed.

---

### Action 3.6 — Merge LocalBusiness and Store Schema; Add @id
**Priority:** Maintenance | **Effort:** Low | **Impact:** Low–Medium
**Category:** Schema

**Implementation steps:**

1. Remove the separate `Store` schema block (lines 299–313)
2. Add `aggregateRating` directly to the `LocalBusiness` schema block
3. Add `"@id": "https://partstrading.com/#localbusiness"` to LocalBusiness
4. Link Organization to LocalBusiness via `"location"` property:
   ```json
   {
     "@type": "Organization",
     ...,
     "location": { "@id": "https://partstrading.com/#localbusiness" }
   }
   ```

---

### Action 3.7 — Create llms-full.txt
**Priority:** Maintenance | **Effort:** Low | **Impact:** Medium (AI readiness)
**Category:** AI Search Readiness

**Implementation steps:**

Create `/llms-full.txt` with comprehensive content for AI systems:
- Company overview (founded 1956, Mumbai, B2B spare parts)
- Complete brand list with equipment types
- Complete product category list with descriptions
- Export markets and shipping capabilities
- Contact information formatted for direct extraction
- FAQ with direct answers
- Key differentiators (70 years, same-day dispatch, OEM + aftermarket)

---

### Action 3.8 — Defer Non-Critical Third-Party Scripts
**Priority:** Strategic | **Effort:** Medium | **Impact:** High (performance)
**Category:** Performance

**Implementation steps:**

1. Defer AOS (Animate on Scroll) — load only after DOMContentLoaded:
   ```html
   <!-- Remove from <head>: -->
   <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
   <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

   <!-- Add before </body>: -->
   <link rel="preload" href="/assets/css/aos.min.css" as="style"
         onload="this.onload=null;this.rel='stylesheet'">
   <script src="/assets/js/aos.min.js" defer></script>
   ```

2. Lazy-load reCAPTCHA — only initialize when the contact form comes into viewport:
   ```javascript
   // Replace eager reCAPTCHA load with IntersectionObserver on the form
   const observer = new IntersectionObserver((entries) => {
     if (entries[0].isIntersecting) {
       const script = document.createElement('script');
       script.src = 'https://www.google.com/recaptcha/api.js?render=...';
       document.head.appendChild(script);
       observer.disconnect();
     }
   });
   observer.observe(document.getElementById('contact'));
   ```

3. Self-host AOS and EmailJS to eliminate external CDN round-trip latency

---

## Phase 4 — Ongoing Maintenance

| Task | Frequency | Owner |
|---|---|---|
| Publish new blog article (1,500+ words) | Monthly (min) | Content team |
| Update blog post dates when refreshed | On revision | Content team |
| Request new customer reviews (Google, IndiaMART) | Quarterly | Sales team |
| Validate sitemap_index.xml for new pages | Monthly | Technical team |
| Check Google Search Console for crawl errors | Weekly | Technical team |
| Monitor Core Web Vitals in Search Console | Monthly | Technical team |
| Verify all product page hreflang alternates resolve | On deployment | Technical team |
| Update `priceValidUntil` in product schema | Annually | Technical team |

---

## Expected Score Impact by Phase

| Phase | Actions | Est. Score Change | Target Score |
|---|---|---|---|
| Baseline | — | — | 69/100 |
| Phase 1 (Weeks 1–2) | Fix hreflang, LCP, product price, redeploy headers | +7–10 | 76–79/100 |
| Phase 2 (Weeks 2–4) | Fix headings, logo schema, inventory number, image dims, Tailwind build | +3–5 | 79–84/100 |
| Phase 3 (Month 2–3) | Content cluster, About page, reviews, Privacy Policy | +4–6 | 83–90/100 |
| Phase 4 (Ongoing) | Content, reviews, maintenance | +2–4 | 85–94/100 |

---

## Quick Reference — Change-to-File Map

| Action | File | Lines |
|---|---|---|
| Remove broken hreflang (homepage) | `/index.html` | 100–112 |
| Add hero WebP preload | `/index.html` | Before line 85 |
| Fix hero video lazy loading | `/index.html` | 956–960 |
| Fix Organization logo URL | `/index.html` | 122 |
| Fix H1/H2 span whitespace | `/index.html` | All heading tags |
| Fix inventory number (stats) | `/index.html` | Hero stats section |
| Fix Twitter share URL | `/index.html` | Social share links |
| Add img width/height attributes | `/index.html` | All `<img>` tags |
| Replace Tailwind CDN | `/index.html` | Line 364 |
| Add product page price to schema | `/pages/*.html` (all) | Offer block in JSON-LD |
| Remove broken hreflang (product pages) | `/pages/*.html` (all) | Lines 24–37 per file |
| Create hero WebP image | `/assets/images/hero.webp` | New file |
| Re-deploy Vercel | `vercel.json` | Confirm current; push |
| Create About page | `/about.html` | New file |
| Create Privacy Policy | `/privacy-policy.html` | New file |
| Create Terms of Service | `/terms.html` | New file |
| Create llms-full.txt | `/llms-full.txt` | New file |

---

*Generated from FULL-AUDIT-REPORT.md (2026-03-17)*
*Prioritization method: Impact × Effort matrix, with Critical severity findings always in Phase 1*
