import json

def analyze_db():
    with open('god-mode/data/parts-database.json', 'r') as f:
        data = json.load(f)
        
    brands = {}
    for part in data:
        brand = part.get('brand', 'Unknown').lower().strip()
        brands[brand] = brands.get(brand, 0) + 1
        
    sorted_brands = dict(sorted(brands.items(), key=lambda item: item[1], reverse=True))
    print(f"Total parts: {len(data)}")
    print("Brand distribution:")
    for b, count in list(sorted_brands.items())[:20]:
        print(f"  {b}: {count}")

if __name__ == '__main__':
    analyze_db()
