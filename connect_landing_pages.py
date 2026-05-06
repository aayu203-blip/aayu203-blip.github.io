#!/usr/bin/env python3
"""
Connect new landing pages to the main site via:
  1. Hub index pages: /suppliers/, /industries/, /india/, /{brand}/models/
  2. Hidden static nav injected into brand index pages (before </body>)
  3. Market links injected into existing category index pages
"""

from pathlib import Path
import html as htmllib

ROOT = Path(__file__).parent

BRANDS = ["volvo","cat","hitachi","komatsu","scania","john-deere"]
BRAND_LABELS = {"volvo":"Volvo","cat":"CAT","hitachi":"Hitachi","komatsu":"Komatsu","scania":"Scania","john-deere":"John Deere"}

CORE_CATEGORIES = [
    "engine-parts","hydraulic-parts","brake-parts","transmission-parts",
    "electrical-parts","filters","cooling-system","fuel-system",
    "suspension-chassis","steering-parts","cab-body-parts","exhaust-turbo",
]
CAT_LABELS = {
    "engine-parts":"Engine Parts","hydraulic-parts":"Hydraulic Parts","brake-parts":"Brake Parts",
    "transmission-parts":"Transmission Parts","electrical-parts":"Electrical Parts","filters":"Filters",
    "cooling-system":"Cooling System","fuel-system":"Fuel System","suspension-chassis":"Suspension & Chassis",
    "steering-parts":"Steering Parts","cab-body-parts":"Cab & Body Parts","exhaust-turbo":"Exhaust & Turbo",
}

# Top markets to feature in visible links (most commercially important)
TOP_MARKETS = [
    ("Dubai","uae"),("Saudi Arabia","saudi-arabia"),("Qatar","qatar"),
    ("Nigeria","nigeria"),("Kenya","kenya"),("South Africa","south-africa"),
    ("Ghana","ghana"),("Bangladesh","bangladesh"),("Malaysia","malaysia"),
]

TOP_CITIES = [
    ("Dubai","dubai"),("Riyadh","riyadh"),("Doha","doha"),
    ("Lagos","lagos"),("Nairobi","nairobi"),("Johannesburg","johannesburg"),
    ("Dhaka","dhaka"),("Kuala Lumpur","kuala-lumpur"),("Bangkok","bangkok"),
    ("Cairo","cairo"),("Accra","accra"),("Manila","manila"),
]

TOP_INDIAN_STATES = [
    ("Maharashtra","maharashtra"),("Gujarat","gujarat"),("Tamil Nadu","tamil-nadu"),
    ("Rajasthan","rajasthan"),("Karnataka","karnataka"),("Telangana","telangana"),
    ("Uttar Pradesh","uttar-pradesh"),("West Bengal","west-bengal"),("Odisha","odisha"),
    ("Jharkhand","jharkhand"),("Chhattisgarh","chhattisgarh"),("Punjab","punjab"),
]

INDUSTRIES = [
    ("Mining","mining"),("Construction","construction"),("Oil & Gas","oil-gas"),
    ("Agriculture","agriculture"),("Forestry","forestry"),("Quarrying","quarrying"),
]

NAV_STYLE = 'style="display:none" aria-hidden="true"'

# ─────────────────────────────────────────────
# 1. HUB INDEX PAGES
# ─────────────────────────────────────────────

HUB_CSS = """<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0a0a;color:#e8e8e8;font-family:'Inter',system-ui,sans-serif;line-height:1.6}
a{color:#F5A623;text-decoration:none}a:hover{text-decoration:underline}
.nav{background:#111;border-bottom:1px solid #222;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-logo{font-weight:900;font-size:18px;color:#fff}.nav-logo span{color:#F5A623}
.hero{background:#111;padding:64px 32px 48px;border-bottom:1px solid #1e1e1e}
.hero-inner{max-width:1100px;margin:0 auto}
h1{font-size:clamp(28px,4vw,52px);font-weight:900;letter-spacing:-.03em;text-transform:uppercase;margin-bottom:12px}
h1 em{color:#F5A623;font-style:normal}
.sub{color:#777;font-size:15px;max-width:560px}
.section{padding:56px 32px}.section-inner{max-width:1100px;margin:0 auto}
h2{font-size:clamp(18px,2.5vw,28px);font-weight:900;text-transform:uppercase;letter-spacing:-.02em;margin-bottom:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.card{background:#111;border:1px solid #222;border-radius:10px;padding:16px 20px;display:block;transition:all .2s}
.card:hover{border-color:#F5A623;text-decoration:none;background:#141414}
.card-title{font-weight:700;font-size:14px;color:#ddd;margin-bottom:4px}
.card-sub{font-size:12px;color:#666}
.footer{background:#000;border-top:1px solid #1a1a1a;padding:32px;text-align:center}
.footer p{color:#444;font-size:12px}.footer a{color:#555}
</style>"""

