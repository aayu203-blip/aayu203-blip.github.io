
import json
import random
import re

def audit_samples():
    try:
        with open("god-mode/data/parts-database.json", "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        try:
            with open("data/parts-database.json", "r") as f:
                data = json.load(f)
        except:
            print("Could not find parts-database.json")
            return

    # Pick 100 random
    samples = random.sample(data, 100)
    
    print(f"--- 🎲 AUDITING 100 RANDOM PARTS (Total DB: {len(data)}) ---\n")
    
    issues_found = 0
    low_data_count = 0
    
    for i, part in enumerate(samples):
        # NORMALIZE KEYS
        brand = part.get('brand')
        part_number = part.get('partNumber') or part.get('part_number')
        name = part.get('name') or part.get('product_name')
        
        # Reduced logging for speed - only errors or summary
        # print(f"[{i+1}] {brand} {part_number}")
        
        # 1. Name Check
        if not name:
            print(f"[{i+1}] ❌ MISSING NAME: {part_number}")
            issues_found += 1
        elif "genuine" in name.lower() or "original" in name.lower():
             print(f"[{i+1}] ⚠️  COMPLIANCE WARNING: Name contains restricted term '{name}'")
             issues_found += 1

        # 2. Specs Check
        specs = part.get('technical_specs', {})
        if not specs:
             low_data_count += 1

        # 3. Description Check
        desc = part.get('description')
        if desc and ("genuine" in desc.lower() or "original" in desc.lower()):
            print(f"[{i+1}] ❌ COMPLIANCE FAIL: Description has restricted terms.")
            issues_found += 1
        
        # 4. Critical Data Check
        if not brand or not part_number:
             print(f"[{i+1}] ❌ CRITICAL: Missing Brand or PartNumber")
             issues_found += 1

    print("-" * 40)
    print(f"Audit Complete.")
    print(f"Total Audited: 100")
    print(f"Critical Issues: {issues_found}")
    print(f"Low Data Density (No Specs): {low_data_count} ({low_data_count}%)")
    if issues_found == 0:
        print("✅ PASSED: No critical errors found.")
    else:
        print("❌ FAILED: Critical errors detected.")

if __name__ == "__main__":
    audit_samples()
