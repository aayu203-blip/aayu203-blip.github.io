#!/usr/bin/env python3
"""
Phase 2: Gemini AI enrichment for product pages.

For each product page, Gemini generates:
  - Custom 2-sentence description (specific to the part, not generic)
  - Real model numbers array (parsed from part name + brand knowledge)
  - 3 custom FAQs (part-specific questions and technical answers)
  - Failure symptoms (what breaks when this part fails)
  - Install tip (one practical installation tip)

Results cached in gemini_product_cache.json — resumable.
After enrichment, applies to HTML: updates P block + SSR description + injects AI sections.

Usage:
  export GEMINI_API_KEY=your_key_here
  python3 phase2_gemini_enrich.py                  # all pages
  python3 phase2_gemini_enrich.py --brand volvo    # single brand
  python3 phase2_gemini_enrich.py --limit 500      # test batch
  python3 phase2_gemini_enrich.py --apply-only     # apply cached data without API calls
"""

import re, json, sys, time, html, os, threading
from pathlib import Path
from urllib import request as urllib_request
from urllib.error import HTTPError

ROOT = Path(__file__).parent
CACHE_FILE = ROOT / "gemini_product_cache.json"
CATALOG = json.loads((ROOT / "catalog_index.json").read_text())

BRANDS = ["volvo","cat","hitachi","komatsu","scania","john-deere"]
BRAND_LABELS = {"volvo":"Volvo","cat":"CAT","hitachi":"Hitachi","komatsu":"Komatsu","scania":"Scania","john-deere":"John Deere"}

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={key}"
BATCH_SIZE = 5          # parts per Gemini call (smaller = less truncation risk)
RATE_LIMIT_DELAY = 4.5  # seconds between calls (free tier: ~15 RPM)

# Known valid model codes per brand — used to validate Gemini output
# Gemini can only return models that EITHER appear in this whitelist
# OR appear verbatim in the part's name field (extracted directly, not generated)
KNOWN_MODELS = {
    "volvo": {"FH12","FH16","FM12","FM9","FM11","FM13","B10","B12","B7","A25","A30","A35","A40","EC140","EC160","EC180","EC200","EC210","EC220","EC235","EC240","EC250","EC290","EC300","EC340","EC360","EC380","EC460","EC480","EC700","L60","L70","L90","L110","L120","L150","L180","L220","G900","G930","G940","G960","G970","G990","P7170","P7820","ABG"},
    "cat":   {"320D","320C","320B","325D","329D","330D","336D","340D","349D","365C","374D","390F","D3","D4","D5","D6","D6T","D6N","D7","D8","D8T","D9","D9T","D10","D10T","D11","769","769C","772","773","775","777","777F","785","789","793","797","950","962","966","972","980","988","990","992","994","994K","D250","D300","D350","D400","3306","3406","3408","3412","3508","3512","3516","C7","C9","C10","C11","C12","C13","C15","C16","C18","C27","C32","TH","TH62","TH63","TH64","GC","GP"},
    "hitachi": {"ZX120","ZX130","ZX135","ZX160","ZX180","ZX200","ZX210","ZX225","ZX230","ZX240","ZX250","ZX270","ZX280","ZX300","ZX330","ZX350","ZX360","ZX400","ZX450","ZX470","ZX500","ZX520","ZX650","ZX670","ZX870","ZX1000","EX100","EX120","EX150","EX200","EX220","EX270","EX300","EX330","EX400","EX550","EX700","EX1200","UH083","UH143","UH162","LX80","LX110","LX130","LX150","LX190","LX210","LX225","LX290"},
    "komatsu": {"PC60","PC78","PC88","PC120","PC130","PC138","PC160","PC180","PC200","PC210","PC220","PC228","PC240","PC270","PC290","PC300","PC340","PC360","PC380","PC400","PC450","PC490","PC600","PC650","PC750","PC800","PC1250","PC2000","D37","D39","D51","D53","D61","D65","D85","D135","D155","D275","D375","D475","WA100","WA150","WA180","WA200","WA250","WA320","WA380","WA400","WA430","WA470","WA500","WA600","GD530","GD670","GD825","HM300","HM400","HD325","HD405","HD465","HD605","HD785","HD985"},
    "scania": {"R380","R440","R450","R480","R500","R560","R580","R620","R730","S450","S500","S520","S560","S580","S620","S730","P280","P320","P380","P400","P440","G340","G380","G400","G440","G480","K310","K360","K380","K410","K440","K480","F280","F320","F380","L320","DC9","DC11","DC13","DC16","DT12","OC9","P113","P124","P114","P144","R113","R124","R143","R144","T113","T124","T143","T144"},
    "john-deere": {"310L","310K","310SL","410L","410K","510K","710L","310SK","210LE","310SE","444K","444J","544K","544J","624K","624J","644K","644J","724K","744K","824K","844K","524K","4WD","850K","850J","764","772","850","862","870","872","1050","1150","1850","9RX","9RT","9R","8R","8RT"},
}