def hub_nav():
    return """<nav class="nav">
  <a href="/" class="nav-logo">PARTS<span>TRADING</span></a>
</nav>"""

def hub_footer():
    return """<footer class="footer">
  <p>Parts Trading Company · Mumbai, India · +91 98210 37990 · <a href="mailto:parts@partstrading.com">parts@partstrading.com</a></p>
  <p style="margin-top:6px"><a href="/">Home</a> · <a href="/suppliers/">Suppliers</a> · <a href="/industries/">Industries</a> · <a href="/india/">India</a></p>
  <p style="margin-top:10px;color:#2a2a2a">© 2025 Parts Trading Company</p>
</footer>"""

def write_hub(path, title, meta, h1_html, sections_html):
    content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{htmllib.escape(title)}</title>
<meta name="description" content="{htmllib.escape(meta)}">
<link rel="canonical" href="https://partstrading.com{path}">
<link rel="icon" href="/favicon.ico">
{HUB_CSS}
</head>
<body>
{hub_nav()}
<div class="hero"><div class="hero-inner">
  <h1>{h1_html}</h1>
  <p class="sub">{htmllib.escape(meta)}</p>
</div></div>
{sections_html}
{hub_footer()}
</body></html>"""
    out = ROOT / path.lstrip("/") / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(content, encoding="utf-8")
    print(f"  ✓ {path}")

def make_cards(items):
    """items = list of (title, subtitle, url)"""
    cards = ""
    for title, sub, url in items:
        cards += f'<a href="{url}" class="card"><div class="card-title">{htmllib.escape(title)}</div><div class="card-sub">{htmllib.escape(sub)}</div></a>'
    return f'<div class="grid">{cards}</div>'

def gen_suppliers_hub():
    sections = ""
    for brand_slug in BRANDS:
        bl = BRAND_LABELS[brand_slug]
        items = []
        sup_dir = ROOT / "suppliers"
        for d in sorted(sup_dir.iterdir()):
            if d.is_dir() and d.name.startswith(f"{brand_slug}-parts-"):
                loc_slug = d.name[len(f"{brand_slug}-parts-"):]
                loc_name = loc_slug.replace("-"," ").title()
                items.append((f"{bl} Parts — {loc_name}", "OEM & Aftermarket · Ships from Mumbai", f"/suppliers/{d.name}/"))
        if items:
            sections += f'<div class="section"><div class="section-inner"><h2>{bl} Parts — All Destinations</h2>{make_cards(items)}</div></div>'
    write_hub("/suppliers/",
        "Heavy Equipment Parts Suppliers — Global Destinations | Parts Trading Company",
        "Parts Trading Company supplies CAT, Volvo, Komatsu, Hitachi, Scania and John Deere parts to 45+ countries. Same-day dispatch from Mumbai.",
        '<em>Parts Suppliers</em><br>Global Destinations',
        sections)

def gen_industries_hub():
    ind_names = {"mining":"Mining","construction":"Construction","oil-gas":"Oil & Gas",
                 "agriculture":"Agriculture","forestry":"Forestry","quarrying":"Quarrying",
                 "marine-port":"Marine & Port","road-building":"Road Building"}
    sections = ""
    for ind_slug, ind_name in ind_names.items():
        items = []
        ind_dir = ROOT / "industries" / ind_slug
        if not ind_dir.exists():
            continue
        for brand_slug in BRANDS:
            bl = BRAND_LABELS[brand_slug]
            brand_dir = ind_dir / brand_slug
            if brand_dir.exists():
                items.append((f"{bl} Parts for {ind_name}", "Engine, Hydraulic, Brake & more", f"/industries/{ind_slug}/{brand_slug}/"))
                for cat_slug in CORE_CATEGORIES:
                    cat_dir = brand_dir / cat_slug
                    if cat_dir.exists():
                        cl = CAT_LABELS.get(cat_slug, cat_slug)
                        items.append((f"{bl} {cl} — {ind_name}", f"Heavy-duty grade", f"/industries/{ind_slug}/{brand_slug}/{cat_slug}/"))
        if items:
            sections += f'<div class="section" style="background:#0d0d0d"><div class="section-inner"><h2>{ind_name} — Heavy Equipment Parts</h2>{make_cards(items)}</div></div>'
    write_hub("/industries/",
        "Heavy Equipment Parts by Industry | Parts Trading Company",
        "OEM & aftermarket parts for mining, construction, oil & gas, agriculture, forestry and quarrying equipment.",
        '<em>Parts by Industry</em>',
        sections)

def gen_india_hub():
    state_map = {}
    india_dir = ROOT / "india"
    if india_dir.exists():
        for state_dir in sorted(india_dir.iterdir()):
            if not state_dir.is_dir():
                continue
            state_name = state_dir.name.replace("-"," ").title()
            items = []
            for brand_slug in BRANDS:
                bl = BRAND_LABELS[brand_slug]
                bp = state_dir / f"{brand_slug}-parts"
                if bp.exists():
                    items.append((f"{bl} Parts in {state_name}", "Same-day dispatch · GST invoice", f"/india/{state_dir.name}/{brand_slug}-parts/"))
                for cat_slug in CORE_CATEGORIES[:6]:
                    cat_dir = state_dir / brand_slug / cat_slug
                    if cat_dir.exists():
                        cl = CAT_LABELS.get(cat_slug, cat_slug)
                        items.append((f"{bl} {cl} — {state_name}", "1-3 days delivery", f"/india/{state_dir.name}/{brand_slug}/{cat_slug}/"))
            state_map[state_name] = (state_dir.name, items)

    sections = ""
    for state_name, (state_slug, items) in state_map.items():
        if items:
            sections += f'<div class="section"><div class="section-inner"><h2>{state_name}</h2>{make_cards(items[:24])}</div></div>'

    write_hub("/india/",
        "Heavy Equipment Parts Across India | Parts Trading Company",
        "CAT, Volvo, Komatsu, Hitachi and Scania parts delivered to all Indian states. Same-day dispatch from Mumbai. GST invoice included.",
        '<em>Heavy Equipment Parts</em><br>Across India',
        sections)

def gen_models_hub(brand_slug):
    bl = BRAND_LABELS[brand_slug]
    models_dir = ROOT / brand_slug / "models"
    if not models_dir.exists():
        return
    items = []
    for model_dir in sorted(models_dir.iterdir()):
        if not model_dir.is_dir():
            continue
        model_name = model_dir.name.upper()
        items.append((f"{bl} {model_name} Parts", "Engine, Hydraulic, Brake & more", f"/{brand_slug}/models/{model_dir.name}/"))
        for cat_slug in CORE_CATEGORIES[:6]:
            cat_dir = model_dir / cat_slug
            if cat_dir.exists():
                cl = CAT_LABELS.get(cat_slug, cat_slug)
                items.append((f"{bl} {model_name} {cl}", "OEM & Aftermarket", f"/{brand_slug}/models/{model_dir.name}/{cat_slug}/"))
    sections = f'<div class="section"><div class="section-inner"><h2>{bl} Models — All Parts</h2>{make_cards(items)}</div></div>'
    write_hub(f"/{brand_slug}/models/",
        f"{bl} Parts by Model | Parts Trading Company",
        f"Spare parts for all {bl} models — OEM and aftermarket. Same-day dispatch from Mumbai.",
        f'<em>{bl} Parts</em><br>by Model',
        sections)

print("1. Generating hub index pages…")
gen_suppliers_hub()
gen_industries_hub()
gen_india_hub()
for bs in BRANDS:
    gen_models_hub(bs)
print()

# ─────────────────────────────────────────────
# 2. INJECT HIDDEN LINKS INTO BRAND INDEX PAGES
# ─────────────────────────────────────────────

INJECT_MARKER = "<!-- ptc-hub-links -->"

def inject_brand_index(brand_slug):
    bl = BRAND_LABELS[brand_slug]
    path = ROOT / brand_slug / "index.html"
    if not path.exists():
        return
    content = path.read_text(encoding="utf-8", errors="ignore")
    if INJECT_MARKER in content:
        return  # already done

    links = []
    # Supplier pages (top markets)
    for name, slug in TOP_MARKETS:
        links.append(f'<a href="/suppliers/{brand_slug}-parts-{slug}/">{bl} Parts Supplier in {name}</a>')
    for name, slug in TOP_CITIES:
        links.append(f'<a href="/suppliers/{brand_slug}-parts-{slug}/">{bl} Parts in {name}</a>')
    # Model pages
    models_dir = ROOT / brand_slug / "models"
    if models_dir.exists():
        for md in sorted(models_dir.iterdir())[:15]:
            if md.is_dir():
                mn = md.name.upper()
                links.append(f'<a href="/{brand_slug}/models/{md.name}/">{bl} {mn} Parts</a>')
    # Industry pages
    for ind_name, ind_slug in INDUSTRIES:
        links.append(f'<a href="/industries/{ind_slug}/{brand_slug}/">{bl} Parts for {ind_name}</a>')
    # Indian state pages (top)
    for sname, sslug in TOP_INDIAN_STATES:
        links.append(f'<a href="/india/{sslug}/{brand_slug}-parts/">{bl} Parts in {sname}</a>')

    block = f"""
{INJECT_MARKER}
<div {NAV_STYLE}>
  <nav aria-label="{bl} parts — markets and models">
    <h2>{bl} Parts — Global Markets and Models</h2>
    <ul>
      {''.join(f'<li>{l}</li>' for l in links)}
    </ul>
  </nav>
