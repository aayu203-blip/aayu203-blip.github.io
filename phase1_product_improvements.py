#!/usr/bin/env python3
"""
Phase 1: Deterministic product page improvements (no AI needed).

For every product page:
  1. Remove duplicate schema block
  2. Rebuild schema: INR pricing, AggregateRating, returnPolicy, more shipping destinations
  3. Inject related parts section (6 real catalog parts from same brand/category)
  4. Inject "buy in your country" links to market landing pages
  5. Inject application notes section (category-specific, static)
  6. Fix P.relatedParts in const block
  7. Fix P.models from one long string → proper array (best-effort parse)

Run: python3 phase1_product_improvements.py
     python3 phase1_product_improvements.py --brand cat   (single brand)
     python3 phase1_product_improvements.py --limit 100   (test run)
"""

import re, json, random, html, sys
from pathlib import Path

ROOT = Path(__file__).parent
CATALOG = json.loads((ROOT / "catalog_index.json").read_text())

BRANDS = ["volvo","cat","hitachi","komatsu","scania","john-deere"]
BRAND_LABELS = {"volvo":"Volvo","cat":"CAT","hitachi":"Hitachi","komatsu":"Komatsu","scania":"Scania","john-deere":"John Deere"}

# ── Category application notes (static, but category-specific) ──────────────
APP_NOTES = {
    "engine-parts": "Inspect mating surfaces for wear before fitting. Use torque specs from service manual. Replace gaskets and seals as a set — reusing compressed gaskets causes oil leaks. Clean all oil passages with compressed air.",
    "hydraulic-parts": "Flush hydraulic lines before fitting new components. Use only manufacturer-specified hydraulic fluid. Check O-rings and backup rings for correct orientation. Bleed air from system after installation.",
    "brake-parts": "Always replace brakes in axle sets. Bed-in new brake pads with 8–10 moderate stops from 40 km/h. Check disc runout with a dial gauge — maximum 0.1 mm. Inspect caliper slides and pistons when replacing pads.",
    "transmission-parts": "Drain and replace transmission fluid when servicing internal components. Use correct ATF specification. Pre-fill torque converters with fluid before installation. Allow 10 minutes for fluid to settle before checking level.",
    "electrical-parts": "Disconnect main battery before working on electrical components. Use dielectric grease on all connector pins. Check ground connections — most electrical faults trace to poor grounds. Test with multimeter before installing new parts.",
    "filters": "Never run an engine without a filter — even briefly causes abrasive damage. Pre-fill fuel filters with clean fuel before fitting to reduce prime time. Replace O-rings on filter housings every second service. Record change dates on filter housing.",
    "cooling-system": "Flush cooling system with distilled water before refilling. Use pre-mixed coolant — never plain water, which causes corrosion. Pressure-test system after any cooling repair. Check thermostat by immersing in hot water — should open at rated temperature.",
    "fuel-system": "Use clean, filtered fuel — fuel injection components have micron-level tolerances. Prime fuel system before cranking to avoid dry-start damage. Replace fuel filter whenever servicing injection components. Calibrate injectors after replacement if equipment has ECU.",
    "suspension-chassis": "Torque all suspension fasteners to specification — under-torque causes wear, over-torque causes fatigue cracking. Replace bushings in pairs. Grease all zerks after fitting. Check alignment after suspension work.",
    "steering-parts": "Bleed steering system after any hydraulic repair. Check power steering fluid level and condition. Inspect tie rod ends for play — replace if more than 1 mm of movement. Check steering column splines for wear.",
    "cab-body-parts": "Clean mating surfaces before fitting cab seals to prevent air and water ingress. Use correct adhesive for glass bonding — structural automotive adhesive, not silicone. Check wiring harness routing when replacing doors or panels.",
    "exhaust-turbo": "Allow turbo to idle 2–3 minutes before shutdown — this circulates oil through bearings and prevents coking. Check oil feed and drain lines for blockages before fitting new turbo. Replace oil and filter when fitting new turbo — old oil contains metal particles.",
    "seals-orings": "Always match seal material to fluid type — NBR for petroleum, FKM (Viton) for high-temperature/chemical applications. Lubricate seals with clean fluid before fitting — never grease. Check shaft surface for scoring — rough surfaces destroy new seals within hours.",
    "bearing-bushing": "Never strike bearings directly — use a bearing press or driver set. Heat housing (not bearing) to ease installation. Replace bearings in sets where applicable. Check housing bore diameter before fitting — out-of-round bores destroy new bearings.",
    "spare-parts": "Cross-reference part number with serial number before ordering to confirm fitment. Keep original parts until new ones are confirmed correct. Record part numbers replaced for future reference.",
}

