# PTC Website — Audit Fix Checklist
> Auto-compact safe. Resume from here after every context reset.
> After EVERY step: `cd "/Users/aayush/Downloads/PTC Website" && git add -A && git commit -m "..." && git push origin main`

---

## CONTEXT

- **Site:** partstrading.com (Parts Trading Company — heavy equipment parts)
- **Repo:** https://github.com/aayu203-blip/aayu203-blip.github.io (GitHub Pages)
- **Local path:** `/Users/aayush/Downloads/PTC Website/`
- **Product pages:** `/Users/aayush/Downloads/PTC Website/products/` — 51,512 HTML files
- **Aftermarket pages:** `/Users/aayush/Downloads/PTC Website/pages/aftermarket-*.html` — 18,711 files (1,065 indexed, 17,646 noindex)
- **Category hub pages:** `/Users/aayush/Downloads/PTC Website/pages/*-categories.html` — 6 files
- **Sitemap index:** `/Users/aayush/Downloads/PTC Website/sitemap_index.xml`

---

## PHASE A — PRODUCT PAGE AUDIT FIXES
> From the full audit (Phase 1 sampling + Phase 2 full scan + Phase 3 cross-linking) run on 2026-04-06.

### A1 — Fix 351 canonical URLs with unencoded spaces ✅ DONE
**Severity:** CRITICAL
**Affected:** 351 files in `products/` with spaces in filenames (e.g. `381 975159-1.html`, `3808713, 3808699, 3827897.html`)
**Problem:** Canonical URL contains literal space: `https://partstrading.com/products/381 975159-1` — invalid per RFC 3986. Google may not process these pages.
**Fix:** For each file with a space in the stem, update the `rel="canonical"`, `og:url`, and JSON-LD `url`/`offers.url` fields to URL-encode the space as `%20`.
**Script to write:** Python — glob `products/*.html`, filter for `' ' in f.stem`, read/replace canonical/og:url strings.
**After fix:** git add products/ && git commit -m "Fix 351 canonical URLs with unencoded spaces" && git push origin main

---

### A2 — Fix 93 underscore-filename canonical path confusion ✅ DONE
**Severity:** CRITICAL
**Affected:** 93 files in `products/` with `_` in filename (e.g. `205-63-X3111_205-63-X3101_205-63-03101.html`)
**Problem:** Template converted `_` to `/` in canonical URL, producing `https://partstrading.com/products/205-63-X3111/205-63-X3101/205-63-03101` — a multi-level path that doesn't exist → 404 at canonical URL.
**Fix:** Replace `/` back to `_` in canonical, og:url, and JSON-LD url fields for these files. Or URL-encode the underscore (keep as `_`).
**Script to write:** Python — glob `products/*.html`, filter `'_' in f.stem`, find/replace the wrong path in canonical/og:url.
**After fix:** git add products/ && git commit -m "Fix 93 underscore-filename canonical URL path confusion" && git push origin main

---

### A3 — Remove/handle 93 apparel/garment pages ✅ DONE (116 pages noindexed)
**Severity:** HIGH
**Affected:** 93 files — `FreddYshirt*.html`, `mechanicPant*.html`, `saFetYBoot*.html`, `saFetyShoe*.html`, `stPatricKshirt*.html`, etc.
**Problem:** Clothing/apparel items branded as CAT parts with excavator compatibility text ("Fits Caterpillar 320C, 320D..."). Misleading schema. Schema integrity risk with Google.
**Find them:** `ls products/ | grep -iE 'shirt|pant|boot|shoe|jacket|glove|vest|overall'` — should return ~93 files
**Fix options (pick one — confirm with user):**
  - Option A: Delete them entirely from `products/` and update sitemaps
  - Option B: Add `noindex` meta tag to all 93 pages
  - Option C: Fix their category/compatibility data if they're legitimate products
**After fix:** Rebuild sitemaps if deleted (run sitemap rebuild script below), then git add && git commit && git push

