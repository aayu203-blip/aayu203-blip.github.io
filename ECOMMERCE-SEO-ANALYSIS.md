# E-commerce SEO Analysis — partstrading.com
*Generated: 2026-05-13*

## Overall Score: 62/100

| Category | Score | Weight | Notes |
|----------|-------|--------|-------|
| Schema completeness | 72/100 | 25% | Product schema present; price "1 INR" issue |
| Title & meta | 55/100 | 15% | Titles good; 42% meta descriptions truncated |
| Image optimization | 40/100 | 20% | Generic category images; no part-specific photos |
| Content quality | 60/100 | 20% | SSR fallback is adequate; full content JS-rendered |
| Internal linking | 75/100 | 10% | Breadcrumbs ✅; related parts ✅; sidebar nav ✅ |
| Technical | 70/100 | 10% | Canonical ✅; hreflang ✅; React scripts unused |

---

## Product Page SEO Audit

### Title Tags ✅ GOOD
Format: `{partNo} — {Brand} {partName} | In Stock | PTC`
- Contains part number (primary search keyword) ✅
- Brand name present ✅
- Under 70 chars for most ✅
- "In Stock" trust signal ✅

### Meta Descriptions ⚠️ PARTIALLY BROKEN
- **42% of product pages have descriptions over 155 chars** (from 50-page sample)
- Some truncated mid-word: `"...Same-day dispatch Mumbai. WhatsApp +91-982"` (cut off)
- Format: `Buy {Brand} {partNo} — {name} for {model}. OEM-spec aftermarket. Same-day dispatch Mumbai. WhatsApp +91-98210-37990.`
- When part name + model is long, the phone number gets cut off
- **Fix**: Cap at 152 chars, omit phone from description (it's in the page content)

### Heading Structure ✅ GOOD (SSR fallback)
- H1: `{partNo} — {partName}` ✅
- H2: "Compatible Models", "Part Specifications" ✅
- Structure is clean in both SSR and JS-rendered versions

### Product Images ⚠️ WEAK
- Currently uses generic category images (`/assets/images/categories/engine-parts.jpg`)
- No part-specific photos for 62k products (understandable at scale)
- Alt text: `"Starter Motor – Part No {partNo} – Komatsu Spare Part"` ✅
- Image dimensions: 500×210px in SSR — adequate but not 800px minimum for Shopping eligibility
- Many product images are available in `assets/images/products/` — these should be wired up

### Internal Linking ✅ STRONG
- Breadcrumb: Home → Brand → Category → Part ✅
- Related parts section in JS version ✅
- Sidebar TOC with all page sections ✅
- Brand and category nav accessible from all product pages ✅

---

## Product Schema Analysis

### Schema Present: ✅ YES — JSON-LD in `<head>` (static HTML)

```json
{
  "@type": "Product",
  "name": "00863-4410-02400-03060 — Komatsu Starter Motor",
  "mpn": "00863-4410-02400-03060",
  "sku": "00863-4410-02400-03060",
  "image": "https://partstrading.com/assets/images/categories/engine-parts.jpg",
  "brand": {"@type": "Brand", "name": "Komatsu"},
  "itemCondition": "https://schema.org/NewCondition",
  "offers": {
    "availability": "https://schema.org/InStock",
    "priceCurrency": "INR",
    "price": "1"  ← ISSUE
  },
  "aggregateRating": {"ratingValue": "4.8", "reviewCount": "135"}  ← VERIFY
}
```

### Schema Issues

| Field | Status | Action |
|-------|--------|--------|
| `price: "1"` | ⚠️ Risk | Price 1 INR is technically valid but misleading. Google may flag as inaccurate. Consider using `priceSpecification` only (remove `price`) |
| `aggregateRating` | ⚠️ Verify | Varying review counts (66–237) all at 4.8★. If auto-generated/placeholder → Google structured data policy violation → manual penalty risk |
| `image` | ⚠️ Generic | Uses category image, not part-specific. For Shopping eligibility, needs 800px+ product image |
| `shippingDetails` | ✅ Excellent | 70+ countries listed |
| `hasMerchantReturnPolicy` | ✅ Present | 7-day return |
| `mpn` + `sku` | ✅ Present | Good |
| `gtin` | ❌ Missing | Not applicable for aftermarket industrial parts — acceptable |
| `description` | ✅ Present | Short but valid |

### Schema Scoring: 75/100
- All required fields: 50 ✅
- `aggregateRating`: +15 ✅ (if real)
- `sku/mpn`: +10 ✅
- `shippingDetails`: +10 ✅ 
- `merchantReturnPolicy`: +5 ✅
- **Deduction: `-15` for `price: "1"` (misleading price)**

---

## Category Page Issues

**69 category pages have wrong brand in schema:**
- CAT: 20 pages | Komatsu: 19 pages | Hitachi: 17 pages | Scania: 13 pages
- Schema contains `"Volvo Spare Parts"` and `partstrading.com/volvo/` URLs
- Confuses Google about brand/category associations
- Affects BreadcrumbList and ItemList schema

---

## Google Shopping Eligibility Assessment

| Requirement | Status | Notes |
|-------------|--------|-------|
| Product schema | ✅ Present | In static HTML |
| Price in INR | ⚠️ Price = 1 | Not eligible for Shopping (price must be real) |
| Product images 800px+ | ❌ No | Category images used |
| Brand declared | ✅ Komatsu/Volvo/etc. | Good |
| GTIN | N/A | Industrial parts — acceptable |
| Merchant feed | Unknown | Would need Google Merchant Center account |

**Google Shopping is not viable until real prices are included.** If PTC is quote-based (no listed prices), Shopping ads can't run. Consider a separate Google Merchant feed with starting prices or "Call for price" listings.

---

## Top Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| **Critical** | Verify aggregateRating is real data (not placeholder) | Policy violation risk |
| **Critical** | Fix 69 category pages with wrong Volvo schema | Brand confusion for Google |
| **High** | Fix meta descriptions over 155 chars (42% of products) | Improves CTR |
| **High** | Wire up part-specific images from `assets/images/products/` | Image quality for Shopping |
| **High** | Resolve `price: "1"` in Product schema | Shopping eligibility |
| **Medium** | Add `review` array (1–3 real reviews) to top product pages | Rich results eligibility |
| **Medium** | Increase product image to 800px minimum | Shopping feed requirement |
| **Low** | Add `color`, `material`, `size` to applicable products | Enhanced variant filtering |