def validate_models(brand_slug, raw_models, part_name):
    """
    Filter Gemini-returned model codes:
    1. Keep any code that's in the known whitelist for this brand
    2. Keep any code that appears verbatim in the part name (ground truth)
    3. Discard anything else
    """
    whitelist = KNOWN_MODELS.get(brand_slug, set())
    valid = []
    part_name_upper = part_name.upper()
    for m in raw_models:
        m = m.strip()
        if not m or len(m) < 2:
            continue
        m_upper = m.upper()
        # Accept if in whitelist (case-insensitive)
        if m_upper in {w.upper() for w in whitelist}:
            valid.append(m)
        # Accept if it appears verbatim in the part name (directly sourced, not hallucinated)
        elif m_upper in part_name_upper:
            valid.append(m)
        # Accept short alphanumeric codes from the part name (e.g. "C9", "3406C")
        elif re.match(r'^[A-Z0-9]{2,8}$', m_upper) and m_upper in part_name_upper:
            valid.append(m)
    return valid[:15]  # cap at 15

P_RE = re.compile(r"(<script>const P = \{)(.*?)(\};</script>)", re.DOTALL)
V2_MARKER = "<!-- ptc-enriched-v2 -->"

# ── Cache ────────────────────────────────────────────────────────────────────

def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text())
    return {}

def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, indent=2))

cache_lock = threading.Lock()
_cache = load_cache()

def cache_get(part_no):
    return _cache.get(part_no)

def cache_set(part_no, data):
    with cache_lock:
        _cache[part_no] = data
        save_cache(_cache)

# ── Parse P block ─────────────────────────────────────────────────────────────

def parse_p_block(block_content):
    def field(name):
        m = re.search(rf"{name}:'([^']*)'", block_content)
        return m.group(1) if m else ""
    def arr(name):
        m = re.search(rf"{name}:\[([^\]]*)\]", block_content)
        if not m: return []
        return [x.strip().strip("'\"") for x in re.findall(r"'([^']*)'", m.group(1))]
    return {
        "partNo":    field("partNo"),
        "name":      field("name"),
        "brand":     field("brand"),
        "brandSlug": field("brandSlug"),
        "category":  field("category"),
        "catSlug":   field("catSlug"),
        "description": field("description"),
        "models":    arr("models"),
        "xref":      arr("xref"),
    }

# ── Gemini API ────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a senior technical writer and parts specialist for heavy construction, mining, and transportation equipment (Caterpillar, Volvo, Komatsu, Hitachi, Scania, John Deere).

Given a batch of spare parts, return a JSON object where each key is the part number and the value contains rich, accurate technical content for that part's product page.