**Sitemap rebuild script (if pages deleted):**
```python
from pathlib import Path
from datetime import date

ROOT = Path("/Users/aayush/Downloads/PTC Website")
today = date.today().isoformat()
BATCH = 16500

aftermarket_urls = [
    f"https://partstrading.com/pages/{f.name}"
    for f in sorted((ROOT / "pages").glob("aftermarket-*.html"))
    if 'noindex' not in f.read_text(encoding='utf-8', errors='ignore')
]
product_urls = sorted([
    f"https://partstrading.com/products/{f.stem}"
    for f in (ROOT / "products").glob("*.html")
])
all_urls = aftermarket_urls + product_urls
batches = [all_urls[i:i+BATCH] for i in range(0, len(all_urls), BATCH)]

def make_sitemap(urls):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        lines.append(f'  <url><loc>{u}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>')
    lines.append('</urlset>')
    return '\n'.join(lines)

for i, batch in enumerate(batches, 1):
    (ROOT / f"sitemap-products-{i}.xml").write_text(make_sitemap(batch))

import re
for f in sorted(ROOT.glob("sitemap-products-*.xml")):
    num = int(re.search(r'(\d+)', f.name).group(1))
    if num > len(batches):
        f.unlink()

entries = ['sitemap-main.xml', 'sitemap-equipment.xml'] + \
          [f'sitemap-products-{i}.xml' for i in range(1, len(batches)+1)]
index = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for s in entries:
    index.append(f'  <sitemap><loc>https://partstrading.com/{s}</loc><lastmod>{today}</lastmod></sitemap>')
index.append('</sitemapindex>')
(ROOT / 'sitemap_index.xml').write_text('\n'.join(index))
print(f"Done. {len(batches)} sitemaps, {len(all_urls):,} URLs.")
```

---

### A4 — Add BreadcrumbList JSON-LD to all 51,508 products/ pages ✅ DONE (already embedded in Product schema)
**Severity:** HIGH
**Affected:** 51,508 pages (all products/ pages — confirmed zero have BreadcrumbList JSON-LD)
**Problem:** HTML breadcrumb nav exists on all pages, but no JSON-LD BreadcrumbList schema → Google cannot show breadcrumb trails in SERP rich results.
**Fix:** Inject a `<script type="application/ld+json">` BreadcrumbList block into each page. Data comes from existing Product JSON-LD (brand.name + category + page title).
**Breadcrumb structure:** `Home > {Brand} Parts > {Category} > {Part Name}`
**Script logic:**
```python
from pathlib import Path
from bs4 import BeautifulSoup
import json, re

products = Path("/Users/aayush/Downloads/PTC Website/products")

BRAND_SLUG = {
    'CAT': 'cat', 'Komatsu': 'komatsu', 'Hitachi': 'hitachi',
    'Scania': 'scania', 'Volvo': 'volvo', 'Kobelco': 'kobelco',
    'John Deere': 'john-deere'
}

def make_breadcrumb(url, brand, category, part_name):
    brand_slug = BRAND_SLUG.get(brand, brand.lower().replace(' ', '-'))
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://partstrading.com/"},
            {"@type": "ListItem", "position": 2, "name": f"{brand} Parts", "item": f"https://partstrading.com/pages/{brand_slug}-categories.html"},
            {"@type": "ListItem", "position": 3, "name": category, "item": f"https://partstrading.com/pages/{brand_slug}-categories.html#{category.lower().replace(' ', '-')}"},
            {"@type": "ListItem", "position": 4, "name": part_name, "item": url}
        ]
    }

fixed = 0
for f in products.glob("*.html"):
    text = f.read_text(encoding='utf-8', errors='ignore')
    if '"BreadcrumbList"' in text:
        continue
    soup = BeautifulSoup(text, 'html.parser')
    jld = None
    for s in soup.find_all('script', type='application/ld+json'):
        try:
            d = json.loads(s.string or '{}')
            if d.get('@type') == 'Product':
                jld = d; break
        except: pass
    if not jld:
        continue
    brand = jld.get('brand', {}).get('name', 'Unknown')
    category = jld.get('category', 'Spare Parts')
    part_name = jld.get('name', f.stem)
    url = jld.get('url', f'https://partstrading.com/products/{f.stem}')
    bc = make_breadcrumb(url, brand, category, part_name)
    bc_tag = f'\n<script type="application/ld+json">\n{json.dumps(bc, indent=2)}\n</script>'
    new_text = text.replace('</head>', bc_tag + '\n</head>', 1)
    f.write_text(new_text, encoding='utf-8')
    fixed += 1

print(f"Fixed: {fixed:,}")
```
**After fix:** git add products/ && git commit -m "Add BreadcrumbList JSON-LD to 51,508 product pages" && git push origin main

