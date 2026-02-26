import json

data_files = [
    'god-mode/data/parts-database.json',
    'god-mode/data/enriched_product_data.json'
]

brands_counts = {}

for file in data_files:
    print(f"Scanning {file}...")
    try:
        with open(file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                for item in data:
                    brand = item.get('brand', 'Unknown').lower().strip()
                    if brand == 'cat': brand = 'caterpillar'
                    brands_counts[brand] = brands_counts.get(brand, 0) + 1
            else:
                print(f"File {file} is not a JSON list.")
    except Exception as e:
        print(f"Error scanning {file}: {e}")

try:
    with open('god-mode/data/full_dataset.jsonl', 'r', encoding='utf-8') as f:
        print("Scanning god-mode/data/full_dataset.jsonl...")
        for line in f:
            if line.strip():
                item = json.loads(line)
                brand = item.get('brand', 'Unknown').lower().strip()
                if brand == 'cat': brand = 'caterpillar'
                brands_counts[brand] = brands_counts.get(brand, 0) + 1
except Exception as e:
    print(f"Error scanning full_dataset.jsonl: {e}")

sorted_brands = dict(sorted(brands_counts.items(), key=lambda item: item[1], reverse=True))

print("\n--- BRAND DISTRIBUTION ACROSS ALL DATASETS ---")
for b, count in sorted_brands.items():
    print(f"  {b.title()}: {count} parts")
