
import json
from collections import Counter

def count_brands():
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

    brands = Counter()
    for part in data:
        # Normalize brand
        b = part.get('brand', 'Unknown')
        if b:
            brands[b.title()] += 1
            
    print(f"--- 📊 INVENTORY BREAKDOWN (Total: {len(data)}) ---")
    
    # Specific counts for user
    volvo = brands.get('Volvo', 0)
    scania = brands.get('Scania', 0)
    cat = brands.get('Caterpillar', 0) + brands.get('Cat', 0)
    komatsu = brands.get('Komatsu', 0)
    
    print(f"🔹 Volvo: {volvo}")
    print(f"🔹 Scania: {scania}")
    print(f"🔹 Caterpillar: {cat}")
    print(f"🔹 Komatsu: {komatsu}")
    
    print("-" * 30)
    print("ALL BRANDS:")
    for b, count in brands.most_common():
        print(f"{b}: {count}")

if __name__ == "__main__":
    count_brands()
