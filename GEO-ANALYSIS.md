# GEO Analysis — partstrading.com
*Generated: 2026-05-13*

## GEO Readiness Score: 31/100

| Dimension | Score | Weight |
|-----------|-------|--------|
| Citability (passage quality) | 35/100 | 25% |
| Structural readability | 45/100 | 20% |
| Multi-modal content | 20/100 | 15% |
| Authority & brand signals | 30/100 | 20% |
| Technical accessibility | 25/100 | 20% |

---

## Platform Breakdown

| Platform | Est. Visibility | Key Gap |
|----------|----------------|---------|
| Google AI Overviews | ~25% | JS rendering; no passage blocks |
| ChatGPT | ~10% | GPTBot blocked (robots.txt conflict) |
| Perplexity | ~10% | PerplexityBot blocked (robots.txt conflict) |
| Bing Copilot | ~20% | Good Bingbot access; Bing Places unclaimed |

---

## 1. AI Crawler Access Status — CRITICAL

### robots.txt has a fatal conflict

The Cloudflare-managed block at the TOP of robots.txt disallows all major AI crawlers:
```
User-agent: GPTBot
Disallow: /          ← first rule (Cloudflare block)

...later...

User-agent: GPTBot
Allow: /             ← second rule (custom block)
```

Crawlers that honor first-match (common): **GPTBot, ClaudeBot, PerplexityBot, Google-Extended** are all BLOCKED.

| Crawler | Status | Impact |
|---------|--------|--------|
| GPTBot (ChatGPT) | ⛔ CONFLICTED — likely blocked | ChatGPT can't index site |
| ClaudeBot (Anthropic) | ⛔ CONFLICTED — likely blocked | Claude can't index site |
| PerplexityBot | ⛔ NOT in robots.txt custom block | Perplexity blocked |
| Google-Extended (AI Overviews) | ⛔ CONFLICTED — likely blocked | AI Overviews blocked |
| Bingbot | ✅ Allowed | Bing Copilot works |
| Googlebot | ✅ Allowed | Standard Google search works |

**Fix**: Remove or replace the Cloudflare-managed block. Keep only the custom section.

---

## 2. llms.txt Status

**MISSING** — No `/llms.txt` file found (403 response).

Recommended file (ready to deploy):

```
# Parts Trading Company
> India's heavy equipment spare parts supplier since 1956. OEM and aftermarket parts for Volvo, Scania, Komatsu, CAT, Hitachi, Kobelco, and John Deere. Same-day dispatch from Mumbai. Serving 50+ countries.

## About
- [About PTC](https://partstrading.com/about.html): Founded 1956 by Rasik Shah at Grant Road Mumbai. Three generations of the Shah family. Exports to mining, construction, and transport industries worldwide.

## Product Catalog (62,000+ parts)
- [Volvo Parts](https://partstrading.com/volvo/): Engine, hydraulic, filters, electrical, transmission — 12,174 parts
- [CAT Parts](https://partstrading.com/cat/): Full Caterpillar catalog — 21,100 parts
- [Komatsu Parts](https://partstrading.com/komatsu/): Excavator, dozer, wheel loader — 21,606 parts
- [Scania Parts](https://partstrading.com/scania/): Truck and bus components — 3,320 parts
- [Hitachi Parts](https://partstrading.com/hitachi/): Excavator and crane parts — 3,521 parts

## Blog & Technical Resources
- [Blog](https://partstrading.com/blog/): Maintenance guides, case studies, troubleshooting (89 articles)

## Contact
- WhatsApp: +91-98210-37990
- Email: partstrading@gmail.com
- Address: 1st Floor, Vijay Chambers, Grant Road East, Mumbai 400004, India
- Hours: Mon–Sat 9 AM–6 PM IST
```

---

## 3. Brand Mention Analysis

| Platform | Status | Notes |
|----------|--------|-------|
| Wikipedia | ❌ Not detected | No Wikipedia page for PTC |
| Reddit | ❌ Not detected | No r/ mentions found |
| YouTube | ❌ Not detected | No YouTube channel found |
| LinkedIn | ✅ Present | linkedin.com/company/81588687 listed in schema |
| Instagram | ✅ Present | @partstradingco listed in schema |

**Brand mentions correlate 3× more with AI citations than backlinks.** YouTube is the highest-correlated signal (0.737). PTC has zero presence here — major gap.

---

## 4. Server-Side Rendering Check

**CRITICAL GAP — All product pages are JavaScript-rendered.**

- Homepage: React app (`app.js`) — AI crawlers see empty `<div id="root">` 
- Product pages: vanilla JS IIFE (`product-page.js`) — AI crawlers can't execute JS
- BUT: Product pages have a static SSR fallback inside `id="root"` with:
  - H1 with part name ✅
  - Breadcrumbs ✅
  - Specs table ✅
  - Compatible models ✅
  - CTA links ✅
  
The SSR fallback is good but minimal compared to the full rendered page. The homepage has NO SSR fallback — AI crawlers see only `<div id="root"></div>`.

---

## 5. Passage-Level Citability

**Weak.** The static SSR content on product pages is:
- Part name + basic description (1 sentence): "OEM-specification Komatsu Engine Component."
- Specs table (not narrative text)
- No "What is X?" definition blocks
- No 134–167 word self-contained answer blocks

Blog posts are the only citable content (89 articles, good structure, Article schema with author).

**Homepage**: The React app renders statistics and claims but AI crawlers see nothing since there's no SSR fallback on the homepage.

---

## Top 5 Highest-Impact Changes

1. **[CRITICAL] Fix robots.txt** — Remove Cloudflare block blocking GPTBot, ClaudeBot, PerplexityBot, Google-Extended. Estimated impact: immediate AI crawler access restored.

2. **[HIGH] Add llms.txt** — Deploy the template above to `/llms.txt`. Gives AI crawlers structured guidance about site content.

3. **[HIGH] Add homepage SSR fallback** — Add static HTML inside `<div id="root">` on index.html with key content (company overview, stats, brand list). AI crawlers see nothing currently.

4. **[HIGH] Create YouTube channel** — YouTube mentions have the strongest AI citation correlation (0.737). Even 10–20 videos about part identification/maintenance would build AI visibility.

5. **[MEDIUM] Add citability blocks to blog** — Each blog post should have a "quick answer" paragraph of 134–167 words near the top that AI can extract and cite independently.

---

## Schema Recommendations for AI Discoverability

- Add `speakable` schema to homepage (currently only on WebPage schema — needs updating to point to actual content)
- Add `FAQPage` schema to category pages (non-commercial use case)
- Blog author `Vinesh Shah` should have a Wikipedia/LinkedIn URL in `sameAs`