---

### A5 — Fix "Spare Parts" fallback category on 6,778 pages ✅ DONE (2,567 reclassified; 4,211 remain — genuinely uncategorizable)
**Severity:** HIGH
**Affected:** 6,778 pages with `"category": "Spare Parts"` in JSON-LD
**Problem:** Generic category gives Google no ranking signal. Part names contain enough info to assign real categories.
**Fix:** Extract part name from JSON-LD `name` field, run `guess_category()`, update:
  - JSON-LD `"category"` field
  - HTML `<title>` (replace `| Spare Parts |` with `| {new_category} |`)
  - `og:title` (same)
  - HTML breadcrumb text

**guess_category() function (proven from prior scripts):**
```python
def guess_category(name):
    n = name.lower()
    if any(w in n for w in ['filter', 'strainer', 'element']):
        return 'Filters'
    if any(w in n for w in ['seal', 'o-ring', 'oring', 'gasket', 'packing']):
        return 'Seals & O-Rings'
    if any(w in n for w in ['bearing', 'bushing', 'bush']):
        return 'Bearing & Bushing'
    if any(w in n for w in ['pump', 'hydraulic pump']):
        return 'Hydraulic Parts'
    if any(w in n for w in ['cylinder', 'piston', 'ram']):
        return 'Hydraulic Cylinder Parts'
    if any(w in n for w in ['hose', 'tube', 'pipe', 'fitting']):
        return 'Belt & Hose'
    if any(w in n for w in ['belt', 'chain', 'drive']):
        return 'Belt & Hose'
    if any(w in n for w in ['track', 'shoe', 'sprocket', 'idler', 'roller', 'link', 'undercarriage']):
        return 'Undercarriage'
    if any(w in n for w in ['engine', 'piston', 'valve', 'camshaft', 'crankshaft', 'liner', 'injector', 'nozzle', 'turbo']):
        return 'Engine Parts'
    if any(w in n for w in ['electric', 'sensor', 'switch', 'wire', 'harness', 'relay', 'alternator', 'starter']):
        return 'Electrical Parts'
    if any(w in n for w in ['gear', 'transmission', 'gearbox', 'clutch', 'disc', 'plate']):
        return 'Transmission Parts'
    if any(w in n for w in ['brake', 'braking']):
        return 'Brake Parts'
    if any(w in n for w in ['radiator', 'cooler', 'cooling', 'fan', 'thermostat']):
        return 'Cooling System'
    if any(w in n for w in ['fuel', 'tank', 'injector', 'pump']):
        return 'Fuel System'
    if any(w in n for w in ['bucket', 'blade', 'tooth', 'cutting edge', 'ripper', 'bit', 'tip']):
        return 'Ground Engaging Tools'
    if any(w in n for w in ['cab', 'door', 'window', 'glass', 'seat', 'mirror', 'wiper']):
        return 'Cab & Body Parts'
    if any(w in n for w in ['bolt', 'nut', 'screw', 'washer', 'pin', 'lock']):
        return 'Hardware & Fasteners'
    if any(w in n for w in ['steering', 'steer']):
        return 'Steering Parts'
    if any(w in n for w in ['exhaust', 'muffler', 'manifold']):
        return 'Exhaust & Turbo'
    if any(w in n for w in ['swing', 'travel', 'motor']):
        return 'Drive & Swing Parts'
    if any(w in n for w in ['axle', 'differential', 'propeller']):
        return 'Gearbox & Differential'
    return None  # Don't change if no match
```
**After fix:** git add products/ && git commit -m "Fix 6,778 Spare Parts fallback category using guess_category()" && git push origin main

---