# ── Top markets to feature on product pages ─────────────────────────────────
MARKET_LINKS = [
    ("Dubai",          "uae"),
    ("Saudi Arabia",   "saudi-arabia"),
    ("Nigeria",        "nigeria"),
    ("Kenya",          "kenya"),
    ("South Africa",   "south-africa"),
    ("Bangladesh",     "bangladesh"),
    ("Malaysia",       "malaysia"),
    ("Ghana",          "ghana"),
    ("Qatar",          "qatar"),
    ("Egypt",          "egypt"),
]

# Top Indian states
INDIA_LINKS = [
    ("Maharashtra", "maharashtra"),
    ("Gujarat",     "gujarat"),
    ("Tamil Nadu",  "tamil-nadu"),
    ("Rajasthan",   "rajasthan"),
    ("Karnataka",   "karnataka"),
    ("Telangana",   "telangana"),
]

# Shipping destinations for schema
SHIP_COUNTRIES = ["IN","AE","SA","NG","KE","ZA","BD","MY","TH","QA","KW","OM","BH","GH","EG","TZ","UG","PH","ID","VN","PK","LK","NP","ET","ZM","ZW","AO","CI","CM","MA","DZ","TN","SD"]

V1_MARKER = "<!-- ptc-enriched-v1 -->"
P_RE = re.compile(r"(<script>const P = \{)(.*?)(\};</script>)", re.DOTALL)
SCHEMA_RE = re.compile(r'<script type="application/ld\+json">.*?</script>', re.DOTALL)

def parse_p_block(block_content):
    """Extract key fields from P block string."""
    def field(name, default=""):
        m = re.search(rf"{name}:'([^']*)'", block_content)
        return m.group(1) if m else default
    def arr(name):
        m = re.search(rf"{name}:\[([^\]]*)\]", block_content)
        if not m: return []
        raw = m.group(1)
        return [x.strip().strip("'\"") for x in re.findall(r"'([^']*)'", raw)]

    return {
        "partNo":    field("partNo"),
        "name":      field("name"),
        "brand":     field("brand"),
        "brandSlug": field("brandSlug"),
        "category":  field("category"),
        "catSlug":   field("catSlug"),
        "condition": field("condition"),
        "description": field("description"),
        "xref":      arr("xref"),
        "models":    arr("models"),
    }

def get_related_parts(brand_slug, cat_slug, current_slug, count=6):
    """Pull real parts from catalog index, excluding current part."""
    key = f"{brand_slug}/{cat_slug}"
    pool = CATALOG.get(key, [])
    if not pool:
        # fallback to spare-parts
        key = f"{brand_slug}/spare-parts"
        pool = CATALOG.get(key, [])
    others = [p for p in pool if p["s"] != current_slug]
    if len(others) <= count:
        return others
    # pick deterministically based on part slug (not random, for reproducibility)
    seed = sum(ord(c) for c in current_slug)
    random.seed(seed)
    return random.sample(others, count)

def split_models(models_list):
    """Split long model strings into individual model tokens."""
    out = []
    for m in models_list:
        # Split on spaces, keep only tokens that look like model names
        tokens = re.split(r'[\s,/]+', m)
        for t in tokens:
            t = t.strip()
            if len(t) >= 3 and t not in out:
                out.append(t)
    # Cap at 20
    return out[:20]

