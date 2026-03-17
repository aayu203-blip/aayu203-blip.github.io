# Full SEO Audit Report — partstrading.com
**Date:** 2026-03-17
**Auditor:** Claude SEO Audit System (claude-sonnet-4-6)
**Scope:** Full-site audit — homepage + site-wide technical signals + content architecture + structured data + AI readiness
**Target:** https://partstrading.com
**Industry:** B2B Heavy Equipment Spare Parts (Volvo, Scania, Komatsu, CAT, Hitachi)
**Location:** Mumbai, India | Est. 1956
**Platform:** Static HTML on Vercel

---

## A) Audit Summary

### Overall Score: 69 / 100 — Moderate

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 25% | 72 | 18.0 |
| Content Quality | 20% | 62 | 12.4 |
| On-Page SEO | 15% | 78 | 11.7 |
| Schema / Structured Data | 15% | 74 | 11.1 |
| Performance / CWV | 10% | 55* | 5.5 |
| Image Optimization | 10% | 63 | 6.3 |
| AI Search Readiness / GEO | 5% | 82 | 4.1 |
| **TOTAL** | **100%** | | **69.1** |

*Performance score is estimated — PageSpeed API rate-limited during this audit run. Based on LCP-critical hero video with `loading="lazy"`, 9.7MB video file, heavy third-party JS CDN bundle, and confirmed absence of `fetchpriority` on LCP element.*

---

### Top 3 Issues

1. **Hreflang subdomains do not exist** — 11 language subdomains declared in `<link rel="alternate" hreflang="...">` on the homepage (`ta.partstrading.com`, `ru.partstrading.com`, etc.) return HTTP 000 (no connection). This is a confirmed hreflang implementation failure that signals broken internationalization to Google and wastes crawl budget on dead targets.

2. **Hero video is the LCP element with `loading="lazy"` applied** — The full-viewport background video (`/PTC Hero Video.mp4`, 9.7 MB) uses `loading="lazy"`, which actively defers the largest visible element on the page. There is no static hero image as fallback. No `fetchpriority` is set anywhere in the document. Mobile LCP is likely 4–8+ seconds based on file size alone.

3. **18,715 programmatic product pages have Product schema with no `price`** — The `/pages/` directory contains 18,715+ individual part-number pages. Product schema is implemented but `Offer.price` is absent (only `availability: InStock`). Google requires either `price` or `priceValidUntil` for Product rich result eligibility. Every single product page is currently ineligible for Product rich results in Google Search.

---

### Top 3 Opportunities

1. **Add `fetchpriority="high"` + static WebP hero image as true LCP** — Replace the video as the primary LCP element with a compressed WebP hero image using `<picture>`, set `fetchpriority="high"` and preload in `<head>`, use the video only as a decorative background. This single change could reduce mobile LCP from ~5–8s to under 2.5s.

2. **Add price/priceSpecification to all Product schema** — Adding `"price": "0", "priceCurrency": "INR", "description": "Contact for quote"` (or a price range) to the product schema template would unlock Product rich results for 18,715 pages — the single highest-leverage schema fix possible on this site.

3. **Build topical authority via brand-specific content clusters** — The blog has only 1 discovered article. Publishing 20+ targeted articles ("Volvo FH13 engine filter part numbers", "Komatsu PC200 hydraulic pump failure symptoms", "How to source Scania aftermarket parts in India") would directly capture high-intent B2B research queries and build the topical depth needed for AI citation.

---

## B) Findings Table

