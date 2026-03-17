import os, re, json, openpyxl
from concurrent.futures import ThreadPoolExecutor

PAGES_DIR = "/Users/aayush/Downloads/PTC Website/pages"
EXCEL_PATH = "/Users/aayush/Downloads/PTC Website/Master List Final.xlsx"
BASE_URL = "https://partstrading.com"

# ─── CATEGORY KEYWORD MAP ───────────────────────────────────────────────────
CATEGORY_KEYWORDS = {
    "Air Brake and Drying Systems": ["air drier","solenoid valve","air valve","dryer","desiccant"],
    "Air and Fluid Filtration Systems": ["filter","filtration","strainer","separator","element"],
    "Braking System Components": ["brake","lining","drum","caliper","adjuster","brake disc","brake pad","brake shoe","brake cylinder","range cylinder"],
    "Chassis and Suspension Systems": ["cabin cylinder","tilt","fifth wheel","chassis","frame","cab mount","cabin mount","connecting pipe","fan ring"],
    "Clutch and Transmission Components": ["clutch","plate-clutch","disc-friction","friction disc","clutch plate","pressure plate","release bearing"],
    "Compressed Air System Components": ["compressed air","air compressor","unloader","governor","air tank","reservoir"],
    "Engine Parts and Cooling Parts": ["engine","piston","liner","cylinder","crankshaft","camshaft","gasket","oil pump","water pump","fan","radiator","thermostat","bearing-roller","bearing","roller","seal","connecting rod","flywheel","valve","rocker","injector","turbo","manifold","timing","belt","chain","bolt","nut","washer","gear","pulley","bracket","plate","ring","shim","bush","bushing","wear","sleeve","cover","cap","plug","sensor","oil pressure","temperature","speed sensor","camshaft as","motor gp"],
    "Lighting and Exterior Body Components": ["lamp","light","headlight","indicator","reflector","mirror","door","window","wiper","glass"],
    "Miscellaneous Parts": ["misc","general","universal"],
    "Shock Absorbers": ["shock absorber","damper","shock"],
    "Steering and Suspension Parts": ["steering","ball joint","tie rod","track rod","king pin","wheel hub","hub","knuckle","suspension","spring","leaf spring","coil spring","stabilizer"],
    "Transmission and Differential Components": ["transmission","differential","gearbox","gear","shaft","axle","propeller shaft","universal joint","cv joint","synchronizer","pump gp-piston","piston pump","hydraulic pump","pump assembly"],
}

CATEGORY_DESCRIPTIONS = {
    "Air Brake and Drying Systems": "Controls compressed air quality and brake engagement in heavy truck air brake circuits. Correct operation is critical for safe stopping distances under load.",
    "Air and Fluid Filtration Systems": "Removes contaminants from oil, fuel, and air circuits to protect engine and hydraulic system internals from premature wear and failure.",
    "Braking System Components": "Directly affects vehicle stopping performance and driver safety. OEM-spec material grades are essential for consistent fade resistance under repeated heavy braking.",
    "Chassis and Suspension Systems": "Structural and load-bearing components that determine ride quality, tyre wear, and frame fatigue life under off-road and loaded operating conditions.",
    "Clutch and Transmission Components": "Controls torque transfer between engine and drivetrain. Incorrect fitment causes premature wear, slippage, and costly transmission damage.",
    "Compressed Air System Components": "Maintains correct operating pressure throughout the air circuit for braking, suspension, and auxiliary functions.",
    "Engine Parts and Cooling Parts": "Core mechanical and thermal management components. Dimensional accuracy and material specification are critical for compression integrity and engine longevity.",
    "Lighting and Exterior Body Components": "Visibility and safety systems for operation in low-light, mining, and road conditions.",
    "Miscellaneous Parts": "Supporting hardware and ancillary components used across multiple vehicle systems.",
    "Shock Absorbers": "Controls suspension oscillation to maintain tyre contact, protect cargo, and reduce driver fatigue on rough terrain.",
    "Steering and Suspension Parts": "Determines directional control and ride stability under load. Worn components increase tyre wear and reduce driver control.",
    "Transmission and Differential Components": "Power transfer components that distribute torque to drive wheels or tracks. Critical for drawbar performance and drivetrain reliability.",
}