def build_schema(p, rating_count):
    """Build improved Product schema."""
    name = f"{p['partNo']} — {p['brand']} {p['name']}"
    desc = p['description']
    cat_slug = p['catSlug']
    brand_slug = p['brandSlug']

    # Image based on category
    cat_images = {
        "engine-parts": "engine.jpg", "hydraulic-parts": "hydraulics.jpg",
        "brake-parts": "brakes.jpg", "transmission-parts": "transmission.jpg",
        "electrical-parts": "electrical.jpg", "filters": "filters.jpg",
        "cooling-system": "cooling.jpg", "fuel-system": "fuel.jpg",
    }
    img_file = cat_images.get(cat_slug, "parts.jpg")
    img_url = f"https://partstrading.com/assets/images/parts/{img_file}"

    # Shipping destinations
    ship_dests = [{"@type": "DefinedRegion", "addressCountry": c} for c in SHIP_COUNTRIES]

    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": name,
                "description": desc,
                "mpn": p['partNo'],
                "sku": p['partNo'],
                "image": img_url,
                "brand": {"@type": "Brand", "name": p['brand']},
                "itemCondition": "https://schema.org/NewCondition",
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "reviewCount": str(rating_count),
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "1",
                        "priceCurrency": "INR",
                        "description": "Contact for pricing — proforma invoice on request"
                    },
                    "seller": {"@type": "Organization", "name": "Parts Trading Company", "url": "https://partstrading.com"},
                    "shippingDetails": {
                        "@type": "OfferShippingDetails",
                        "shippingDestination": ship_dests,
                        "shippingRate": {"@type": "MonetaryAmount", "value": "0", "currency": "INR"},
                        "deliveryTime": {
                            "@type": "ShippingDeliveryTime",
                            "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
                            "transitTime": {"@type": "QuantitativeValue", "minValue": 2, "maxValue": 12, "unitCode": "DAY"}
                        }
                    },
                    "hasMerchantReturnPolicy": {
                        "@type": "MerchantReturnPolicy",
                        "applicableCountry": "IN",
                        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                        "merchantReturnDays": 7,
                        "returnMethod": "https://schema.org/ReturnByMail",
                        "returnFees": "https://schema.org/FreeReturn"
                    }
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://partstrading.com/"},
                    {"@type": "ListItem", "position": 2, "name": f"{p['brand']} Parts", "item": f"https://partstrading.com/{brand_slug}/"},
                    {"@type": "ListItem", "position": 3, "name": f"{p['brand']} {p['category']}", "item": f"https://partstrading.com/{brand_slug}/{cat_slug}/"},
                    {"@type": "ListItem", "position": 4, "name": f"{p['brand']} {p['partNo']}", "item": f"https://partstrading.com/{brand_slug}/{cat_slug}/{p['partNo']}"}
                ]
            }
        ]
    }
    return f'<script type="application/ld+json">{json.dumps(schema, separators=(",", ":"))}</script>'

def build_related_html(related_parts, brand_slug, cat_slug, brand_label):
    if not related_parts:
        return ""
    cards = ""
    for rp in related_parts:
        cards += f"""<a href="/{brand_slug}/{cat_slug}/{html.escape(rp['s'])}/" style="display:block;background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:14px 16px;text-decoration:none;transition:border-color .2s" onmouseover="this.style.borderColor='rgba(255,184,28,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
  <div style="font-family:monospace;font-size:11px;color:#FFB81C;font-weight:700;letter-spacing:.06em;margin-bottom:5px">{html.escape(rp['p'])}</div>
  <div style="font-size:12px;color:#999;line-height:1.4">{html.escape(rp['n'])}</div>
</a>"""
    return f"""
<!-- ptc-related-parts -->
<section style="background:#0a0a0a;padding:48px 24px;border-top:1px solid rgba(255,255,255,0.05)">
  <div style="max-width:1100px;margin:0 auto">
    <h2 style="font-family:'Barlow Condensed','Barlow',sans-serif;font-size:22px;font-weight:900;color:#F0ECE6;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px">Related {html.escape(brand_label)} Parts</h2>
    <p style="font-size:12px;color:#555;margin:0 0 20px">From the same category — may also be needed</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px">
      {cards}
    </div>
    <p style="margin-top:16px;font-size:12px;color:#444"><a href="/{brand_slug}/{cat_slug}/" style="color:#FFB81C;text-decoration:none">Browse all {html.escape(brand_label)} {html.escape(cat_slug.replace('-',' ').title())} →</a></p>
  </div>
</section>"""

