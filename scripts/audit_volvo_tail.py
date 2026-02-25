import json

def audit_volvo_tail():
    input_file = 'next-engine/data/parts-database.json'
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    # Get last 2000 items
    tail = data[-2000:]
    
    volvo_parts = [p for p in tail if str(p.get('brand')).lower() == 'volvo']
    
    print(f"Total entries in tail: {len(tail)}")
    print(f"Volvo parts in tail: {len(volvo_parts)}")
    
    if not volvo_parts:
        print("No Volvo parts found in the last 2000 entries.")
        return

    missing_cat = 0
    empty_cat = 0
    
    print("\nSample Volvo Parts (Last 10):")
    for p in volvo_parts[-10:]:
        cat = p.get('category', '')
        print(f"ID: {p.get('id')} | PN: {p.get('part_number')} | Cat: '{cat}'")
        
        if cat is None: missing_cat += 1
        elif str(cat).strip() == "": empty_cat += 1

    # Check overall stats for these Volvo parts
    total_missing = sum(1 for p in volvo_parts if p.get('category') is None)
    total_empty = sum(1 for p in volvo_parts if str(p.get('category', '')).strip() == "")
    
    print(f"\nStats for {len(volvo_parts)} Volvo parts in tail:")
    print(f"Missing Category Key: {total_missing}")
    print(f"Empty Category Value: {total_empty}")
    
    if total_empty > 0:
        print("\n⚠️ ALERT: Recent Volvo parts have missing categories.")
        print("This will cause the 'Designed specifically for the  category' text issue.")

if __name__ == "__main__":
    audit_volvo_tail()
