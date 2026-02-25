import json

def inspect_raw_volvo():
    input_file = 'next-engine/data/parts-database.json'
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    tail = data[-2000:]
    volvo_parts = [p for p in tail if str(p.get('brand')).lower() == 'volvo']
    
    print(f"Inspecting first 3 Volvo parts from the export list:\n")
    
    for p in volvo_parts[:3]:
        print(json.dumps(p, indent=2))
        print("-" * 40)

if __name__ == "__main__":
    inspect_raw_volvo()