BRAND_EQUIP = {
    "caterpillar": "Caterpillar excavators, bulldozers, motor graders, and wheel loaders",
    "komatsu": "Komatsu excavators, bulldozers, dump trucks, and wheel loaders",
    "scania": "Scania heavy trucks (R-series, G-series, P-series) and coaches",
    "volvo": "Volvo trucks (FH, FM, FMX series) and Volvo construction equipment",
    "hitachi": "Hitachi excavators and construction machinery",
    "kobelco": "Kobelco excavators and construction equipment",
}

def infer_category(name_lower):
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in name_lower:
                return cat
    return "Miscellaneous Parts"

def make_title(part_no, brand, part_name, max_len=60):
    brand_cap = brand.capitalize()
    t = f"{part_no.upper()} — {part_name.title()} | {brand_cap} Aftermarket Part"
    if len(t) > max_len:
        t = f"{part_no.upper()} {part_name.title()} | {brand_cap} | Parts Trading Company"
    return t[:max_len]

def make_meta(part_no, brand, part_name, category, oem, alternates, application):
    brand_cap = brand.capitalize()
    parts = [f"Aftermarket {part_name.title()} for {brand_cap}"]
    parts.append(f"Part No {part_no.upper()}")
    if oem:
        parts.append(f"OEM ref: {oem}")
    if application:
        parts.append(f"Fits: {application}")
    if alternates and len(alternates) > 1:
        alt_str = ", ".join(a for a in alternates if a != part_no)
        if alt_str:
            parts.append(f"Also: {alt_str}")
    parts.append("Mumbai dispatch. WhatsApp: +91-98210-37990")
    desc = ". ".join(parts)
    return desc[:155]

def make_body_description(part_no, brand, part_name, category, oem, alternates, application):
    brand_cap = brand.capitalize()
    equip = BRAND_EQUIP.get(brand, f"{brand_cap} heavy equipment")
    cat_desc = CATEGORY_DESCRIPTIONS.get(category, "A critical replacement component verified for OEM-spec fitment.")
    
    lines = [
        f"Aftermarket replacement {part_name.lower()} for {brand_cap} — Part No {part_no.upper()}.",
        cat_desc,
    ]
    if application:
        lines.append(f"Verified fitment for: {application}.")
    else:
        lines.append(f"Sourced for use in {equip}.")
    if oem:
        lines.append(f"OEM cross-reference: {oem}.")
    lines.append("Same-day dispatch from Mumbai. Global B2B export available.")
    return " ".join(lines)

def make_breadcrumb_schema(part_no, brand, part_name, category, fname):
    brand_cap = brand.capitalize()
    url = f"{BASE_URL}/pages/{fname}"
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": brand_cap, "item": f"{BASE_URL}/pages/hubs/brand-{brand}.html"},
            {"@type": "ListItem", "position": 3, "name": category, "item": f"{BASE_URL}/pages/category-{category.lower().replace(' ','-')}.html"},
            {"@type": "ListItem", "position": 4, "name": f"{part_no.upper()} {part_name.title()}", "item": url},
        ]
    }

