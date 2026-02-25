import json

def check_category_field():
    input_file = 'next-engine/data/parts-database.json'
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    recent_batch = data[-1000:]
    
    missing_category = 0
    empty_category = 0
    
    print("\nChecking Category Field in last 1000 parts:")
    for p in recent_batch[:20]: # Check first 20 of the batch
        cat = p.get('category')
        print(f"Part {p.get('part_number')}: Category='{cat}'")
        
    for p in recent_batch:
        cat = p.get('category')
        if cat is None:
            missing_category += 1
        elif str(cat).strip() == "":
            empty_category += 1
            
    print(f"\nSummary for last 1000 parts:")
    print(f"Missing 'category' key: {missing_category}")
    print(f"Empty 'category' value: {empty_category}")

if __name__ == "__main__":
    check_category_field()
