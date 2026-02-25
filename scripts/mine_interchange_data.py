
import json
import os
import re

# Load the database
# The file is a JS file with `const partDatabase = [...]`, we need to extract the JSON part.
DB_PATH = os.path.join(os.path.dirname(__file__), "../new_partDatabase.js")

def load_database():
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract JSON array using regex
    match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        # Fix trailing commas if any (JS allows them, JSON doesn't)
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        return json.loads(json_str)
    return []

def analyze_interchange_data():
    db = load_database()
    print(f"Total Products in DB: {len(db)}")
    
    parts_with_alt = []
    parts_with_oem = []
    
    for part in db:
        # Check Alt Part Nos (1-7)
        alts = []
        for i in range(1, 8):
            key = f"Alt Part No {i}"
            if key in part and part[key] and part[key].strip():
                alts.append(part[key].strip())
        
        # Check OEM Part Nos
        oems = []
        if "OEM Part Nos" in part and part["OEM Part Nos"] and part["OEM Part Nos"].strip():
             # heuristic to split by comma or newline if needed, but looks like string in sample
             oems.append(part["OEM Part Nos"].strip())
             
        if alts:
            parts_with_alt.append({
                "Part No": part.get("Part No"),
                "Brand": part.get("Brand"),
                "Description": part.get("Cleaned Description"),
                "Alts": alts
            })
            
        if oems:
            parts_with_oem.append({
                "Part No": part.get("Part No"),
                "Brand": part.get("Brand"),
                "Oems": oems
            })
            
    print(f"Parts with Alt Numbers: {len(parts_with_alt)}")
    print(f"Parts with OEM Numbers: {len(parts_with_oem)}")
    
    # Overlap?
    combined = len(parts_with_alt) + len(parts_with_oem) 
    # (Simple addition for now, just need rough scale)
    
    print("\n--- SAMPLE INTERCHANGE OPPORTUNITIES ---")
    for p in parts_with_alt[:5]:
        print(f"[{p['Brand']}] {p['Part No']} ({p['Description']}) -> Alts: {', '.join(p['Alts'])}")

    print("\n--- SAMPLE OEM OPPORTUNITIES ---")
    for p in parts_with_oem[:5]:
        print(f"[{p['Brand']}] {p['Part No']} -> OEM: {p['Oems'][0]}")

if __name__ == "__main__":
    analyze_interchange_data()
