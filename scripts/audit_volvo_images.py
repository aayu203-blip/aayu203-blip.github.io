import json

def audit_volvo_images():
    input_file = 'next-engine/data/parts-database.json'
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    tail = data[-2000:]
    volvo_parts = [p for p in tail if str(p.get('brand')).lower() == 'volvo']
    
    parts_with_images = 0
    total_images = 0
    
    print(f"\nChecking images for {len(volvo_parts)} new Volvo parts...")
    
    for p in volvo_parts:
        imgs = p.get('images', [])
        if imgs and len(imgs) > 0:
            parts_with_images += 1
            total_images += len(imgs)
            
    print(f"Parts with at least 1 image: {parts_with_images}")
    print(f"Total images found: {total_images}")
    
    if parts_with_images == 0:
        print("Conclusion: The new fast moving parts have NO images.")

if __name__ == "__main__":
    audit_volvo_images()