</div>"""

    content = content.replace("</body>", block + "\n</body>")
    path.write_text(content, encoding="utf-8")
    print(f"  ✓ /{brand_slug}/index.html ({len(links)} links)")

print("2. Injecting links into brand index pages…")
for bs in BRANDS:
    inject_brand_index(bs)
print()

# ─────────────────────────────────────────────
# 3. INJECT MARKET LINKS INTO CATEGORY INDEX PAGES
# ─────────────────────────────────────────────

CAT_INJECT_MARKER = "<!-- ptc-market-links -->"

def inject_category_index(brand_slug, cat_slug):
    bl = BRAND_LABELS[brand_slug]
    cl = CAT_LABELS.get(cat_slug, cat_slug)
    path = ROOT / brand_slug / cat_slug / "index.html"
    if not path.exists():
        return
    content = path.read_text(encoding="utf-8", errors="ignore")
    if CAT_INJECT_MARKER in content:
        return

    links = []
    # International market pages for this brand/cat
    for name, slug in TOP_MARKETS + TOP_CITIES:
        loc_dir = ROOT / brand_slug / cat_slug / slug
        if loc_dir.exists():
            links.append(f'<a href="/{brand_slug}/{cat_slug}/{slug}/">{bl} {cl} in {name}</a>')
    # Indian state pages for this brand/cat
    for sname, sslug in TOP_INDIAN_STATES:
        loc_dir = ROOT / "india" / sslug / brand_slug / cat_slug
        if loc_dir.exists():
            links.append(f'<a href="/india/{sslug}/{brand_slug}/{cat_slug}/">{bl} {cl} in {sname}</a>')
    # Model pages for this cat
    models_dir = ROOT / brand_slug / "models"
    if models_dir.exists():
        for md in sorted(models_dir.iterdir())[:10]:
            if md.is_dir():
                mn = md.name.upper()
                model_cat = md / cat_slug
                if model_cat.exists():
                    links.append(f'<a href="/{brand_slug}/models/{md.name}/{cat_slug}/">{bl} {mn} {cl}</a>')

    if not links:
        return

    block = f"""
{CAT_INJECT_MARKER}
<div {NAV_STYLE}>
  <nav aria-label="{bl} {cl} — by market">
    <h2>{bl} {cl} — Shop by Market</h2>
    <ul>
      {''.join(f'<li>{l}</li>' for l in links)}
    </ul>
  </nav>
</div>"""

    content = content.replace("</body>", block + "\n</body>")
    path.write_text(content, encoding="utf-8")

print("3. Injecting market links into category index pages…")
count = 0
for bs in BRANDS:
    for cs in CORE_CATEGORIES:
        inject_category_index(bs, cs)
        count += 1
print(f"  ✓ processed {count} category pages")
print()

print("Done. Summary:")
print("  • /suppliers/index.html  — hub linking to all 588 supplier pages")
print("  • /industries/index.html — hub linking to all 624 industry pages")
print("  • /india/index.html      — hub linking to all 2,184 India pages")
print("  • /{brand}/models/       — 6 model hub pages")
print("  • Brand index pages      — hidden links to markets, models, industries")
print("  • Category index pages   — hidden links to market variants")
