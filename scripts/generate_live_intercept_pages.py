
import json
import os
import re

# --- CONFIGURATION (UPDATED FOR LIVE MIGRATION) ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPTS_DIR = os.path.join(BASE_DIR, "scripts")

# Live Repo Target
LIVE_REPO_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
OUTPUT_DIR = os.path.join(LIVE_REPO_DIR, "pages", "intercept")

# Input Sources
DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")
TEMPLATE_PATH = os.path.join(BASE_DIR, "pages", "intercept", "replacement-for-kramp-731136001.html")
LIVE_HEADER_PATH = os.path.join(SCRIPTS_DIR, "live_header.html")
LIVE_FOOTER_PATH = os.path.join(SCRIPTS_DIR, "live_footer.html")

# Limit for safety
LIMIT = 2000

def load_database():
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"JSON Error: {e}")
            return []
    return []

def load_live_templates():
    with open(LIVE_HEADER_PATH, 'r', encoding='utf-8') as f:
        header = f.read()
    with open(LIVE_FOOTER_PATH, 'r', encoding='utf-8') as f:
        footer = f.read()
    return header, footer

def extract_body_content(template_path):
    with open(template_path, 'r', encoding='utf-8') as f:
        full_html = f.read()
    
    # We want everything between <!-- Hero Section --> and <!-- LIVE FOOTER -->
    # Or more robustly: 
    # Start: Post-Nav. "<!-- Hero Section -->" is a good anchor.
    # End: Before "<footer" or "<!-- LIVE FOOTER"
    
    start_marker = "<!-- Hero Section -->"
    end_markers = ["<!-- LIVE FOOTER", "<footer"]
    
    start_idx = full_html.find(start_marker)
    if start_idx == -1:
        # Fallback: look for closing nav
        start_idx = full_html.find("</nav>") + 6
    
    end_idx = -1
    for marker in end_markers:
        idx = full_html.find(marker)
        if idx != -1:
            end_idx = idx
            break
            
    if start_idx == -1 or end_idx == -1:
        print("CRITICAL ERROR: Could not parse content boundaries in template.")
        return "<!-- CONTENT EXTRACTION FAILED -->"
        
    return full_html[start_idx:end_idx]

def clean_filename(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

def determine_brand(alt_num_raw):
    # Heuristics
    lower_raw = alt_num_raw.lower()
    if "dt part" in lower_raw:
        return "DT Spare Parts", alt_num_raw.split("-")[-1].strip()
    if "bosch" in lower_raw:
        return "Bosch", alt_num_raw.split("-")[-1].strip()
    if "wabco" in lower_raw:
        return "WABCO", alt_num_raw.split("-")[-1].strip()
    if "mann" in lower_raw:
        return "Mann Filter", alt_num_raw.split("-")[-1].strip()
    
    return "OEM", alt_num_raw.strip()

def generate_pages():
    print(f"--- Starting Migration to Live Repo: {LIVE_REPO_DIR} ---")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created output directory: {OUTPUT_DIR}")
        
    db = load_database()
    live_header, live_footer = load_live_templates()
    body_content_template = extract_body_content(TEMPLATE_PATH)
    
    count = 0
    
    for part in db:
        if count >= LIMIT:
            break
            
        targets = []
        
        # 1. Alt Part Nos
        for i in range(1, 8):
            key = f"Alt Part No {i}"
            if key in part and part[key] and part[key].strip():
                raw = part[key].strip()
                brand, num = determine_brand(raw)
                targets.append({"brand": brand, "num": num, "type": "Alt"})
                
        # 2. OEM Part Nos
        if "OEM Part Nos" in part and part["OEM Part Nos"]:
             raws = part["OEM Part Nos"].split(",")
             for raw in raws:
                 if raw.strip():
                     brand, num = determine_brand(raw)
                     targets.append({"brand": brand, "num": num, "type": "OEM"})
    
        for target in targets:
            if count >= LIMIT: 
                break
                
            brand_slug = clean_filename(target['brand'])
            num_slug = clean_filename(target['num'])
            
            if len(num_slug) < 3: continue
            
            filename = f"replacement-for-{brand_slug}-{num_slug}.html"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            # --- CONTENT INJECTION ---
            # 1. Prepare Content
            content = body_content_template
            
            # 2. Replacements
            # Replace Branding
            content = content.replace("Kramp", target['brand'])
            content = content.replace("731136001", target['num'])
            
            # Replace SEO details
            real_name = part.get("Cleaned Description", "Spare Part").title()
            real_cat = part.get("Category", "Heavy Machinery Parts")
            
            content = content.replace("Hydraulic Seal Kit", real_name)
            content = content.replace("Hydraulic seal kit", real_name.lower())
            
            # Fix specific template artifacts
            content = content.replace("Viton / NBR", real_cat)
            
            # --- ASSEMBLE FULL PAGE ---
            # Header needs title injection? 
            # The header file has a fixed title tag: <title>...</title>.
            # We should essentially REPLACE the title tag in the header string with a dynamic one.
            
            page_title = f"Replacement for {target['brand']} {target['num']} | {real_name} | Parts Trading Company"
            page_desc = f"Looking for {target['brand']} {target['num']} {real_name}? We have the OEM equivalent in stock. Same spec, better price. Shipping worldwide."
            
            # Regex Replace Title
            current_header = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', live_header)
            # Regex Replace Description
            current_header = re.sub(r'<meta content=".*?" name="description"/>', f'<meta content="{page_desc}" name="description"/>', current_header)
            
            # Relative Path Fixes
            # The live header uses "assets/...", but inside "pages/intercept/", we need "../../assets/..."
            # Wait, standard "assets/" works if <base> is set, or if we adjust paths.
            # The live site uses relative paths "assets/css/styles.css".
            # From "pages/intercept/", that path is invalid. It needs to be "../../assets/css/styles.css".
            
            current_header = current_header.replace('href="assets/', 'href="../../assets/')
            current_header = current_header.replace('src="assets/', 'src="../../assets/')
            current_header = current_header.replace('href="/', 'href="../../') # Fix root abs paths if any, though likely just assets
            
            # Also fix images in header content (logo)
            current_header = current_header.replace('src="/assets/', 'src="../../assets/')
            
            # Fix footer assets too
            current_footer = live_footer.replace('src="assets/', 'src="../../assets/')
            
            final_html = current_header + "\n" + content + "\n" + current_footer
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(final_html)
                
            count += 1
            if count % 100 == 0:
                print(f"Generated {count} pages...")
                
    print(f"--- Completed. Generated {count} pages in {OUTPUT_DIR} ---")

if __name__ == "__main__":
    generate_pages()