Return EXACTLY this structure for each part:
{
  "PART_NO": {
    "description": "3 sentences. (1) What the part IS, its exact function, and which system it belongs to. (2) What quality/material standard it meets and how it differs from a worn/failed part. (3) What failure looks like from the operator's perspective — specific observable symptoms.",
    "specs": [
      {"key": "Part Type", "val": "e.g. Hydraulic Piston Pump, Friction Clutch Disc, Thermostat, etc."},
      {"key": "Material", "val": "e.g. Cast iron, forged steel, NBR rubber, sintered bronze — infer from part type"},
      {"key": "Application", "val": "e.g. Engine cooling circuit, main hydraulic circuit, front axle — infer from part name"},
      {"key": "Service Life", "val": "e.g. Replace every 2,000 hrs or annually — category-appropriate estimate"},
      {"key": "Compatibility", "val": "OEM cross-reference or equivalent standard if known, else 'OEM specification'"},
      {"key": "Condition", "val": "New — OEM specification aftermarket"}
    ],
    "models": ["ModelCode1", "ModelCode2"],
    "faq": [
      {"q": "Specific technical question a mechanic would ask about THIS part", "a": "Precise answer, 1-2 sentences — mention the part function or system"},
      {"q": "Question about compatibility, fitment, or serial number ranges", "a": "Helpful answer mentioning how to verify fitment"},
      {"q": "Question about quality, warranty, or OEM vs aftermarket", "a": "Confident answer about the quality standard and warranty offered"},
      {"q": "Question about installation, service interval, or what to replace alongside it", "a": "Practical answer a mechanic would appreciate"}
    ],
    "symptoms": "3 sentences: (1) First observable sign of failure. (2) How the problem progresses if ignored. (3) Worst-case consequence if left unaddressed — frame it as equipment risk, not catastrophic language.",
    "install_tip": "2 sentences: One prep step mechanics often skip, and one installation mistake to avoid. Be specific to this part TYPE. Do NOT invent torque values, pressure figures, or clearance measurements.",
    "service_note": "1 sentence: What other parts should be inspected or replaced at the same time as this one — practical co-parts recommendation.",
    "seo_title": "A natural-language search query someone would type to find this part — e.g. 'Volvo FH12 water pump replacement' or 'CAT 320D hydraulic pump seal kit'"
  }
}

CRITICAL RULES — violations cause rejection:
- models: ONLY codes you can derive from the part NAME provided. Never invent. If name says "For Volvo FH12 FH16" → ["FH12","FH16"]. Short codes only.
- specs: infer from part type and category — never invent specific measurements. Keep "val" under 60 chars.
- description: never use the words "spare part", "OEM-specification", or "compatible with" as the opening. Lead with what the part does.
- symptoms: real failure progression — avoid dramatic language like "catastrophic" or "total failure".
- install_tip: NO specific numbers (Nm, psi, bar, mm) — practical qualitative advice only.
- seo_title: must read like a natural search query, not a product title.
- Return valid JSON only. No markdown fences. No text outside the JSON object."""

def call_gemini(parts_batch):
    """Call Gemini with a batch of parts. Returns dict of {partNo: enrichment}."""
    parts_list = "\n".join(
        f"- Part: {p['partNo']} | Name: {p['name']} | Brand: {p['brand']} | Category: {p['category']} | Current desc: {p['description'][:120]} | Models hint: {', '.join(p['models'][:5])}"
        for p in parts_batch
    )
    prompt = f"Enrich these {len(parts_batch)} parts:\n\n{parts_list}\n\nReturn only the JSON object."

    body = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json",
            "maxOutputTokens": 8192
        }
    }

    req = urllib_request.Request(
        GEMINI_URL.format(key=GEMINI_API_KEY),
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib_request.urlopen(req, timeout=30) as resp:
            raw = json.loads(resp.read())
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            # Strip markdown fences if present
            text = re.sub(r'^```(?:json)?\n?', '', text.strip())
            text = re.sub(r'\n?```$', '', text.strip())
            return json.loads(text)
    except HTTPError as e:
        body_bytes = e.read()
        print(f"  Gemini HTTP {e.code}: {body_bytes[:200]}")
        return {}
    except json.JSONDecodeError as e:
        # Try to salvage partial JSON by truncating at the last complete object
        try:
            # Find the last complete "}" that closes a top-level key
            last_good = text.rfind('"}')
            if last_good > 0:
                truncated = text[:last_good+2] + "}"
                # If it started with { but isn't closed, close it
                if truncated.count("{") > truncated.count("}"):
                    truncated += "}" * (truncated.count("{") - truncated.count("}"))
                return json.loads(truncated)
        except Exception:
            pass
        print(f"  Gemini JSON parse error: {e} (len={len(text)})")
        return {}
    except Exception as e:
        print(f"  Gemini error: {e}")
        return {}

# ── Apply enrichment to HTML ──────────────────────────────────────────────────

def build_specs_table_html(specs):
    """Build an additional specs table from Gemini-generated specs."""
    if not specs:
        return ""
    rows = ""
    for s in specs:
        k = html.escape(str(s.get("key","")))
        v = html.escape(str(s.get("val","")))
        if not k or not v:
            continue
        rows += f'<tr style="border-bottom:1px solid rgba(255,255,255,0.04)"><td style="padding:7px 16px 7px 0;font-size:12px;color:#555;white-space:nowrap;font-weight:600;letter-spacing:.04em;text-transform:uppercase;width:140px">{k}</td><td style="padding:7px 0;font-size:13px;color:#bbb">{v}</td></tr>'
    if not rows:
        return ""
    return f"""<div style="margin-top:20px;background:#0D0D0D;border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden">