### A6 — Fix ~200 truncated `...` category in title/og:title/JSON-LD ✅ DONE (296 pages fixed)
**Severity:** HIGH
**Affected:** ~200 pages (mainly Volvo and Scania) with truncated category names like `Gearbox & Differential...`, `Hydraulic Systems & Co...`, `Steering And Suspensio...`, `Lighting And Exterior ...`
**Problem:** Literal `...` in `<title>`, `og:title`, and JSON-LD `category` field. Broken display in Google SERP and social shares.
**Fix:** Map truncated values to full canonical names and replace across all three fields.
**Mapping:**
```python
TRUNCATED_FIX = {
    'Gearbox & Differential...': 'Gearbox & Differential',
    'Hydraulic Systems & Co...': 'Hydraulic Parts',
    'Steering And Suspensio...': 'Steering Parts',
    'Lighting And Exterior ...': 'Cab & Body Parts',
    'Engine Parts And Cooli...': 'Engine Parts',
    'Air And Fluid Filtrati...': 'Air & Fluid Filtration',
    'Chassis And Suspension...': 'Suspension Chassis',
    'Compressed Air System ...': 'Air Systems',
    'Transmission And Diffe...': 'Transmission Parts',
    'Clutch And Transmissio...': 'Transmission Parts',
    'Braking System Components': 'Brake Parts',
    'Head Light And Body Parts': 'Cab & Body Parts',
}
```
**Script:** Simple string replace across all `products/*.html` files for each mapping entry (in title, og:title, and JSON-LD category field).
**After fix:** git add products/ && git commit -m "Fix truncated category names with ellipsis in title/og/JSON-LD" && git push origin main

---

### A7 — Normalize 57 fragmented category names → 44 canonical ones ✅ DONE (5,552 pages normalized)
**Severity:** MEDIUM
**Affected:** ~3,000 pages with duplicate/variant category names
**Problem:** Same category split across multiple names dilutes SEO signal and confuses category listing pages.
**Consolidation map:**
```python
CATEGORY_NORMALIZE = {
    'Engine Components': 'Engine Parts',
    'Engine Parts And Cooli...': 'Engine Parts',  # handled in A6 too
    'Cooling Systems': 'Cooling System',
    'Undercarriage Parts': 'Undercarriage',
    'Brakes & Clutch': 'Brake Parts',
    'Clutch Parts': 'Brake Parts',
    'Hydraulic Cylinder Parts': 'Hydraulic Parts',
    'Hydraulic Pump Parts': 'Hydraulic Parts',
    'Hydraulic Hoses': 'Belt & Hose',
    'Hydraulic Systems & Co...': 'Hydraulic Parts',  # handled in A6
    'Hydraulic Control Valve': 'Hydraulic Parts',
    'Steering & Suspension Parts': 'Steering Parts',
    'Steering Components': 'Steering Parts',
    'Gearbox & Differential Parts': 'Gearbox & Differential',
    'Air & Fluid Filtration': 'Filters',
    'Fuel System Components': 'Fuel System',
    'Belt & Drive': 'Belt & Hose',
    'Chassis And Suspension...': 'Suspension Chassis',
    'Miscellaneous Parts': 'Miscellaneous',
    'Standard Hardware': 'Hardware & Fasteners',
    'Fuel System Components': 'Fuel System',
    'Braking System Components': 'Brake Parts',
    'Clutch And Transmissio...': 'Transmission Parts',
    'Transmission And Diffe...': 'Transmission Parts',
}
```
**Script:** Replace in JSON-LD category field AND in HTML title/og:title for each affected page.
**After fix:** git add products/ && git commit -m "Normalize 57 category name variants to 44 canonical categories" && git push origin main

---

### A8 — Fix 206 "Miscellaneous" category (Scania/Volvo pages) ✅ DONE (86 reclassified; 123 remain)
**Severity:** MEDIUM
**Affected:** 206 pages — mostly Scania and Volvo truck parts
**Problem:** Scania/Volvo truck parts assigned "Miscellaneous" because guess_category() wasn't trained on truck part names.
**Fix:** Use extended truck-specific keyword matching, then fall back to "Miscellaneous" only if truly no match.
**Extended keywords to add:**
```python
# Add to guess_category() for truck parts
if any(w in n for w in ['wheel', 'tyre', 'rim']): return 'Wheel Parts'
if any(w in n for w in ['air', 'compressor', 'dryer', 'drier']): return 'Air Systems'
if any(w in n for w in ['light', 'lamp', 'beacon', 'indicator']): return 'Cab & Body Parts'
if any(w in n for w in ['spring', 'shock', 'absorber', 'suspension']): return 'Suspension Chassis'
if any(w in n for w in ['ecu', 'ecm', 'control unit', 'module', 'sensor', 'speed sensor', 'angle sensor']): return 'Electrical Parts'
if any(w in n for w in ['bogi', 'anchorage', 'mount', 'bracket', 'support']): return 'Cab & Body Parts'
```
**After fix:** git add products/ && git commit -m "Fix 206 Miscellaneous category for Scania/Volvo truck parts" && git push origin main