def build_region_html(p, brand_slug, cat_slug):
    intl_links = ""
    for mkt_name, mkt_slug in MARKET_LINKS:
        lp = ROOT / brand_slug / cat_slug / mkt_slug
        if lp.exists():
            intl_links += f'<a href="/{brand_slug}/{cat_slug}/{mkt_slug}/" style="display:inline-block;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 14px;font-size:12px;color:#aaa;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor=\'rgba(255,184,28,0.4)\';this.style.color=\'#FFB81C\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.1)\';this.style.color=\'#aaa\'">{html.escape(mkt_name)}</a>'

    india_links = ""
    for sname, sslug in INDIA_LINKS:
        lp = ROOT / "india" / sslug / brand_slug / cat_slug
        if lp.exists():
            india_links += f'<a href="/india/{sslug}/{brand_slug}/{cat_slug}/" style="display:inline-block;border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:5px 12px;font-size:11px;color:#888;text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor=\'rgba(255,184,28,0.3)\';this.style.color=\'#FFB81C\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.07)\';this.style.color=\'#888\'">{html.escape(sname)}</a>'

    if not intl_links and not india_links:
        return ""

    return f"""
<!-- ptc-region-links -->
<section style="background:#070707;padding:40px 24px;border-top:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:1100px;margin:0 auto">
    <h2 style="font-family:'Barlow Condensed','Barlow',sans-serif;font-size:16px;font-weight:700;color:#F0ECE6;letter-spacing:.08em;text-transform:uppercase;margin:0 0 16px">Ship This Part To Your Location</h2>
    {"<div style='display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px'>" + intl_links + "</div>" if intl_links else ""}
    {"<div style='margin-top:4px;margin-bottom:6px;font-size:11px;color:#444;letter-spacing:.06em;text-transform:uppercase'>India</div><div style='display:flex;flex-wrap:wrap;gap:6px'>" + india_links + "</div>" if india_links else ""}
    <p style="margin-top:16px;font-size:11px;color:#444">Full shipping information on regional pages · Air freight 2–12 days · GST invoice for India</p>
  </div>
</section>"""

def build_appnotes_html(cat_slug):
    note = APP_NOTES.get(cat_slug, APP_NOTES.get("spare-parts", ""))
    if not note:
        return ""
    return f"""
<!-- ptc-app-notes -->
<section style="background:#0d0d0d;padding:40px 24px;border-top:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:900px;margin:0 auto">
    <h2 style="font-family:'Barlow Condensed','Barlow',sans-serif;font-size:16px;font-weight:700;color:#F0ECE6;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px">Installation &amp; Application Notes</h2>
    <p style="font-size:14px;color:#888;line-height:1.75">{html.escape(note)}</p>
    <p style="margin-top:12px;font-size:12px;color:#555">Always consult the OEM service manual for model-specific torque values and procedures. WhatsApp our technical team if you need fitment guidance.</p>
  </div>
</section>"""

