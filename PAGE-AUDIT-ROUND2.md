# Round 2 — Per-Page SEO Audit
*Generated: 2026-05-13*

---

## 1. Homepage — partstrading.com/

### Score: 55/100

| Category | Score | Notes |
|----------|-------|-------|
| Schema | 85/100 | 5 schemas, comprehensive — minor geo precision gap |
| Title & meta | 78/100 | Good title; meta desc clean |
| Technical | 72/100 | Canonical ✅; hreflang ✅; sitemap ✅ |
| Content quality | 10/100 | **CRITICAL: No SSR fallback. AI crawlers see empty div.** |
| Images | 50/100 | Hero preloaded; no alt texts visible (React-rendered) |

### Title Tag ✅
`Heavy Equipment Parts. Today. | Parts Trading Company` — 51 chars, strong hook, brand present.

### Meta Description ✅
`OEM & aftermarket heavy equipment spare parts — Volvo, Scania, Komatsu, CAT & more. 70,000+ parts, same-day dispatch from Mumbai. Est. 1956.` — 143 chars, keyword-rich, no CTA (acceptable for homepage).

### OG Tags ✅ All complete
- og:image 1200×630 ✅ — og:type "website" ✅ — og:site_name ✅

### Twitter Card ✅ summary_large_image + all fields

### Schema Issues
| Schema | Status | Issue |
|--------|--------|-------|
| Organization | ✅ | Complete — founder, sameAs, knowsAbout |
| LocalBusiness | ✅ | Geo only 4 decimal places (18.9603, 72.8191) → should be 5+ |
| WebSite | ✅ | SearchAction sitelinks ✅ |
| Service | ✅ | 10 areaServed countries |
| WebPage | ⚠️ | speakable targets `#faq` — this section doesn't exist in SSR fallback |

### Critical Issue: No Homepage SSR Fallback
`<div id="root"></div>` — completely empty. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) see **zero content**. All statistics, brand lists, CTAs, FAQs — invisible to AI.

**Fix**: Add static HTML inside `<div id="root">` mirroring the key sections: company description, brands list, key stats (70K parts, Est 1956, 50+ countries), FAQ section.

---

## 2. Category Page — partstrading.com/komatsu/engine-parts/

### Score: 65/100

| Category | Score | Notes |
|----------|-------|-------|
| Schema | 55/100 | "Volvo Undercarriage" bug in ItemList position 5 |
| Title & meta | 72/100 | Part count in description ✅; no count in title |
| BreadcrumbList | ⚠️ | Only 2 levels — missing Engine Parts as level 3 |

### Title Tag ⚠️
`Komatsu Engine Parts India | Parts Trading Company` — 50 chars ✅. Missing part count ("7024+ Parts") which is a strong CTR signal.

**Recommended**: `Komatsu Engine Parts India — 7024+ Parts | PTC`

### Meta Description ✅
`Buy Komatsu engine parts in India — 7024+ parts in stock. OEM & aftermarket. Same-day dispatch from Mumbai. WhatsApp +91-98210-37990.` — 136 chars, strong.

### Schema Bug — Volvo Undercarriage in Komatsu Page
```json
{"@type":"ListItem","position":5,"name":"Volvo Undercarriage",
 "url":"https://partstrading.com/komatsu/undercarriage/"}
```
**URL is Komatsu but name says Volvo** — same copy-paste error type as the 69 category pages fixed in Round 1. Must fix: change `"Volvo Undercarriage"` → `"Komatsu Undercarriage"`.

### BreadcrumbList Gap
Only 2 levels: `Home → Komatsu Spare Parts`. Missing `Engine Parts` as level 3 item pointing to this page.

---

## 3. Product Page — komatsu/engine-parts/00863-4410-02400-03060

### Score: 67/100