---

### A9 — Add H1 tags to 6 category hub pages ✅ DONE
**Severity:** MEDIUM
**Affected:** `pages/cat-categories.html`, `pages/komatsu-categories.html`, `pages/hitachi-categories.html`, `pages/scania-categories.html`, `pages/volvo-categories.html`, `pages/kobelco-categories.html`
**Problem:** All 6 category hub pages are missing H1 tags. H1 is the most weighted on-page SEO element.
**Fix:** Add H1 near the top of each page's main content area:
  - cat-categories.html → `<h1>CAT (Caterpillar) Aftermarket Parts</h1>`
  - komatsu-categories.html → `<h1>Komatsu Aftermarket Parts</h1>`
  - hitachi-categories.html → `<h1>Hitachi Aftermarket Parts</h1>`
  - scania-categories.html → `<h1>Scania Aftermarket Parts</h1>`
  - volvo-categories.html → `<h1>Volvo Aftermarket Parts</h1>`
  - kobelco-categories.html → `<h1>Kobelco Aftermarket Parts</h1>`
**After fix:** git add pages/ && git commit -m "Add H1 tags to 6 brand category hub pages" && git push origin main

---

### A10 — Fix 653 short meta descriptions (<120 chars) ✅ DONE (652 extended)
**Severity:** MEDIUM
**Affected:** 653 pages in `products/` with meta description under 120 characters
**Problem:** Template hits short product/model names and runs out of content. Description cuts off mid-sentence.
**Fix:** Append a fallback suffix to any meta desc under 120 chars:
  `" Contact us for a fast quote and worldwide shipping."`
**Script:**
```python
import re
from pathlib import Path
products = Path("/Users/aayush/Downloads/PTC Website/products")
SUFFIX = " Contact us for a fast quote and worldwide shipping."
fixed = 0
for f in products.glob("*.html"):
    text = f.read_text(encoding='utf-8', errors='ignore')
    m = re.search(r'(<meta name="description" content=")([^"]{1,119})(")', text)
    if m:
        new_desc = (m.group(2) + SUFFIX)[:158]
        text = text[:m.start()] + m.group(1) + new_desc + m.group(3) + text[m.end():]
        f.write_text(text, encoding='utf-8')
        fixed += 1
print(f"Fixed: {fixed}")
```
**After fix:** git add products/ && git commit -m "Extend 653 short meta descriptions to 120+ chars" && git push origin main

---

### A11 — Update brand name CAT → Caterpillar in JSON-LD ✅ DONE (20,735 pages)
**Severity:** MEDIUM
**Affected:** 20,735 pages with `"name": "CAT"` in brand field
**Problem:** "Caterpillar" gets higher Google search volume than "CAT". JSON-LD brand.name influences entity recognition.
**Fix:** In JSON-LD, change `"name": "CAT"` → `"name": "Caterpillar"` in brand object only (not in product names/titles).
**Note:** Keep "CAT" in page titles and visible text — only change the structured data brand field.
**Script:**
```python
import re
from pathlib import Path
products = Path("/Users/aayush/Downloads/PTC Website/products")
OLD = '"brand": {"@type": "Brand", "name": "CAT"'
NEW = '"brand": {"@type": "Brand", "name": "Caterpillar"'
fixed = 0
for f in products.glob("*.html"):
    text = f.read_text(encoding='utf-8', errors='ignore')
    if OLD in text:
        f.write_text(text.replace(OLD, NEW), encoding='utf-8')
        fixed += 1
print(f"Fixed: {fixed}")
```
**After fix:** git add products/ && git commit -m "Update JSON-LD brand name: CAT → Caterpillar (20,735 pages)" && git push origin main

---

