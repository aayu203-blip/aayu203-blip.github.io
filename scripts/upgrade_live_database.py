
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
LIVE_DB_PATH = os.path.join(BASE_DIR, "aayu203-blip.github.io", "new_partDatabase.js")
GOD_MODE_DB_PATH = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete", "god-mode", "data", "parts-database.json")

def load_js_db(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
        if match:
            json_str = match.group(1)
            # Fix trailing commas
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r',\s*}', '}', json_str)
            return json.loads(json_str)
    except Exception as e:
        print(f"Error loading JS DB: {e}")
    return []

def load_json_db(path):
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading JSON DB: {e}")
        return []

def normalize(text):
    return str(text).lower().strip().replace(" ", "").replace("-", "")

def transform_to_legacy(god_part):
    """
    Transform God Mode schema to Legacy schema.
    """
    # Infer Model/Application from Technical Specs if missing
    app = god_part.get("application", "")
    if (not app or app == "-") and "technical_specs" in god_part:
        specs = god_part["technical_specs"]
        candidates = [
            specs.get("Engine"),
            specs.get("Compatible Models"),
            specs.get("Model"),
            specs.get("Fits"),
            specs.get("Application")
        ]
        for c in candidates:
            if c and isinstance(c, str):
                app = c.strip()
                break

    return {
        "Part No": god_part.get("part_number", ""),
        "Cleaned Description": god_part.get("product_name", god_part.get("description", "")),
        "Application": app if app else "Generic",
        "Alt Part No 1": "",
        "Brand": god_part.get("brand", "").title(),
        "Category": god_part.get("category", "General"),
        "OEM Part Nos": "",
        "Measurement (MXX)": "",
        "_slug": god_part.get("slug", ""), # Hidden field for generation
        "_origin": "god_mode_expansion"    # Invisible indication
    }

def main():
    print("--- Upgrading Live Database ---")
    
    # 1. Load Data
    live_data = load_js_db(LIVE_DB_PATH)
    god_data = load_json_db(GOD_MODE_DB_PATH)
    
    print(f"Current Live Count: {len(live_data)}")
    print(f"God Mode Source Count: {len(god_data)}")
    
    # 2. Index Existing Parts (Legacy)
    existing_map = {}
    final_db = []
    
    for item in live_data:
        # Tag legacy items
        item["_origin"] = "legacy_original"
        final_db.append(item)
        
        # Index for check
        pn = normalize(item.get("Part No", ""))
        if pn:
            existing_map[pn] = True
            
    # 3. Merge New Data
    added_count = 0
    skipped_count = 0
    
    for item in god_data:
        pn = normalize(item.get("part_number", ""))
        
        if pn in existing_map:
            skipped_count += 1
            continue
            
        # Transform and Add
        new_item = transform_to_legacy(item)
        final_db.append(new_item)
        added_count += 1
        
    print(f"\n--- Merge Complete ---")
    print(f"Legacy Items Kept: {len(live_data)}")
    print(f"New Items Added: {added_count}")
    print(f"Duplicates Skipped: {skipped_count}")
    print(f"Total Database Size: {len(final_db)}")
    
    # 4. Write Output
    # We write back to the JS format
    json_output = json.dumps(final_db, indent=2)
    js_content = f"""// Parts Trading Company Database
// Upgraded on: {os.popen('date').read().strip()}
// Total Products: {len(final_db)}
// Origin: Legacy merged with God Mode Expansion

const partDatabase = {json_output};
"""
    
    with open(LIVE_DB_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"Successfully wrote upgraded database to {LIVE_DB_PATH}")

if __name__ == "__main__":
    main()