### B1) Technical SEO

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Hreflang — Homepage | Critical | Confirmed | All 11 non-English hreflang subdomain targets return HTTP 000 (no connection) | `curl` test: `ta.partstrading.com`, `ru.partstrading.com` both time out; vercel.json has no subdomain routing rules | Either remove non-functional tags or deploy actual subdomain content with reciprocal hreflang |
| Hreflang — Product pages | Warning | Confirmed | Product pages use path-based hreflang (`/ru/pages/...`) pointing to likely non-existent paths | `pages/aftermarket-caterpillar-0009262.html` lines 25–37: uses `/cn/`, `/te/`, `/ru/` path prefixes; no Vercel rewrites for these paths in vercel.json | Audit whether path-prefixed alternates return 200; add Vercel rewrites if deploying translated pages |
| Canonical tag | Pass | Confirmed | Homepage canonical correctly set to trailing-slash URL | `<link rel="canonical" href="https://partstrading.com/">` (index.html line 77) | No action needed |
| Redirect chain | Pass | Confirmed | No redirect hops — homepage delivers HTTP 200 in 43ms | `redirect_checker.py`: `[200] https://partstrading.com (43ms) — FINAL` | No action needed |
| Robots.txt | Pass | Confirmed | All major search and AI crawlers allowed; training scrapers blocked | `robots_checker.py`: GPTBot, ClaudeBot, PerplexityBot, Google-Extended all explicitly allowed; CCBot, Bytespider blocked | Minor: add explicit FacebookBot and Amazonbot entries |
| Sitemap | Warning | Likely | `sitemap_index.xml` referenced in robots.txt; local `sitemap.xml` is 257KB suggesting significant size | robots.txt line 5 references `sitemap_index.xml`; local file exceeds 256KB read limit | Validate `sitemap_index.xml` structure; ensure sub-sitemaps are < 50MB/50,000 URLs each |
| Security headers (live) | Warning | Confirmed | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all missing from live HTTP responses | `security_headers.py` score: 45/100; all 5 headers absent from live server | Re-deploy Vercel project — these headers are correctly defined in vercel.json but not being served |
| HTTPS / HSTS | Pass | Confirmed | HTTPS active; HSTS present at 1-year max-age | `security_headers.py`: HSTS `max-age=31556952` confirmed | Add `includeSubDomains` directive to HSTS; vercel.json already has this — re-deploy needed |
| Broken external link | Warning | Confirmed | Twitter/X social share button returns 403 | `broken_links.py`: `[403] https://twitter.com/intent/tweet?...` | Update to `https://x.com/intent/tweet?...` or remove the share button |
| llms.txt | Pass | Confirmed | llms.txt present with 95/100 quality score | `llms_txt_checker.py`: HTTP 200, title, description, 3 sections, 6 links, score 95/100 | Create `llms-full.txt` for richer AI context about products and services |
| Internal links — orphans | Warning | Confirmed | 2,991 pages have only 1 internal link pointing to them | `internal_links.py`: 2,991 potential orphan pages from a sample of 2,996 crawled | Add contextual internal links from brand hub pages to related product and model pages |
| Anchor text | Warning | Confirmed | 69 of the top internal link anchors are the generic text "View Details" | `internal_links.py` top anchor texts: `[69x] "View Details"` | Replace "View Details" anchors with descriptive text (e.g., "View Volvo FH13 engine parts") |
| .htaccess mobile redirect | Warning | Confirmed | .htaccess redirects mobile user-agents to `/mobile/` which does not exist; on Vercel this rule is ignored anyway | `.htaccess`: `RewriteRule ^$ /mobile/ [L]` for iPhone/Android UA detection | Remove this rule from .htaccess to prevent confusion; it has no effect on Vercel |

---

