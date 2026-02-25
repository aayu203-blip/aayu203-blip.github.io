import json
import random

def inspect_tail_entries():
    input_file = 'next-engine/data/parts-database.json'
    
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    total = len(data)
    print(f"Total parts: {total}")
    
    # Asserting the user added ~900 parts recently, we look at the last 1000
    tail_count = 1000
    if total < tail_count:
        tail_count = total
        
    recent_batch = data[-tail_count:]
    print(f"Inspecting last {tail_count} parts...")
    
    # Sample 5 from this batch
    sample = random.sample(recent_batch, 5)
    
    print("\nSAMPLE RECENT PARTS:")
    for p in sample:
        print(f"\n--- ID: {p.get('id')} ---")
        print(f"Brand: {p.get('brand')}")
        print(f"Part Number: {p.get('part_number')}")
        print(f"Name: {p.get('product_name')}")
        print(f"URL: /en/p/{p.get('slug')}")
        print(f"Description Length: {len(p.get('final_html_description', '') or p.get('description', '') or '')}")
        print(f"Specs: {len(p.get('technical_specs', {}))}")
        print(f"Images: {len(p.get('images', []))}")

    # Also check if they are "fast moving" by keyword search in the whole DB if the tail strategy is ambiguous
    # The user said "we recently added 900ish fast moving parts"
    # Maybe there is a specific 'fast-moving' tag?
    
if __name__ == "__main__":
    inspect_tail_entries()
