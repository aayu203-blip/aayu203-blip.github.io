import json
import random

def inspect_recent_entries():
    input_file = 'next-engine/data/parts-database.json'
    
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    print(f"Total parts: {len(data)}")
    
    # Filter parts that have rich data (likely the new ones)
    new_parts = []
    for p in data:
        score = 0
        if p.get('technical_specs'): score += 1
        if p.get('images'): score += 1
        if p.get('oem_cross_references'): score += 1
        
        # Arbitrary threshold to find "high quality" new parts
        if score >= 2:
            new_parts.append(p)
            
    print(f"Candidates with rich data: {len(new_parts)}")
    
    if not new_parts:
        print("No rich parts found. Dumping first 5 raw entries:")
        print(json.dumps(data[:5], indent=2))
        return

    # Sample 5
    sample = random.sample(new_parts, min(5, len(new_parts)))
    
    print("\nSAMPLE PARTS:")
    for p in sample:
        print(f"\n--- {p.get('brand')} {p.get('part_number')} ---")
        print(f"Name: {p.get('product_name')}")
        print(f"URL: /en/p/{p.get('slug')}")
        print(f"Specs: {len(p.get('technical_specs', {}))} items")
        print(f"Images: {len(p.get('images', []))}")
        print(f"Cross Refs: {len(p.get('oem_cross_references', []))}")

if __name__ == "__main__":
    inspect_recent_entries()
