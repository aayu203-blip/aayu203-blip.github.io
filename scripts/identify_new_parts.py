"""
Identify new parts from SRP discovery that are not in our database
"""

import json
import os

def main():
    # 1. Load existing inventory
    with open('god-mode/data/parts-database.json', 'r') as f:
        existing = json.load(f)

    # Normalize existing parts (lowercase, strip whitespace)
    # We only care about Volvo parts for now, but technically we could expand to others
    existing_volvo = set()
    for p in existing:
        if p.get('brand') == 'Volvo':
            pn = str(p.get('part_number', '')).strip().upper()
            existing_volvo.add(pn)
            
    print(f"Loaded {len(existing_volvo)} existing Volvo parts from database")

    # 2. Load discovered parts
    if not os.path.exists('srp_discovered_all_parts.txt'):
        print("srp_discovered_all_parts.txt not found. Run the crawler first.")
        return

    discovered = set()
    with open('srp_discovered_all_parts.txt', 'r') as f:
        for line in f:
            if line.strip():
                part_num = line.strip().upper()
                discovered.add(part_num)
                
    print(f"Loaded {len(discovered)} discovered parts from SRP")

    # 3. Find new parts
    new_parts = discovered - existing_volvo
    
    # 4. Save new parts
    output_file = 'srp_new_parts_to_scrape.txt'
    with open(output_file, 'w') as f:
        for part in sorted(new_parts):
            f.write(f"{part}\n")

    print("\n" + "="*40)
    print("IDENTIFICATION SUMMARY")
    print("="*40)
    print(f"Existing in DB: {len(existing_volvo)}")
    print(f"Found on SRP:   {len(discovered)}")
    print(f"Overlap:        {len(discovered & existing_volvo)}")
    print(f"New to Scrape:  {len(new_parts)}")
    print("="*40)
    print(f"Saved list of {len(new_parts)} new parts to {output_file}")
    
    # Calculate value
    if len(existing_volvo) > 0:
        growth = (len(new_parts) / len(existing_volvo)) * 100
        print(f"Potential inventory growth: +{growth:.1f}%")

if __name__ == "__main__":
    main()
