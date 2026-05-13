# PTC Website — Full Audit Checklist
> Run after compacting. Fire Round 1 all at once (parallel). Wait for results before Round 2.

---

## ROUND 1 — Parallel (fire all at once)
- [ ] `/seo-audit https://partstrading.com` — master audit, 15 specialists, 500-page crawl
- [ ] `/seo-geo https://partstrading.com` — AI search visibility (ChatGPT, Perplexity, Bing Copilot)
- [ ] `/seo-local https://partstrading.com` — GBP, NAP consistency, Mumbai local signals
- [ ] `/seo-ecommerce https://partstrading.com` — product schema, Google Shopping
- [ ] `/seo-dataforseo https://partstrading.com` — live SERP data, keyword metrics

---

## ROUND 2 — Deep per-page (4 page types)
- [ ] `/seo-page https://partstrading.com` — homepage
- [ ] `/seo-page https://partstrading.com/komatsu/engine-parts/` — category page
- [ ] `/seo-page https://partstrading.com/komatsu/engine-parts/6754818110` — product page
- [ ] `/seo-page https://partstrading.com/blog/` — blog index

---

## ROUND 3 — UI/UX (3 page types)
- [ ] `/claude-design-auditor https://partstrading.com` — homepage (18-rule audit)
- [ ] `/claude-design-auditor https://partstrading.com/komatsu/engine-parts/6754818110` — product page
- [ ] `/claude-design-auditor https://partstrading.com/komatsu/engine-parts/` — category page
- [ ] `/oiloil-ui-ux-guide review https://partstrading.com` — UX/hierarchy review

---

## ROUND 4 — Specialist checks (nothing broken)
- [ ] `/seo-technical https://partstrading.com` — 404s, broken links, redirect chains, JS failures
- [ ] `/seo-sitemap https://partstrading.com` — are all 62k pages indexed correctly?
- [ ] `/seo-schema https://partstrading.com` — validate all JSON-LD structured data
- [ ] `/seo-backlinks https://partstrading.com` — link profile health
- [ ] `/seo-cluster https://partstrading.com` — keyword architecture gaps

---

## ROUND 5 — After all results are in
- [ ] Fix all issues flagged by `/seo-technical` (broken links, 404s, redirects)
- [ ] Fix all schema errors flagged by `/seo-schema`
- [ ] Fix all UI/UX issues flagged by `/claude-design-auditor`
- [ ] Fix sitemap gaps flagged by `/seo-sitemap`
- [ ] Implement top SEO recommendations from `/seo-audit`
- [ ] Implement UI fixes from `/oiloil-ui-ux-guide`
- [ ] Commit and push all fixes

---

## Context (read before starting)
- Site: https://partstrading.com (GitHub Pages, aayu203-blip.github.io)
- ~62,646 product pages across volvo/ komatsu/ cat/ scania/ hitachi/ kobelco/ john-deere/
- product-page.js = vanilla JS renderer (no React) — reads `const P` from each HTML page
- app.js = homepage React app (search, nav, etc.)
- search-db.js = 7.6MB search index (defer loaded)
- All product pages verified: have product-page.js + const P + id="root" ✓
- Recent fixes deployed: paren syntax fix, vanilla JS rewrite, image layout, 7236 redirects