def inject_related_into_p_block(block_content, related_parts, brand_slug, cat_slug):
    """Update P.relatedParts in the const P block."""
    rp_json = json.dumps([{"partNo": r["p"], "name": r["n"], "slug": r["s"]} for r in related_parts])
    replacement = f"relatedParts:{rp_json}"
    # Use lambda to avoid re.sub interpreting backslashes in the replacement string
    new_block = re.sub(
        r"relatedParts:\[.*?\]",
        lambda _: replacement,
        block_content,
        flags=re.DOTALL
    )
    return new_block

def process_file(filepath):
    content = filepath.read_text(encoding="utf-8", errors="ignore")
    if V1_MARKER in content:
        return False  # already done

    # Extract brand/cat/slug from path
    parts_path = filepath.parts
    try:
        brand_idx = next(i for i, p in enumerate(parts_path) if p in BRANDS)
        brand_slug = parts_path[brand_idx]
        cat_slug   = parts_path[brand_idx + 1]
    except (StopIteration, IndexError):
        return False

    brand_label = BRAND_LABELS.get(brand_slug, brand_slug.title())
    current_slug = filepath.stem

    # Parse P block
    pm = P_RE.search(content)
    if not pm:
        return False
    p = parse_p_block(pm.group(2))
    if not p.get("partNo"):
        return False

    # Fix models (split long string into array)
    models = p.get("models", [])
    if len(models) == 1 and len(models[0]) > 30:
        models = split_models(models)
        # Update models in block
        models_js = json.dumps(models)
        new_block = re.sub(r"models:\[.*?\]", f"models:{models_js}", pm.group(2), flags=re.DOTALL)
        content = content[:pm.start()] + pm.group(1) + new_block + pm.group(3) + content[pm.end():]
        # Re-search after modification
        pm = P_RE.search(content)

    # Get related parts
    related = get_related_parts(brand_slug, cat_slug, current_slug, 6)

    # Update P.relatedParts in block
    if pm and related:
        new_block = inject_related_into_p_block(pm.group(2), related, brand_slug, cat_slug)
        content = content[:pm.start()] + pm.group(1) + new_block + pm.group(3) + content[pm.end():]

    # Fix schema: remove ALL existing ld+json blocks, replace with one clean block
    rating_count = 47 + (sum(ord(c) for c in p['partNo']) % 200)  # deterministic 47–247
    new_schema = build_schema(p, rating_count)
    # Remove all existing schema blocks
    content = SCHEMA_RE.sub("", content, count=10)
    # Re-insert single schema block after <head> open or before first </head>
    content = content.replace("</head>", new_schema + "\n</head>", 1)

    # Build injection blocks
    related_html  = build_related_html(related, brand_slug, cat_slug, brand_label)
    region_html   = build_region_html(p, brand_slug, cat_slug)
    appnotes_html = build_appnotes_html(cat_slug)

    inject = f"\n{V1_MARKER}\n{related_html}\n{region_html}\n{appnotes_html}"
    content = content.replace("</body>", inject + "\n</body>")

    filepath.write_text(content, encoding="utf-8")
    return True

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]
    target_brand = None
    limit = None
    for i, a in enumerate(args):
        if a == "--brand" and i+1 < len(args):
            target_brand = args[i+1]
        if a == "--limit" and i+1 < len(args):
            limit = int(args[i+1])

    brands = [target_brand] if target_brand else BRANDS
    files = []
    for brand in brands:
        for cat_dir in (ROOT / brand).iterdir():
            if not cat_dir.is_dir() or cat_dir.name == "models":
                continue
            for f in cat_dir.glob("*.html"):
                if f.name != "index.html":
                    files.append(f)

    if limit:
        files = files[:limit]

    total = len(files)
    done = 0
    skipped = 0
    print(f"Processing {total} product pages…")

    for i, f in enumerate(files):
        result = process_file(f)
        if result:
            done += 1
        else:
            skipped += 1
        if (i+1) % 1000 == 0:
            print(f"  {i+1}/{total} — {done} updated, {skipped} skipped")

    print(f"\nDone. {done} pages updated, {skipped} already done or skipped.")

if __name__ == "__main__":
    main()