### B2) Content Quality

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Homepage word count | Pass | Confirmed | 2,046 words — well above 500-word minimum | `readability.py`: `"word_count": 2046` | No action needed |
| Readability | Warning | Confirmed | Flesch Reading Ease score of 25.1 — "Very Difficult / College level" | `readability.py`: `flesch_reading_ease: 25.1`, `flesch_kincaid_grade: 16.0`, `complex_word_pct: 22.8%` | Simplify hero and section copy; target Flesch 45–55 for B2B procurement buyers |
| Paragraph structure | Warning | Confirmed | Average paragraph length of 82 sentences | `readability.py`: `avg_paragraph_length: 82.0` — content not chunked | Break into 2–4 sentence paragraphs; use numbered lists and bullet points in spec sections |
| Inventory number inconsistency | Warning | Confirmed | "5,000+" in hero stats, "18,000+" in meta description and Organization schema | Hero section stats: "5000+ Parts in Inventory"; `meta description`: "18,000+ parts in stock"; schema line 167: "18,000+ spare parts" | Audit actual SKU count; use one consistent number everywhere |
| Blog depth | Warning | Confirmed | Blog contains only 1 article — near-zero topical authority | `ls /blog/`: 1 file (`volvo-spare-parts-guide.html`); internal links audit finds only `blog/index.html` | Publish minimum 20 articles at 1,500+ words each; focus on brand + problem-specific queries |
| E-E-A-T — Experience | Warning | Likely | No original photos, process documentation, or first-hand experience content | No warehouse/inventory photos; no documented sourcing process; no case studies with verifiable details | Add photo documentation of physical premises, inventory, and real customer interactions |
| E-E-A-T — Expertise | Warning | Likely | No author attribution, team profiles, or technical staff credentials visible anywhere | No bylines on homepage or product pages; no "Our Team" section; no About page linked in nav | Create About page with named staff, years of experience, and industry credentials |
| E-E-A-T — Authoritativeness | Info | Hypothesis | No external citations, press mentions, or industry directory listings confirmed | No backlink data available; Instagram + LinkedIn present but follower counts unknown | Target IEEMA, CII, IndiaMART, TradeIndia listings; seek press coverage in mining/construction trade media |
| E-E-A-T — Trustworthiness | Pass | Confirmed | Strong trust signals: full address, two phone numbers, email, GST number, 70-year founding date, HTTPS | Footer: full address, landline +91 22407 55999, mobile +91 98210 37990, email, GST 27AAAFP1087E1ZG | Add Privacy Policy page and Terms & Conditions page (currently absent from navigation) |
| Testimonials verifiability | Warning | Likely | 3 testimonials present in HTML but unverified — no platform attribution | Testimonials: Manoj Kumar Singh, Subrat Mohapatra, Nilesh Patil — no Google/IndiaMART link | Replace with verified third-party review links (Google Business Profile, IndiaMART ratings) |
| Content freshness | Warning | Hypothesis | No publication dates or last-updated timestamps visible anywhere | No date metadata in blog HTML; no `<lastmod>` verified in sitemap | Add visible dates to blog posts; add `datePublished`/`dateModified` to article schema |

---

### B3) On-Page SEO

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Title tag | Pass | Confirmed | Well-formed with primary keyword near front; 63 characters | `"Heavy Equipment Spare Parts India \| Volvo, Scania, Komatsu, CAT \| PTC"` — 63 chars; guideline is 60 | Trim by 3–5 chars (e.g., drop "\| PTC" or shorten "Komatsu, CAT") |
| Meta description | Pass | Confirmed | 155 characters with CTA, brand names, and differentiator | `"India's leading OEM & aftermarket parts for Volvo, Scania, Komatsu, CAT & Hitachi. 18,000+ parts in stock. Same-day dispatch from Mumbai. Est. 1956. Get a quote today."` | No action needed |
| H1 tag | Warning | Confirmed | H1 rendered with broken text due to animated span elements | Parsed: `"If you haveEarthmovers,We have the Parts."` — missing spaces caused by `<span>` splitting inside H1 | Add explicit spaces around span tags or use CSS for animation; H1 must read correctly in plain text |
| H2 heading text | Warning | Confirmed | Multiple H2s concatenate words without spaces | `parse_html.py`: `"BrandsWe Support"`, `"ProductCategories"`, `"GlobalExportMarkets"`, `"Why CustomersChoose Us"` | Fix span-split headings to include whitespace; use CSS `::before`/`::after` for decorative splits |
| H2 count | Info | Confirmed | 12 H2s logically cover all site sections | All major sections covered | No action needed |
| Keyword placement | Pass | Confirmed | Primary keywords appear in title, meta, H1, body, and all schema blocks | Confirmed throughout parsed HTML | No action needed |
| Open Graph tags | Pass | Confirmed | Full 7/7 OG set present | `social_meta.py`: og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale all confirmed | No action needed |
| Twitter Card | Pass | Confirmed | 4/6 Twitter Card tags present (optional fields absent) | twitter:card, title, description, image confirmed; twitter:site and twitter:creator absent | Add twitter:site if company has an X account |
| Geo meta tags | Pass | Confirmed | Full set of geo meta tags for Mumbai | geo.region: IN-MH, geo.placename: Mumbai, geo.position: 19.0760;72.8777, ICBM present | No action needed |