def update_page(fname, part_no, brand, part_name, category, oem, alternates, application):
    path = os.path.join(PAGES_DIR, fname)
    content = open(path, 'r', encoding='utf-8').read()
    
    brand_cap = brand.capitalize()
    url = f"{BASE_URL}/pages/{fname}"
    
    # 1. Title
    new_title = make_title(part_no, brand, part_name)
    content = re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', content, flags=re.DOTALL)
    
    # 2. Meta description
    new_meta = make_meta(part_no, brand, part_name, category, oem, alternates, application)
    content = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{new_meta}">', content)
    
    # 3. OG / Twitter meta
    og_title = f"{part_no.upper()} {part_name.title()} — {brand_cap} Aftermarket | Parts Trading Company"
    content = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{og_title}">', content)
    content = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{new_meta}">', content)
    content = re.sub(r'<meta property="twitter:title" content=".*?">', f'<meta property="twitter:title" content="{og_title}">', content)
    content = re.sub(r'<meta property="twitter:description" content=".*?">', f'<meta property="twitter:description" content="{new_meta}">', content)
    
    # 4. H1 — fix space issue + update with part name
    h1_new = f'''<h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                    <span class="font-mono text-yellow-500 mr-2 drop-shadow-sm">{part_no.upper()}</span>
                    {part_name.title()}
                </h1>'''
    content = re.sub(r'<h1 class="text-4xl[^"]*"[^>]*>.*?</h1>', h1_new, content, flags=re.DOTALL)
    
    # 5. Body description paragraph
    new_desc = make_body_description(part_no, brand, part_name, category, oem, alternates, application)
    content = re.sub(
        r'(<p class="text-lg text-gray-600 mb-8[^"]*"[^>]*>)(.*?)(</p>)',
        rf'\g<1>{new_desc}\g<3>',
        content, count=1, flags=re.DOTALL
    )
    
    # 6. Known Aftermarket Equivalents — inject real alternates + OEM
    alt_items = ""
    if oem:
        oem_label = oem.split('-')[0].strip() if '-' in oem else 'OEM'
        oem_val = oem.split('-',1)[1].strip() if '-' in oem else oem
        alt_items += f'<div class="text-gray-500 text-sm py-4 border-b border-gray-100 flex items-center justify-between"><span>{oem_label} Cross-reference</span><span class="font-mono text-gray-900 font-bold bg-yellow-50 px-3 py-1 rounded">{oem_val}</span></div>'
    for alt in alternates:
        if alt != part_no:
            alt_items += f'<div class="text-gray-500 text-sm py-4 border-b border-gray-100 flex items-center justify-between"><span>Alternate Part No</span><span class="font-mono text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded">{alt}</span></div>'
    alt_items += f'<div class="text-gray-500 text-sm py-4 border-b border-gray-100 flex items-center justify-between"><span>Primary OEM Equivalent</span><span class="font-mono text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded">{part_no.upper()}</span></div>'
    
    content = re.sub(
        r'(Known Aftermarket Equivalents</h3>\s*)(.*?)(</div>\s*</div>\s*<div x-show="tab === \'fitment\')',
        rf'\g<1>{alt_items}\g<3>',
        content, count=1, flags=re.DOTALL
    )
    
    # 7. Verified Machine Fitment — inject application
    fit_text = application if application else BRAND_EQUIP.get(brand, f'{brand_cap} Heavy Equipment')
    fitment_html = ""
    for model in fit_text.split(","):
        m = model.strip()
        if m:
            fitment_html += f'<span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-800 border border-gray-200 shadow-sm m-1"><svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>{m}</span>'
    
    content = re.sub(
        r'(Verified Machine Fitment</h3>\s*<div class="flex flex-wrap">)(.*?)(</div>)',
        rf'\g<1>{fitment_html}\g<3>',
        content, count=1, flags=re.DOTALL
    )
    
    # 8. BreadcrumbList schema — inject before </head>
    if 'BreadcrumbList' not in content:
        bc_schema = json.dumps(make_breadcrumb_schema(part_no, brand, part_name, category, fname), indent=2)
        bc_tag = f'\n    <script type="application/ld+json">\n{bc_schema}\n    </script>\n'
        content = content.replace('</head>', bc_tag + '</head>', 1)
    
    # 9. Add category to breadcrumb HTML if present
    cat_text = f'{brand_cap} › {category} › {part_name.title()}'
    breadcrumb_html = f'''<nav aria-label="Breadcrumb" class="mb-6 text-sm text-gray-500">
        <ol class="flex flex-wrap gap-1 items-center">
            <li><a href="/" class="hover:text-yellow-600">Home</a></li>
            <li class="mx-1 text-gray-300">/</li>
            <li><a href="/pages/hubs/brand-{brand}.html" class="hover:text-yellow-600">{brand_cap}</a></li>
            <li class="mx-1 text-gray-300">/</li>
            <li class="text-gray-700 font-medium">{part_name.title()}</li>
        </ol>
    </nav>'''
    content = content.replace('<!-- BREADCRUMB -->', breadcrumb_html, 1)
    
    open(path, 'w', encoding='utf-8').write(content)
    return True

# ─── LOAD EXCEL DATA ────────────────────────────────────────────────────────
wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True, data_only=True)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))

part_lookup = {}
for row in rows[1:]:
    part_name = row[0]
    category = row[1]
    oem_ref = row[8] if len(row) > 8 else None
    application = row[9] if len(row) > 9 else None
    raw_parts = row[2:8]
    part_nums = []
    for p in raw_parts:
        if p:
            pn = str(int(p)) if isinstance(p, float) else str(p).strip()
            if pn and pn != 'None':
                part_nums.append(pn)
    for pn in part_nums:
        part_lookup[pn] = {
            'name': part_name or 'Component',
            'category': category or 'Miscellaneous Parts',
            'oem': oem_ref,
            'application': application,
            'alternates': part_nums,
        }

print(f"Excel part numbers loaded: {len(part_lookup)}")

# ─── MATCH PAGES TO EXCEL ───────────────────────────────────────────────────
pages = [f for f in os.listdir(PAGES_DIR) if f.endswith('.html')]

