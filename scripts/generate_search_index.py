
import json
import os
import re
import glob

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
LIVE_DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")
PRODUCT_PATHS_FILE = os.path.join(BASE_DIR, "assets", "js", "product-paths.js")
DIAGNOSTICS_DIR = os.path.join(BASE_DIR, "pages", "diagnostics")
INTERCEPT_DIR = os.path.join(BASE_DIR, "pages", "intercept")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "parts-index.json")

def load_js_variable(path, var_name):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex to find variable definition
        pattern = f"{var_name}\s*=\s*({{.*}}|\\[.*\\])"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            json_str = match.group(1)
            # Cleanup loose JS to valid JSON
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r',\s*}', '}', json_str)
            # Quote unquoted keys if necessary (simple heuristic)
            # valid JSON requires quoted keys, JS objects don't always have them.
            # Assuming the source files use quoted keys based on previous views.
            return json.loads(json_str)
    except Exception as e:
        print(f"Error loading {var_name} from {path}: {e}")
    return None

def normalize_slug(text):
    return text.lower().strip().replace(" ", "-").replace("/", "-")

def main():
    print("--- Generating Search Index ---")
    
    search_index = []
    
    # 1. Load Legacy Paths Map
    product_paths = load_js_variable(PRODUCT_PATHS_FILE, "window.productPathIndex") or {}
    print(f"Loaded {len(product_paths)} legacy product paths.")

    # 2. Process Part Database (Legacy + God Mode)
    db = load_js_variable(LIVE_DB_PATH, "const partDatabase") or []
    print(f"Loaded {len(db)} parts from database.")
    
    count_parts = 0
    for part in db:
        sku = part.get("Part No", "").strip()
        brand = part.get("Brand", "Generic").title()
        desc = part.get("Cleaned Description", "").title()
        category = part.get("Category", "Uncategorized")
        origin = part.get("_origin", "legacy_original")
        
        if not sku: 
            continue
            
        # Determine URL
        url = ""
        # Check Legacy Map first
        if sku in product_paths:
            url = product_paths[sku]
        # Fallback: Check for Intercept Page
        else:
            slug = f"replacement-for-{brand.lower()}-{normalize_slug(sku)}.html"
            intercept_path = os.path.join(INTERCEPT_DIR, slug)
            
            if os.path.exists(intercept_path):
                # Valid Intercept Page
                url = f"/pages/intercept/{slug}"
            else:
                # GHOST PART: Exists in DB but no page generated.
                # Point to WhatsApp/Contact with pre-fill
                url = f"https://wa.me/919821037990?text=I%20need%20price%20for%20{brand}%20{sku}"
                # Optional: Don't index ghosts? Or text them?
                # Let's index them so people know we HAVE it, but direct to contact.
                
        entry = {
            "sku": sku,
            "title": f"{brand} {desc} {sku}",
            "category": f"{brand} · {category}",
            "url": url
        }
        search_index.append(entry)
        count_parts += 1

    print(f"Indexed {count_parts} Products.")

    # 3. Process Diagnostic Pages
    print("Indexing Diagnostic Pages...")
    diag_files = glob.glob(os.path.join(DIAGNOSTICS_DIR, "*.html"))
    count_diag = 0
    
    for fpath in diag_files:
        filename = os.path.basename(fpath)
        # Filename format: troubleshoot-brand-partno.html
        parts = filename.replace("troubleshoot-", "").replace(".html", "").split("-")
        
        # Heuristic extraction
        if len(parts) >= 2:
            brand = parts[0].title()
            part_no = parts[-1].upper() # Assume last part is SKU
            
            entry = {
                "sku": f"FIX-{part_no}", # Artificial SKU for search
                "title": f"Troubleshoot {brand} {part_no} - Common Problems & Fixes",
                "category": "Diagnostics & Repair",
                "url": f"/pages/diagnostics/{filename}"
            }
            search_index.append(entry)
            count_diag += 1
            
    print(f"Indexed {count_diag} Diagnostic Pages.")
    
    # 4. Write Output
    full_index_size = len(search_index)
    print(f"Total Search Index Size: {full_index_size} items.")
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(search_index, f, indent=2)
        
    print(f"Successfully generated {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