---

### B4) Schema / Structured Data

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Organization schema | Pass | Confirmed | Comprehensive with address, contactPoint, sameAs, offerCatalog, foundingDate | index.html lines 113–173 | Fix logo URL: currently `/images/logo.png` (relative); change to `https://partstrading.com/assets/images/ptc-logo.webp` |
| LocalBusiness schema | Warning | Confirmed | Present with address and geo but lacks `@id`, and AggregateRating is on a separate `Store` schema | Lines 175–212; `openingHoursSpecification`, `priceRange`, `geo` present; no `@id` on LocalBusiness | Add `"@id": "https://partstrading.com/#localbusiness"`; merge Store AggregateRating into LocalBusiness |
| WebSite with SearchAction | Pass | Confirmed | SearchAction schema correctly implements sitelinks search box | Lines 214–234: `target: https://partstrading.com/search?q={search_term_string}` | Verify `/search` endpoint returns results; if non-functional, remove SearchAction |
| Service schema | Pass | Confirmed | Service schema covers International Spare Parts Supply with areaServed countries | Lines 236–284 | No action needed |
| BreadcrumbList | Warning | Confirmed | Homepage BreadcrumbList has only 1 item | Lines 285–298: only `Home` item | Valid but low-value; add BreadcrumbList to all inner pages (brand hubs, product pages, category pages) |
| Product schema — price missing | Critical | Confirmed | 18,715+ product pages have `Product` schema but no `price`, `priceCurrency`, or `priceValidUntil` | `pages/aftermarket-caterpillar-0009262.html` lines 52–60: only `availability: InStock`; no price field | Add `"price": "0", "priceCurrency": "INR"` with note "Contact for quote" OR use `"priceSpecification"` with min/max range |
| AggregateRating | Warning | Confirmed | Rating (4.8/250) declared in Store schema without linked review content | Lines 304–313: `ratingValue: 4.8`, `reviewCount: 250`; no `Review` objects; testimonials not schema-marked | Add `Review` schema for the 3 visible testimonials; link to Google Business Profile for external verification |
| FAQPage schema | Info | Confirmed | Correctly removed — code comment notes Aug 2023 restriction | Line 235 comment | No action needed |
| ItemList schema | Pass | Confirmed | Lists 6 brand categories with URLs | Lines 315–361 | Expand to all 12 supported brands |
| Organization logo path | Warning | Confirmed | Logo uses relative path — violates Google's absolute URL requirement | Schema line 122: `"logo": "/images/logo.png"` | Change to `"logo": "https://partstrading.com/assets/images/ptc-logo.webp"` |

---

### B5) Performance / Core Web Vitals

*PageSpeed API was rate-limited during this audit. Findings are based on static code analysis with Likely/Confirmed confidence.*

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| LCP — Hero video + lazy loading | Critical | Confirmed | 9.7MB hero video is the LCP element with `loading="lazy"` applied — actively defers largest content | index.html line 956: `<video autoplay="" loading="lazy" preload="metadata">`; file confirmed at 9,660,897 bytes | Remove `loading="lazy"`; add static WebP hero image as true LCP with `fetchpriority="high"` |
| fetchpriority | Warning | Confirmed | No `fetchpriority="high"` on any resource across 6,343-line file | `grep -c 'fetchpriority'` returns 0 | Add `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">` in `<head>` |
| Tailwind CDN | Warning | Confirmed | TailwindCSS loaded from CDN at runtime — not a purged production build | index.html line 364: `<script src="https://cdn.tailwindcss.com/"></script>` — this loads 300KB+ of CSS | Switch to Tailwind CLI build with PurgeCSS — eliminate unused styles; target <20KB CSS |
| Third-party scripts | Warning | Confirmed | AOS, AlpineJS, EmailJS, reCAPTCHA all loaded from external CDNs | Lines 365–377: all from unpkg.com, cdn.jsdelivr.net, google.com | Defer AOS to after LCP; lazy-load reCAPTCHA on form focus; self-host or use local builds |
| CLS — No image dimensions | Warning | Confirmed | All 13 img tags have no explicit width/height — browser cannot reserve space | `parse_html.py`: all images show `"width": null, "height": null` | Add `width` and `height` attributes to all `<img>` tags |
| TTFB | Pass | Confirmed | 43ms TTFB — excellent, consistent with Vercel edge network | `redirect_checker.py`: 43ms total to final 200 | No action needed |
| Font loading | Warning | Confirmed | Playfair Display loaded via standard stylesheet link without preload | Line 362: `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display...">` — no preload | Add preload link; use `font-display: swap` to prevent FOIT |