def get_brand_and_partno(fname):
    base = fname.replace('.html','')
    brand = 'unknown'
    for b in ['caterpillar','komatsu','scania','volvo','hitachi','kobelco']:
        if b in base:
            brand = b
            base = base.replace(f'aftermarket-{b}-','').replace(f'{b}-','')
            break
    else:
        base = base.replace('aftermarket-','')
    part_no = base.split('-')[0]
    return brand, part_no

def extract_title_part_name(title, brand, part_no):
    t = re.split(r' — | \| ', title)[0].strip()
    t = re.sub(r'\bIndia\b', '', t, flags=re.I).strip()
    t = re.sub(re.escape(part_no), '', t, flags=re.I).strip()
    t = re.sub(re.escape(brand), '', t, flags=re.I).strip()
    t = re.sub(r'\bParts Trading Company\b', '', t, flags=re.I).strip()
    t = re.sub(r'\s+', ' ', t).strip()
    return t if t else 'Component'

# Categorize pages
excel_pages = []   # matched to Excel
named_pages = []   # have real name from title
generic_pages = [] # only "Component"

for fname in pages:
    brand, part_no = get_brand_and_partno(fname)
    
    # Try Excel match
    if part_no in part_lookup:
        d = part_lookup[part_no]
        excel_pages.append((fname, part_no, brand, d['name'], d['category'], d['oem'], d['alternates'], d['application']))
        continue
    
    # Extract name from title
    content = open(os.path.join(PAGES_DIR, fname), 'r', encoding='utf-8').read()
    title_m = re.search(r'<title>(.*?)</title>', content)
    title = title_m.group(1) if title_m else ''
    part_name = extract_title_part_name(title, brand, part_no)
    
    # Check if it's a real name or just "Component"
    is_generic = (
        part_name.lower() in ('component','','part') or
        re.fullmatch(r'[a-z0-9]{3,12}', part_name.lower())
    )
    
    category = infer_category(part_name.lower())
    
    if is_generic:
        generic_pages.append((fname, part_no, brand, part_name, category, None, [part_no], None))
    else:
        named_pages.append((fname, part_no, brand, part_name, category, None, [part_no], None))

print(f"Excel-matched: {len(excel_pages)}")
print(f"Named (from title): {len(named_pages)}")
print(f"Generic Component: {len(generic_pages)}")

# ─── PHASE 1: EXCEL ENRICHMENT ─────────────────────────────────────────────
print("\nPhase 1: Enriching Excel-matched pages...")
results = []
with ThreadPoolExecutor(max_workers=16) as ex:
    futures = [ex.submit(update_page, *args) for args in excel_pages]
    results = [f.result() for f in futures]
errors = [r for r in results if r is not True]
print(f"  Done: {results.count(True)} pages. Errors: {len(errors)}")

# ─── PHASE 2: NAMED PAGES ──────────────────────────────────────────────────
print("\nPhase 2: Enriching named pages (from title)...")
results = []
with ThreadPoolExecutor(max_workers=16) as ex:
    futures = [ex.submit(update_page, *args) for args in named_pages]
    results = [f.result() for f in futures]
errors = [r for r in results if r is not True]
print(f"  Done: {results.count(True)} pages. Errors: {len(errors)}")

# ─── PHASE 3: GENERIC PAGES (brand-specific smart templates) ──────────────
BRAND_SPECIFIC_PARTS = {
    "caterpillar": [
        "Machined to CAT factory tolerances for direct-fit replacement in Caterpillar construction equipment.",
        "OEM-spec aftermarket component for Caterpillar excavators, bulldozers, motor graders and wheel loaders.",
        "Verified dimensional match to original Caterpillar engineering specification.",
    ],
    "komatsu": [
        "Manufactured to Komatsu OEM specification for direct fitment in Komatsu excavators, bulldozers, and dump trucks.",
        "Aftermarket equivalent meeting Komatsu factory tolerances for construction and mining equipment.",
        "OEM-spec replacement component for Komatsu heavy machinery — same-day Mumbai dispatch.",
    ],
    "scania": [
        "Aftermarket equivalent meeting Scania OEM specification for R-series, G-series, and P-series heavy trucks.",
        "Direct-fit replacement for Scania commercial vehicles — dimensionally matched to factory spec.",
        "OEM-grade aftermarket component for Scania trucks, available for global B2B export from Mumbai.",
    ],
    "volvo": [
        "Aftermarket replacement built to Volvo CE/trucks OEM specification for FH, FM, and FMX series.",
        "Direct-fit component for Volvo trucks and construction equipment — Mumbai dispatch available.",
        "OEM-spec aftermarket part for Volvo heavy transport and construction machinery.",
    ],
}