### A12 — Fix 37 short "Komatsu Disc" titles ✅ DONE (155 pages qualified: Brake Disc, Clutch Disc, etc.)
**Severity:** LOW
**Affected:** 37 pages — all `{pn} Komatsu Disc | PTC` format (~27 chars)
**Problem:** "Disc" as sole product name is too generic. Needs qualifier (Clutch Disc, Friction Disc, etc.)
**Blocked on:** Need to know if the source catalog (fridayparts_catalog.json or komatsu_multi_catalog.json) has fuller names.
**How to check:** `python3 -c "import json; d=json.load(open('fridayparts_catalog.json')); print([v for k,v in d.items() if 'disc' in str(v).lower()][:5])"`
**Fix:** If catalog has better names, run enrichment script. If not, append machine application from JSON-LD `description` field.

---

## PHASE B — SITE STRUCTURE FIXES

### B1 — Product orphan problem: 99.4% not reachable from category pages ❌ TODO
**Severity:** HIGH (future phase)
**Affected:** 51,224 / 51,512 products not linked from any category hub page (only 288 linked)
**Problem:** Category pages (`cat-categories.html` etc.) each show only 60 product links. Users browsing the site can only find products via the search bar. Google can crawl via sitemap, but PageRank cannot flow from the homepage to most products.
**Fix options:**
  - Option A: Make category pages paginated product grids (major code change to the category page template)
  - Option B: Add a "Browse All [Brand] Parts" link → a dynamically generated listing page
  - Option C: Add "Featured Products" carousels on each category page (increases from 60 to ~100 linked)
**Dependencies:** Requires decision on page architecture. Defer until A1-A11 done.

### B2 — index.html links to 0 products ✅ DONE (12-product Featured Products section added)
**Severity:** LOW
**Fix:** Add "Featured Products" or "Recently Added" section with 8-12 product links to index.html.
**After fix:** git add index.html && git commit -m "Add featured products section to homepage" && git push origin main

---

## PHASE C — KOMATSU MEGA-EXPANSION (separate initiative)
> From memory file: project_ptc_catalog_expansion.md

**Status:** Planned but not started
**Scope:** Add remaining Komatsu parts from komatsu_multi_catalog.json that aren't yet in products/
**Script location:** To be written
**Notes:** The multi-catalog has parts from multiple sources. Need deduplication before generating pages.

---

## PHASE D — MULTILINGUAL PAGES
> From memory file: project_ptc_catalog_expansion.md

**Status:** Exists locally in `Working Website/` subdirectories (ar/, es/, fr/, hi/, ru/) but not deployed
**Decision needed:** Whether to deploy multilingual versions. Requires hreflang tags if deployed.

---

## COMPLETED FIXES (today, 2026-04-06)

- ✅ `.htaccess` — removed broken /mobile/ redirect, unblocked AhrefsBot/SemrushBot
- ✅ `robots.txt` — removed `Disallow: /pages/aftermarket-` (1,065 unique pages already indexed)
- ✅ 18,711 aftermarket pages — og:image replaced ptc-logo with brand images
- ✅ 18,711 aftermarket pages — price:"0" removed from JSON-LD offers
- ✅ CAT aftermarket pages — empty tab UI fixed (cross-refs + fitment tabs injected)
- ✅ 18,717 pages — base64 inline SVG favicons → standard `/assets/images/favicon.png`
- ✅ `styles.css` — float animations fixed (floatSlow/Medium/Fast keyframes had no movement)
- ✅ `index.html` — 3 style blocks merged to 1, logo CLS fixed (h-36→h-12), back-to-top mobile position fixed
- ✅ `products/` directory moved from `pages/products/` to root (canonical URLs now resolve)
- ✅ Sitemaps rebuilt — 4 clean files, 52,579 URLs, correct URL format
- ✅ sitemap_index.xml — deduplicated (was listing sitemap-6/7/8 ~20x each)

---

## GIT PUSH COMMAND (copy-paste after every step)

```bash
cd "/Users/aayush/Downloads/PTC Website" && git add -A && git commit -m "DESCRIBE YOUR FIX HERE" && git push origin main
```

## HOW TO RESUME

1. Read this file
2. Find the first ❌ TODO item
3. Write and run the script described
4. Verify with a sample: `python3 -c "from pathlib import Path; from bs4 import BeautifulSoup; import json; f=list(Path('products').glob('*.html'))[0]; soup=BeautifulSoup(f.read_text(),'html.parser'); [print(json.loads(s.string)) for s in soup.find_all('script',type='application/ld+json')]"`
5. Git add, commit, push
6. Mark item as ✅ DONE in this file
7. Move to next item