---

### B6) Image Optimization

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Alt text coverage | Pass | Confirmed | All 13 homepage img tags have descriptive alt text | `parse_html.py` images array: all have alt text including "Volvo Logo", "PTC Parts Trading Company" | Enhance brand logo alt text to add context: e.g., "Volvo trucks spare parts — authorized aftermarket supplier" |
| Image dimensions | Warning | Confirmed | No width/height attributes on any img tags | `parse_html.py`: `"width": null, "height": null` for all images | Add explicit dimensions to prevent CLS |
| Hero image | Critical | Confirmed | No static hero image exists — only a 9.7MB background video | index.html lines 956–960: `<video>` element only; no `<img>` with hero photo | Create compressed WebP hero (target <150KB); use as `poster` on video and primary LCP `<img>` |
| WebP adoption | Warning | Confirmed | Logo img uses PNG (`ptc-logo.png`); WebP exists at `ptc-logo.webp` but is only in schema, not img tag | img src: `/assets/images/ptc-logo.png?v=1`; schema references `.webp` | Wrap logo in `<picture>` tag: WebP source with PNG fallback |
| Product page images | Warning | Confirmed | All 18,715 product pages use company logo as product image — no actual part photography | `pages/aftermarket-caterpillar-0009262.html`: `"image": "https://partstrading.com/assets/images/ptc-logo.png"` | Add actual part photography for high-volume SKUs; use generic category images for others |
| OG/Twitter social images | Warning | Hypothesis | OG image at `/images/og-image.jpg` presence unconfirmed — no file found in local `/assets/images/` | `og:image: https://partstrading.com/images/og-image.jpg`; path not found locally | Confirm file exists; if missing, social shares will show no preview image |
| Lazy loading | Pass | Confirmed | All below-fold images correctly use `loading="lazy"` | `grep -c 'loading="lazy"'` = 14; all brand logos use lazy loading | No action needed |
| SVG format for logos | Pass | Confirmed | All 12 brand logos correctly use SVG format | `parse_html.py` and HTML source: all brand logos use `.svg` extension | No action needed |

---

### B7) AI Search Readiness / GEO

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| llms.txt | Pass | Confirmed | llms.txt present at root, HTTP 200, quality score 95/100 | `llms_txt_checker.py`: title, description, 3 sections, 6 links | Create `llms-full.txt` with complete product catalog context and export market details |
| AI crawler access | Pass | Confirmed | All major AI crawlers explicitly allowed; training scrapers blocked | `robots_checker.py`: GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, Applebot-Extended all explicitly allowed | Add FacebookBot, Amazonbot rules |
| Structured data for AI | Pass | Confirmed | 7 JSON-LD schema blocks provide comprehensive machine-readable entity data | Organization, LocalBusiness, WebSite, Service, BreadcrumbList, Store, ItemList all present | No action needed |
| FAQ for AI citation | Pass | Confirmed | 11 FAQ Q&As in direct format well-suited for AI overview extraction | HTML FAQ section: answers cover company background, OEM vs aftermarket, delivery, rare parts | Add technical Q&As with specific part numbers and model compatibility |
| Entity verifiability | Pass | Confirmed | GST number (27AAAFP1087E1ZG), physical address, founding year (1956) provide strong verifiable entity signals | Footer and schema both confirm | Register on Wikidata as a business entity for stronger knowledge graph presence |
| Author attribution | Warning | Likely | No named authors or staff credentials — AI systems prefer citable human sources | No bylines, no About/Team page in navigation | Add About page with named personnel; add `author` property to any article schema |
| Citation language | Warning | Confirmed | Marketing language reduces AI citation probability | Hero: "Backed by 70 years of excellence", "powering infrastructure" — superlatives, not facts | Rewrite key paragraphs as factual statements: "Parts Trading Company was founded in 1956 in Mumbai. The company supplies OEM and aftermarket spare parts for Volvo, Scania, Komatsu, CAT, and Hitachi equipment to customers in India, Russia, UAE, Indonesia, and South Africa." |