| Category | Score | Notes |
|----------|-------|-------|
| Schema | 78/100 | Complete; price "1" risk; aggregateRating needs verification |
| Title & meta | 80/100 | Meta desc fixed ✅; OG description still truncated ⚠️ |
| Technical | 72/100 | Canonical ✅; hreflang ✅ |
| Content quality | 45/100 | 1-sentence description; no "What is X?" block |
| Images | 55/100 | Correct alt text ✅; **hero has `loading="lazy"` — LCP issue** |
| Internal linking | 75/100 | Breadcrumbs ✅; related parts ✅; region links ✅ |

### Title Tag ✅
`00863-4410-02400-03060 — Komatsu Starter Motor | In Stock | PTC` — 63 chars ✅ (slightly long but acceptable).

### Meta Description ✅ (Fixed)
`Buy Komatsu 00863-4410-02400-03060 — Starter Motor for Komatsu Engine S6D102 Excavator Pc200 6. OEM-spec aftermarket. Same-day dispatch Mumbai` — 143 chars ✅.

### OG Description ⚠️ Still Truncated
`og:description` still reads: `"...Same-day dispatch Mumbai. WhatsApp +91-982"` — the previous meta description fix did not update OG. Affects ~20,000+ product pages.

### Hero Image `loading="lazy"` ⚠️ LCP Issue
The hero product image in the SSR fallback has `loading="lazy"`. This defers image load until viewport intersection, delaying LCP for the first visible paint. Should be `loading="eager"` (or no attribute). Affects ~62,636 product pages.

### Content Depth — Weak
- Description: 1 sentence. AI crawlers need 134–167 word self-contained answer blocks.
- No "What is a Starter Motor?" definition
- FAQ data exists in `P.faq` (4 questions) — rendered by JS, not in SSR. Consider adding FAQ to SSR.

### SSR Fallback ✅ Strong
Breadcrumbs, H1, specs table, compatible models, CTA buttons all in static HTML. Good for AI crawlers.

---

## 4. Blog Post — komatsu-excavator-maintenance-guide.html

### Score: 53/100

| Category | Score | Notes |
|----------|-------|-------|
| Schema | 65/100 | Article ✅; author ✅; no author sameAs (LinkedIn/Wikipedia) |
| Title & meta | 58/100 | Meta desc short (106 chars); no og:title/og:description |
| Technical | 50/100 | **No canonical tag** ⚠️; no hreflang |
| Content quality | 45/100 | Thin (~400 words); no quick-answer block; no dateline |

### Critical: No Canonical Tag (55/89 posts)
55 of 89 blog posts lack `<link rel="canonical">`. Google may pick an arbitrary URL (with/without .html, with parameters) as canonical. All posts need self-referencing canonical.

### Missing OG Tags (55/89 posts)
55 posts have no `og:title` or `og:description`. Social shares render with no preview. Fix: add both from existing `<title>` and `<meta name="description">`.

### Design System Mismatch — CRITICAL
Blog uses Tailwind CSS + white (`bg-gray-50`) background. Every other page uses dark `#050505` + Barlow Condensed. Visitors landing on blog from product pages see a completely different visual identity. The nav comment repeats 5 times `<!-- Canonical nav: white, sticky, clean -->` with no actual nav injected.

### Article Schema — Author sameAs Missing
`Vinesh Shah` has no `sameAs` links to LinkedIn or Wikipedia, reducing GEO authority signal.

---

## New Bugs to Fix (from Round 2)

| # | Issue | Scope | Priority |
|---|-------|-------|----------|
| B1 | `og:description` still truncated | ~20K+ product pages | High |
| B2 | Hero image `loading="lazy"` | ~62,636 product pages | High |
| B3 | "Volvo Undercarriage" in Komatsu category ItemList | 1 file | Medium |
| B4 | No canonical tag on 55 blog posts | 55 files | High |
| B5 | No og:title / og:description on 55 blog posts | 55 files | High |
| B6 | BreadcrumbList missing level 3 on category pages | Many | Medium |