<div style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:#F0ECE6;letter-spacing:.06em;text-transform:uppercase">Technical Specifications</div>
<table style="width:100%;border-collapse:collapse"><tbody>{rows}</tbody></table>
</div>"""

def apply_enrichment(filepath, enrichment):
    """Apply Gemini enrichment to a product HTML file."""
    content = filepath.read_text(encoding="utf-8", errors="ignore")
    if V2_MARKER in content:
        return False

    pm = P_RE.search(content)
    if not pm:
        return False

    block = pm.group(2)

    # 1. Update description in P block
    if enrichment.get("description"):
        new_desc = enrichment["description"].replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
        block = re.sub(r"description:'[^']*'", lambda _: f"description:'{new_desc}'", block)

    # 2. Update models in P block
    if enrichment.get("models") and len(enrichment["models"]) >= 1:
        models_js = json.dumps(enrichment["models"])
        block = re.sub(r"models:\[.*?\]", lambda _: f"models:{models_js}", block, flags=re.DOTALL)

    # 3. Update faq in P block with AI custom FAQs (up to 4)
    if enrichment.get("faq") and len(enrichment["faq"]) >= 2:
        ai_faqs = enrichment["faq"][:4]
        faq_js_items = []
        for faq in ai_faqs:
            q = faq.get("q","").replace("\\","\\\\").replace("'","\\'").replace("\n"," ")[:200]
            a = faq.get("a","").replace("\\","\\\\").replace("'","\\'").replace("\n"," ")[:400]
            if q and a:
                faq_js_items.append(f"{{q:'{q}',a:'{a}'}}")
        if faq_js_items:
            faq_js = "[" + ",".join(faq_js_items) + "]"
            block = re.sub(r"faq:\[.*?\]", lambda _: f"faq:{faq_js}", block, flags=re.DOTALL)

    # 4. Inject AI specs into P block as aiSpecs array
    if enrichment.get("specs"):
        specs_js = json.dumps(enrichment["specs"])
        if "aiSpecs:" not in block:
            block = block.rstrip() + f"\n  aiSpecs:{specs_js},"
        else:
            block = re.sub(r"aiSpecs:\[.*?\]", lambda _: f"aiSpecs:{specs_js}", block, flags=re.DOTALL)

    # 5. Inject seo_title as meta title hint in P block
    if enrichment.get("seo_title"):
        seo = enrichment["seo_title"].replace("\\","\\\\").replace("'","\\'").replace("\n"," ")[:160]
        if "seoTitle:" not in block:
            block = block.rstrip() + f"\n  seoTitle:'{seo}',"

    # Rebuild P block
    content = content[:pm.start()] + pm.group(1) + block + pm.group(3) + content[pm.end():]

    # 6. Update SSR description paragraph
    if enrichment.get("description"):
        new_desc_html = html.escape(enrichment["description"])
        content = re.sub(
            r'(<p style="font-size:15px;color:#999;[^>]*">)[^<]*(<)',
            lambda m: m.group(1) + new_desc_html + m.group(2),
            content, count=1
        )

    # 7. Update <title> and <meta name="description"> with seo_title if available
    if enrichment.get("seo_title"):
        p_data = parse_p_block(pm.group(2))
        seo_t = html.escape(enrichment["seo_title"])
        brand = html.escape(p_data.get("brand",""))
        pno   = html.escape(p_data.get("partNo",""))
        new_title = f"{seo_t} | {brand} Part {pno} | Parts Trading Company"
        content = re.sub(r'<title>[^<]*</title>', f'<title>{new_title[:160]}</title>', content, count=1)

    # ── Build injection sections ──────────────────────────────────────────────

    sections = []

    # Specs table (additional AI specs beyond the basic ones already on page)
    if enrichment.get("specs"):
        specs_html = build_specs_table_html(enrichment["specs"])
        if specs_html:
            sections.append(f"""<div style="max-width:900px;margin:20px auto 0;padding:0 24px">
{specs_html}
</div>""")

    # Failure symptoms
    if enrichment.get("symptoms"):
        sym = html.escape(enrichment["symptoms"])
        sections.append(f"""<section style="background:#090909;padding:40px 24px;border-top:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:900px;margin:0 auto">
    <h2 style="font-family:'Barlow Condensed','Barlow',sans-serif;font-size:16px;font-weight:700;color:#F0ECE6;letter-spacing:.08em;text-transform:uppercase;margin:0 0 12px">Failure Symptoms</h2>
    <p style="font-size:14px;color:#888;line-height:1.8">{sym}</p>
  </div>
