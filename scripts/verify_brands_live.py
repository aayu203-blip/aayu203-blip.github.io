import json

def check_brands():
    input_file = 'god-mode/data/parts-database.json'
    try:
        with open(input_file, 'r') as f:
            data = json.load(f)
            
        brands = set()
        for p in data:
            b = p.get('brand', 'Unknown')
            brands.add(b)
            
        print(f"Total Parts: {len(data)}")
        print("Unique Brands Found:")
        for b in sorted(brands):
            print(f"- {b}")
            
        if "Spare Power" in brands or "SparePower" in brands:
            print("\n🚨 ALERT: Spare Power IS in the database!")
        else:
            print("\n✅ Clean: Spare Power is NOT in the database.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_brands()
