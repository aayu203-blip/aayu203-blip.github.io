import json
import re

def analyze_slugs():
    with open('god-mode/data/parts-database.json', 'r') as f:
        data = json.load(f)
        
    targets = ['caterpillar', 'komatsu', 'volvo', 'scania']
    slugs = set()
    total_target_parts = 0
    
    for part in data:
        brand = part.get('brand', 'Unknown').lower().strip()
        if brand == 'cat': brand = 'caterpillar'
        if brand in targets:
            part_no = part.get('part_number', 'Unknown')
            slug = f"replacement-for-{brand}-{re.sub(r'[^a-z0-9]+', '-', str(part_no).lower()).strip('-')}.html"
            slugs.add(slug)
            total_target_parts += 1
            
    print(f"Total parts for target brands: {total_target_parts}")
    print(f"Unique slugs (files that would be created): {len(slugs)}")

if __name__ == '__main__':
    analyze_slugs()