</section>""")

    # Install tip + service note side by side
    tip = html.escape(enrichment.get("install_tip",""))
    svc = html.escape(enrichment.get("service_note",""))
    if tip or svc:
        cards = ""
        if tip:
            cards += f"""<div style="flex:1;min-width:240px;background:#111;border:1px solid rgba(255,184,28,0.15);border-radius:10px;padding:20px 22px">
    <div style="font-size:20px;margin-bottom:10px">🔧</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#FFB81C;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">Installation Tip</div>
    <p style="font-size:13px;color:#999;line-height:1.7;margin:0">{tip}</p>
  </div>"""
        if svc:
            cards += f"""<div style="flex:1;min-width:240px;background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:20px 22px">
    <div style="font-size:20px;margin-bottom:10px">🔁</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#aaa;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px">Service Note</div>
    <p style="font-size:13px;color:#888;line-height:1.7;margin:0">{svc}</p>
  </div>"""
        sections.append(f"""<section style="background:#070707;padding:32px 24px;border-top:1px solid rgba(255,255,255,0.04)">
  <div style="max-width:900px;margin:0 auto;display:flex;gap:16px;flex-wrap:wrap">
    {cards}
  </div>
</section>""")

    if sections:
        inject = f"\n{V2_MARKER}\n" + "\n".join(sections)
        content = content.replace("</body>", inject + "\n</body>")

    filepath.write_text(content, encoding="utf-8")
    return True

# ── Main ──────────────────────────────────────────────────────────────────────

def collect_files(brands, limit=None):
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
    return files

def main():
    args = sys.argv[1:]
    target_brand = None
    limit = None
    apply_only = "--apply-only" in args

    for i, a in enumerate(args):
        if a == "--brand" and i+1 < len(args):
            target_brand = args[i+1]
        if a == "--limit" and i+1 < len(args):
            limit = int(args[i+1])

    brands = [target_brand] if target_brand else BRANDS
    files = collect_files(brands, limit)
    total = len(files)

    if not apply_only and not GEMINI_API_KEY:
        print("ERROR: Set GEMINI_API_KEY environment variable first.")
        print("  export GEMINI_API_KEY=your_key_here")
        print("  python3 phase2_gemini_enrich.py")
        sys.exit(1)

    print(f"Phase 2 Gemini Enrichment")
    print(f"  Files: {total} | API calls: ~{(total // BATCH_SIZE)+1} batches of {BATCH_SIZE}")
    print(f"  Cache: {len(_cache)} parts already enriched")
    print(f"  Mode: {'apply-only (no API calls)' if apply_only else 'enrich + apply'}\n")

    # Phase A: Enrich via Gemini (batch calls)
    if not apply_only:
        # Collect parts needing enrichment
        needs_enrichment = []
        for f in files:
            pm = P_RE.search(f.read_text(errors="ignore"))
            if not pm:
                continue
            p = parse_p_block(pm.group(2))
            if p.get("partNo") and not cache_get(p["partNo"]):
                needs_enrichment.append(p)

        print(f"  Parts to enrich via Gemini: {len(needs_enrichment)}")
        print(f"  Estimated time: {(len(needs_enrichment)//BATCH_SIZE * RATE_LIMIT_DELAY/60):.0f} minutes\n")

        for i in range(0, len(needs_enrichment), BATCH_SIZE):
            batch = needs_enrichment[i:i+BATCH_SIZE]
            batch_nos = [p["partNo"] for p in batch]
            print(f"  Batch {i//BATCH_SIZE + 1}: {', '.join(batch_nos[:3])}{'...' if len(batch)>3 else ''}", end=" ", flush=True)

            result = call_gemini(batch)
            hits = 0
            for p in batch:
                if p["partNo"] in result:
                    enrichment = result[p["partNo"]]
                    # Validate + filter model codes to prevent hallucinations
                    if "models" in enrichment and enrichment["models"]:
                        enrichment["models"] = validate_models(
                            p["brandSlug"], enrichment["models"], p["name"]
                        )
                    # Strip any lines with specific numbers from install_tip (hallucination risk)
                    if "install_tip" in enrichment:
                        tip = enrichment["install_tip"]
                        # Remove sentences containing Nm, psi, bar, mm clearance values
                        tip = re.sub(r'[^.]*\b\d+\s*(Nm|psi|bar|mm|in-lb|ft-lb|kPa)\b[^.]*\.', '', tip)
                        enrichment["install_tip"] = tip.strip() or enrichment["install_tip"]
                    cache_set(p["partNo"], enrichment)
                    hits += 1

            print(f"→ {hits}/{len(batch)} enriched")
            if i + BATCH_SIZE < len(needs_enrichment):
                time.sleep(RATE_LIMIT_DELAY)

    # Phase B: Apply enrichments to HTML
    print(f"\nApplying enrichments to HTML files…")
    applied = 0
    skipped = 0

    for i, f in enumerate(files):
        pm_match = P_RE.search(f.read_text(errors="ignore"))
        if not pm_match:
            continue
        p = parse_p_block(pm_match.group(2))
        if not p.get("partNo"):
            continue
        enrichment = cache_get(p["partNo"])
        if not enrichment:
            continue
        if apply_enrichment(f, enrichment):
            applied += 1
        else:
            skipped += 1

        if (i+1) % 2000 == 0:
            print(f"  {i+1}/{total} — {applied} applied")

    print(f"\nPhase 2 complete. {applied} pages enriched, {skipped} already done.")
    print(f"Cache now contains {len(_cache)} enriched parts.")

if __name__ == "__main__":
    main()