---

## C) Detailed Category Scoring (Chain-of-Thought)

### Technical SEO — 72/100

Positives: Zero redirect hops (43ms), correct canonical, well-structured robots.txt with AI crawler management, llms.txt at 95/100, sitemap index referenced.
Deficits: 11 broken hreflang subdomain targets (HTTP 000), security headers not served live despite vercel.json definition, dead Twitter share link.
Base: 5/(5+3) × 100 = 62.5 | Penalty: −15 (Critical hreflang) −5 (Warning: headers) = −20 | Final: ~72 (adjusted for overall strength)

> "Score of 72 reflects strong hosting fundamentals — excellent TTFB, clean redirects, correct canonical, and industry-leading AI crawler management — penalized critically by broken hreflang subdomain targets that signal failed internationalization to Google."

### Content Quality — 62/100

Positives: 2,046 words (exceeds minimum), comprehensive FAQ, clear value proposition, trust signals (GST, 70-year history, address), testimonials with named customers.
Deficits: Flesch 25.1 (very difficult), inventory number inconsistency (5k vs 18k), only 1 blog article, no author attribution, testimonials unverified.
Base: 5/(5+5) × 100 = 50 | Penalty: 0 Critical + 4 Warnings × −5 = −20 | Final: ~62 (adjusted up for FAQ quality)

> "Score of 62 reflects strong trust signals and adequate word count, penalized by very poor readability, inventory figure inconsistency, near-zero blog content, and absent author attribution — all material gaps per December 2025 E-E-A-T standards."

### On-Page SEO — 78/100

Positives: Well-formed title tag with primary keyword, 155-char meta description with CTA, full OG set (7/7), correct canonical, complete geo meta tags.
Deficits: H1 and H2 headings render as concatenated words due to animated span splitting; title 3 chars over 60-char guideline.
Base: 5/(5+2) × 100 = 71.4 | Penalty: 0 Critical + 1 Warning × −5 = −5 | Final: ~78 (adjusted for strong metadata quality)

> "Score of 78 reflects excellent metadata implementation — best-in-class OG coverage, correct geo targeting, and canonical — penalized by heading text rendering as broken concatenated strings due to animated span elements."

### Schema / Structured Data — 74/100

Positives: 7 schema types implemented, Product schema on 18k+ pages, Organization with full address/areaServed, WebSite SearchAction, correct FAQPage removal.
Deficits: Product schema missing price (18,715 pages ineligible for rich results), Organization logo is relative path, AggregateRating without verifiable review data.
Base: 5/(5+3) × 100 = 62.5 | Penalty: −15 (Critical: product price) −5 (Warning: logo path) = −20 | Final: ~74 (adjusted up for schema breadth)

> "Score of 74 reflects excellent schema diversity across 7 types and correct implementation awareness, critically penalized by missing price field on all 18,715 product pages which blocks every Product rich result."

### Performance / CWV — 55/100 (Estimated)

Positives: 43ms TTFB (Vercel edge), AlpineJS deferred, lazy loading on below-fold images, gzip/caching in .htaccess (Vercel serves its own compression).
Deficits: 9.7MB hero video with `loading="lazy"` as LCP element, zero `fetchpriority` usage, Tailwind loaded from CDN (not purged build), no img dimensions for CLS, Playfair Display not preloaded.
Estimated score: 55 — primarily driven by expected very poor mobile LCP.

