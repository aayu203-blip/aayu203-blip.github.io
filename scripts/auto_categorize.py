
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
LIVE_DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")

# --- CATEGORY RULES (Priority Order) ---
# Format: "New Category": ["keyword1", "keyword2", ...]
RULES = {
    "Electronics & Electrical": [
        "sensor", "switch", "relay", "alternator", "starter", "battery", "fuse", "harness", "wire", 
        "lamp", "light", "bulb", "controller", "ecu", "module", "solenoid", "gauge", "display"
    ],
    "Hydraulic Systems": [
        "hydraulic", "pump", "cylinder", "valve", "hose", "fitting", "seal kit", "packing", 
        "piston rod", "barrel", "gland"
    ],
    "Engine Components": [
        "piston", "liner", "ring", "crankshaft", "camshaft", "connecting rod", "bearing", 
        "gasket", "seal", "turbo", "injector", "nozzle", "start valve", "exhaust", "manifold",
        "flywheel", "head", "block", "damper", "pulley", "belt", "tensioner"
    ],
    "Filtration & Maintenance": [
        "filter", "element", "strainer", "separator", "cleaner", "cartridge", "housing"
    ],
    "Transmission & Drivetrain": [
        "gear", "transmission", "clutch", "disc", "plate", "shaft", "axle", "differential", 
        "joint", "u-joint", "yoke", "spider", "converter", "propeller"
    ],
    "Cooling System": [
        "radiator", "cooler", "fan", "water pump", "thermostat", "hose", "intercooler"
    ],
    "Brake & Steering": [
        "brake", "pad", "shoe", "drum", "caliper", "steering", "tie rod", "drag link", 
        "knuckle", "king pin", "slack adjuster", "chamber"
    ],
    "Ground Engaging Tools (GET)": [
        "tooth", "teeth", "adapter", "edge", "cutting edge", "bit", "blade", "bucket", "tip", "point"
    ],
    "Undercarriage": [
        "track", "shoe", "link", "roller", "idler", "sprocket", "segment", "chain", "grouser"
    ],
    "Fasteners & Hardware": [
        "bolt", "nut", "washer", "screw", "pin", "clip", "clamp", "spring", "rivet", "stud"
    ]
}

def load_js_db(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
        if match:
            json_str = match.group(1)
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r',\s*}', '}', json_str)
            return json.loads(json_str)
    except Exception as e:
        print(f"Error loading JS DB: {e}")
    return []

def main():
    print("--- Auto-Categorization (AI Rules) ---")
    db = load_js_db(LIVE_DB_PATH)
    print(f"Total Parts: {len(db)}")
    
    updated_count = 0
    stats = {k: 0 for k in RULES.keys()}
    
    for part in db:
        # Check if needs categorization
        current_cat = part.get("Category", "").strip()
        is_generic = not current_cat or current_cat.lower() in ["general accessories", "uncategorized", "general", "accessories", "other"]
        
        if is_generic:
            desc = part.get("Cleaned Description", "").lower()
            if not desc:
                continue
                
            # Apply Rules
            matched = False
            for cat, keywords in RULES.items():
                for kw in keywords:
                    # Word boundary check for better accuracy
                    if re.search(r'\b' + re.escape(kw) + r'\b', desc): 
                        part["Category"] = cat
                        stats[cat] += 1
                        updated_count += 1
                        matched = True
                        break
                if matched:
                    break
                    
    print(f"\n--- RESULTS ---")
    print(f"Total Items Updated: {updated_count}")
    print("\nBreakdown:")
    for cat, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
        if count > 0:
            print(f"{cat}: {count}")
            
    # Write Output
    json_output = json.dumps(db, indent=2)
    js_content = f"""// Parts Trading Company Database
// Auto-Categorized on: {os.popen('date').read().strip()}
// Total Products: {len(db)}

const partDatabase = {json_output};
"""
    
    with open(LIVE_DB_PATH, 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print(f"\nWritten updated database to {LIVE_DB_PATH}")

if __name__ == "__main__":
    main()
