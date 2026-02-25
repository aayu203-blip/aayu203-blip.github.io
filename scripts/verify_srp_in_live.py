
import json
import os
import re

BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
LIVE_DB_PATH = os.path.join(BASE_DIR, "aayu203-blip.github.io", "new_partDatabase.js")
SRP_DB_PATH = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete", "srp_scraped_data", "fmi_parts_transformed.json")
GOD_MODE_DB_PATH = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete", "god-mode", "data", "parts-database.json")

def load_js_db(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
        if match:
            json_str = match.group(1)
            # Fix trailing commas if any
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

def normalize(part_no):
    return str(part_no).lower().strip().replace(" ", "").replace("-", "")

def main():
    print("--- SRP Data Verification ---")
    
    # 1. Load Live DB
    live_db = load_js_db(LIVE_DB_PATH)
    live_parts = {normalize(p.get('Part Number', p.get('part_number', ''))) for p in live_db}
    print(f"Live DB Count: {len(live_db)}")
    
    # 2. Load SRP Data
    srp_db = load_json_db(SRP_DB_PATH)
    print(f"SRP Data Count: {len(srp_db)}")
    
    # 3. Load God Mode DB
    god_db = load_json_db(GOD_MODE_DB_PATH)
    god_parts = {normalize(p.get('Part Number', p.get('part_number', ''))) for p in god_db}
    print(f"God Mode DB Count: {len(god_db)}")

    # 4. Compare
    details = []
    missing_in_live = 0
    present_in_live = 0
    
    for item in srp_db:
        pn = normalize(item.get('part_number', ''))
        if pn in live_parts:
            present_in_live += 1
        else:
            missing_in_live += 1
            details.append(item.get('part_number'))

    print("\n--- RESULTS ---")
    print(f"SRP Parts Present in Live Site: {present_in_live}")
    print(f"SRP Parts MISSING from Live Site: {missing_in_live}")
    
    if missing_in_live > 0:
        print(f"Sample Missing Parts: {details[:5]}")
        
    # Check God Mode Overlap
    present_in_god = 0
    for item in srp_db:
        pn = normalize(item.get('part_number', ''))
        if pn in god_parts:
            present_in_god += 1
            
    print(f"\nSRP Parts Present in God Mode DB: {present_in_god}")

if __name__ == "__main__":
    main()