import hashlib
def get_brand_variant(brand, part_no):
    variants = BRAND_SPECIFIC_PARTS.get(brand, BRAND_SPECIFIC_PARTS['caterpillar'])
    idx = int(hashlib.md5(part_no.encode()).hexdigest(), 16) % len(variants)
    return variants[idx]

def update_generic_page(fname, part_no, brand, part_name, category, oem, alternates, application):
    path = os.path.join(PAGES_DIR, fname)
    content = open(path, 'r', encoding='utf-8').read()
    brand_cap = brand.capitalize()
    
    # Try to extract cross-reference from title
    title_m = re.search(r'<title>(.*?)</title>', content)
    title = title_m.group(1) if title_m else ''
    # Look for secondary part number in title (e.g., "2590608 Caterpillar 4L7249")
    cross_refs = re.findall(r'\b([0-9][A-Z0-9]{4,9}|[A-Z][0-9][A-Z0-9]{3,8})\b', title, re.I)
    cross_refs = [c.upper() for c in cross_refs if c.upper() != part_no.upper()]
    
    variant_desc = get_brand_variant(brand, part_no)
    new_desc = f"Aftermarket part for {brand_cap} — Part No {part_no.upper()}. {variant_desc}"
    if cross_refs:
        new_desc += f" Cross-reference: {', '.join(cross_refs[:2])}."
    new_desc += " Same-day dispatch from Mumbai."
    
    # Update meta description
    new_meta = f"{brand_cap} Part No {part_no.upper()} — aftermarket OEM-spec replacement."
    if cross_refs:
        new_meta += f" Cross-ref: {', '.join(cross_refs[:1])}."
    new_meta += " Mumbai dispatch. India & global export. WhatsApp: +91-98210-37990"
    new_meta = new_meta[:155]
    content = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{new_meta}">', content)
    
    # Update body description paragraph
    content = re.sub(
        r'(<p class="text-lg text-gray-600 mb-8[^"]*"[^>]*>)(.*?)(</p>)',
        rf'\g<1>{new_desc}\g<3>',
        content, count=1, flags=re.DOTALL
    )
    
    # Fix H1 space issue
    h1_m = re.search(r'<h1 class="text-4xl[^"]*"[^>]*>.*?</h1>', content, re.DOTALL)
    if h1_m:
        h1_new = f'''<h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                    <span class="font-mono text-yellow-500 mr-2 drop-shadow-sm">{part_no.upper()}</span>
                    {brand_cap} Aftermarket Part
                </h1>'''
        content = content.replace(h1_m.group(0), h1_new, 1)
    
    # Add BreadcrumbList schema
    if 'BreadcrumbList' not in content:
        bc = make_breadcrumb_schema(part_no, brand, 'Aftermarket Part', category, fname)
        bc_tag = f'\n    <script type="application/ld+json">\n{json.dumps(bc, indent=2)}\n    </script>\n'
        content = content.replace('</head>', bc_tag + '</head>', 1)
    
    # Add breadcrumb HTML
    breadcrumb_html = f'''<nav aria-label="Breadcrumb" class="mb-6 text-sm text-gray-500">
        <ol class="flex flex-wrap gap-1 items-center">
            <li><a href="/" class="hover:text-yellow-600">Home</a></li>
            <li class="mx-1 text-gray-300">/</li>
            <li><a href="/pages/hubs/brand-{brand}.html" class="hover:text-yellow-600">{brand_cap}</a></li>
            <li class="mx-1 text-gray-300">/</li>
            <li class="text-gray-700 font-medium">{part_no.upper()}</li>
        </ol>
    </nav>'''
    content = content.replace('<!-- BREADCRUMB -->', breadcrumb_html, 1)
    
    open(path, 'w', encoding='utf-8').write(content)
    return True

print("\nPhase 3: Enriching generic Component pages...")
results = []
with ThreadPoolExecutor(max_workers=16) as ex:
    futures = [ex.submit(update_generic_page, *args) for args in generic_pages]
    results = [f.result() for f in futures]
errors = [r for r in results if r is not True]
print(f"  Done: {results.count(True)} pages. Errors: {len(errors)}")

print("\n=== ALL DONE ===")
print(f"Total pages enriched: {len(excel_pages) + len(named_pages) + len(generic_pages)}")
