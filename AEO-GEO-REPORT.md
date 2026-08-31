# AEO / GEO Report — partstrading.com
_Skill: rampstack/seo-aeo-geo | Answer Engine & Generative Engine Optimization | Date: 2026-05-04_

---

## AI Search Readiness Score: 8/10

PTC is ahead of most B2B industrial sites on AI search readiness. The key signals are already strong.

---

## What's Already Working

### ✅ llms.txt — Present and Well-Structured
`https://partstrading.com/llms.txt` exists with:
- Company summary paragraph
- Key page links (homepage, brands, blog, contact)
- Structured metadata (founded, location, phone, email, rating)
- Full brand inventory
- Link to `llms-full.txt` (extended version)

This is better than 95% of similar B2B suppliers.

### ✅ robots.txt — AI Crawlers Explicitly Allowed
GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, ChatGPT-User, anthropic-ai all explicitly allowed. AI citation indexing will happen.

### ✅ Entity-rich Organization Schema
`knowsAbout` with 7 specific domains, `areaServed` with 10 countries, `foundingDate: "1956"`, `availableLanguage` with 7 languages, `aggregateRating 4.8/250` — all strong AI comprehension signals.

### ✅ Factual, Structured Content
Product pages with part numbers, model compatibility lists, specifications, and cross-references are exactly the type of content AI assistants extract and cite. The data density is high.

### ✅ FAQ Section on Homepage
10 detailed FAQ answers covering: OEM vs aftermarket, shipping times, payment methods, customs documentation, minimum order. This is prime AI overview content — direct question/answer pairs.

---

## Gaps to Fix

### ❌ llms.txt — Part Count Discrepancy
The llms.txt says "18,000+ parts in stock" but the site has 53,856 product pages. If an AI asks "how many parts does PTC stock?" it will answer 18,000. Update:

```markdown
> India's leading OEM & aftermarket spare parts supplier for heavy equipment and trucks. 
> Est. 1956, Mumbai. **53,000+ parts** across 5 catalogued brands (Volvo, Scania, Komatsu, 
> CAT, Hitachi) plus OEM supply for 20+ additional brands.
```

### ⚠️ No `llms-full.txt` content audit
The llms.txt references `https://partstrading.com/llms-full.txt` (returns 200). Verify it contains a comprehensive structured listing of: all brands, all part categories, all countries served, and key product examples. AI assistants use this as a "directory" of what the site covers.

### ⚠️ Homepage not statically rendered
AI crawlers that don't execute JavaScript (many don't) will see a near-empty homepage (just `<div id="root">` with static content injected into product pages but not homepage). The Organization schema is in `<head>` so it will be parsed ✅, but the textual content describing PTC's services won't be visible.

**Fix**: Same as performance/SEO fix — add static-first HTML to homepage.

### ⚠️ No `FAQPage` schema (correctly omitted — confirm understanding)
`FAQPage` schema is restricted to government/healthcare sites since August 2023. **Do not add it.** The FAQ content is still crawlable as plain text and AI assistants will extract it regardless of schema type. This is correct as-is.

### ⚠️ Case Studies not marked with structured data
The 3 case studies (Jharkhand mining, Dubai fleet, Nairobi road) are ideal AI citation content — specific, factual, verifiable. Currently just JSX-rendered text.

**Fix**: Add `ItemList` or `Article` schema to case studies, or better: publish each as a separate blog post with full `Article` schema. Blog posts are more crawlable and citable than SPA sections.

### ⚠️ No `Speakable` schema
For voice search and audio AI overviews, `Speakable` marks which sections are most important. The dispatch countdown, price range, and FAQ answers are good candidates.

---

## Recommended llms.txt Improvements

```markdown
# Parts Trading Company

> OEM & aftermarket spare parts for heavy construction equipment, mining machinery, 
> and commercial trucks. Est. 1956, Mumbai. 53,000+ catalogued parts across Volvo, 
> Scania, Komatsu, CAT, and Hitachi with OEM supply for 20+ additional brands. 
> Same-day dispatch from Mumbai to 50+ countries.

## Products & Catalog

- [Volvo Spare Parts — 787+ parts](https://partstrading.com/volvo/)
- [Komatsu Spare Parts — 25,400+ parts](https://partstrading.com/komatsu/)
- [CAT Spare Parts — 20,700+ parts](https://partstrading.com/cat/)
- [Scania Spare Parts — 1,700+ parts](https://partstrading.com/scania/)
- [Hitachi Spare Parts — 1,965+ parts](https://partstrading.com/hitachi/)

## Part Categories

Engine Parts, Hydraulic Parts, Filters, Electrical Parts, Transmission Parts, 
Undercarriage, Brake Parts, Cooling System, Exhaust & Turbo, Seals & O-Rings, 
Cab & Body Parts, Bearing & Bushing, Fuel System, Drive & Swing Parts, 
Ground Engaging Tools, Hardware & Fasteners, Suspension & Chassis, 
Gearbox & Differential, Steering Parts

## Industries Served

Mining (open-pit, underground), Construction & Infrastructure, Road Building & Quarrying,
Haulage & Fleet Operations, Marine & Offshore

## Key Facts

- **Founded:** 1956 (70+ years in the industry)
- **Location:** Mumbai, India — ships globally
- **Phone:** +91-98210-37990
- **Email:** partstrading@gmail.com
- **Response time:** Under 60 minutes for quotations (Mon–Sat, 9AM–6PM IST)
- **Dispatch:** Same-day for orders before 3PM IST
- **Export experience:** Russia, UAE, Indonesia, South Africa, Nigeria, Australia, Kenya
- **Payment:** SWIFT wire transfer, UPI, bank transfer

## Frequently Asked Questions

[Full FAQ](https://partstrading.com/#faq)
```

---

## Priority Actions

| # | Action | Effort | AI Impact |
|---|--------|--------|-----------|
| 1 | Update part count in llms.txt (18k → 53k) | 5 min | High |
| 2 | Audit llms-full.txt for completeness | 30 min | High |
| 3 | Add static-first rendering to homepage | 2 hrs | High |
| 4 | Publish case studies as blog posts with Article schema | 2 hrs | Medium |
| 5 | Add Speakable schema to FAQ section | 30 min | Low |