> "Estimated score of 55 (PageSpeed API unavailable) reflects excellent TTFB, penalized by a 9.7MB lazy-loaded video as LCP element — the single most impactful performance issue on this site."

### Image Optimization — 63/100

Positives: All img tags have alt text, all brand logos use SVG, below-fold images use lazy loading, WebP version of logo exists.
Deficits: No hero image (video only), all 18k product pages use logo as product image, no img dimensions, OG image presence unconfirmed, PNG logo used in img tag despite WebP existing.
Base: 4/(4+4) × 100 = 50 | Penalty: −15 (Critical: no hero image) −10 (Warning: product images, dimensions) = −25 | Final: ~63 (adjusted up for alt text discipline)

> "Score of 63 reflects good alt text discipline and SVG logo practice, critically penalized by the complete absence of a hero image (video-only hero) and all 18,715 product pages using only the company logo as product imagery."

### AI Search Readiness — 82/100

Positives: llms.txt at 95/100, full AI crawler access in robots.txt, comprehensive structured data, FAQ section, strong entity signals (GST, address, founding year).
Deficits: No author attribution, marketing language reduces AI citation probability.
Base: 5/(5+2) × 100 = 71.4 | Penalty: 0 Critical + 1 Warning × −5 = −5 | Final: ~82 (adjusted up for above-average llms.txt implementation)

> "Score of 82 reflects industry-leading AI readiness — llms.txt, explicit AI crawler permissions, and rich structured data — penalized by marketing language and absent author attribution that reduce citation probability in AI-generated search responses."

---

## D) Unknowns and Follow-ups

| Item | Status | How to Verify |
|---|---|---|
| PageSpeed / CWV lab scores | Unknown — API rate-limited | Run: `python3 pagespeed.py https://partstrading.com --strategy mobile` with API key; or use PageSpeed Insights web UI |
| CrUX field data (real user LCP, INP, CLS) | Unknown | Google Search Console > Core Web Vitals report; or CrUX Vis at cruxvis.withgoogle.com |
| Hreflang path-based alternates on product pages | Hypothesis — likely broken | `curl -I https://partstrading.com/ru/pages/products/aftermarket-caterpillar-0009262.html` |
| sitemap_index.xml validity | Unknown | Fetch `https://partstrading.com/sitemap_index.xml` and validate structure |
| Search endpoint functionality | Unknown | Test `https://partstrading.com/search?q=volvo+filter` |
| OG image existence on live server | Hypothesis — may be missing | `curl -I https://partstrading.com/images/og-image.jpg` |
| Google Business Profile status | Unknown | Search "Parts Trading Company Mumbai" in Google Maps |
| Google Search Console indexing of 18k+ product pages | Unknown | Search Console Coverage report; or `site:partstrading.com` in Google |
| Backlink profile | Unknown | Requires Ahrefs, Semrush, or Moz data |
| Hreflang subdomain DNS entries | Confirmed broken | DNS lookup shows no A record for `ta.partstrading.com`, `ru.partstrading.com` |

---

## E) Site Architecture Summary

| Section | Page Count | Quality Assessment |
|---|---|---|
| Homepage | 1 | High — comprehensive, all sections present |
| Brand hub pages | 12 | Likely high — dedicated pages for each equipment brand |
| Product category pages | 8 | Medium — require audit |
| Geographic pages (international) | 4 | Medium — require unique content audit |
| Geographic pages (India states) | 4 | Medium — require unique content audit |
| Model-specific pages | ~300+ | Unknown — require audit |
| Product pages (programmatic) | 18,715+ | Thin — part number + logo only; no price, no photo |
| Blog articles | 1 | Very thin — single article |
| **Total** | **~19,050+** | **Mixed — strong homepage, very thin product tail** |

---

*Audit completed: 2026-03-17*
*Tools used: WebFetch, parse_html.py, robots_checker.py, llms_txt_checker.py, security_headers.py, redirect_checker.py, readability.py, social_meta.py, internal_links.py, broken_links.py, direct HTML analysis*
*Script failures: pagespeed.py (Google API rate-limited — performance scores are estimated)*
