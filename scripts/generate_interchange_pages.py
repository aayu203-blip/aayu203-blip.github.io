
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(BASE_DIR, "pages", "intercept")
DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")
TEMPLATE_PATH = os.path.join(PAGES_DIR, "replacement-for-kramp-731136001.html")

# Output Limit (Safety Break for Pilot)
LIMIT = 5000 

def load_database():
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        return json.loads(json_str)
    return []

def load_template():
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        return f.read()

def clean_filename(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

def determine_brand(alt_num_raw):
    # Heuristics for Brand detection from raw strings like "DT Part No - 1.18219"
    if "dt part" in alt_num_raw.lower():
        return "DT Spare Parts", alt_num_raw.split("-")[-1].strip()
    if "bosch" in alt_num_raw.lower():
        return "Bosch", alt_num_raw.split("-")[-1].strip()
    
    # Default
    return "OEM", alt_num_raw.strip()

def generate_pages():
    print("--- Starting Mass Generation of Intercept Pages ---")
    db = load_database()
    template = load_template()
    
    if not os.path.exists(PAGES_DIR):
        os.makedirs(PAGES_DIR)
        
    count = 0
    generated_urls = []
    
    for part in db:
        if count >= LIMIT:
            break
            
        # Collect all viable targets for this part
        targets = []
        
        # Check Alt Part Nos (1-7)
        for i in range(1, 8):
            key = f"Alt Part No {i}"
            if key in part and part[key] and part[key].strip():
                raw = part[key].strip()
                brand, num = determine_brand(raw)
                targets.append({"brand": brand, "num": num, "type": "Alt"})

        # Check OEM Part Nos
        if "OEM Part Nos" in part and part["OEM Part Nos"] and part["OEM Part Nos"].strip():
             raws = part["OEM Part Nos"].split(",")
             for raw in raws:
                 brand, num = determine_brand(raw)
                 targets.append({"brand": brand, "num": num, "type": "OEM"})
        
        # Generate a page for each target
        for target in targets:
            if count >= LIMIT:
                break
                
            brand_slug = clean_filename(target['brand'])
            num_slug = clean_filename(target['num'])
            
            # Skip if number is too short (likely junk data)
            if len(num_slug) < 4:
                continue
                
            filename = f"replacement-for-{brand_slug}-{num_slug}.html"
            filepath = os.path.join(PAGES_DIR, filename)
            
            # Skip if exists (don't overwrite manual prototypes)
            # if os.path.exists(filepath):
            #    # print(f"Skipping existing: {filename}")
            #    continue
                
            # --- CONTENT INJECTION ---
            content = template
            
            # 1. Title & Meta
            # Replace "Kramp" -> Target Brand
            # Replace "731136001" -> Target Number
            
            # We do a rigorous replace of the Prototype values
            # Prototype: Kramp 731136001
            
            # Handle Brand Name replacments
            content = content.replace("Kramp", target['brand'])
            content = content.replace("731136001", target['num'])
            
            # Revert "Kramp" if it was part of specific text we want to keep? 
            # No, the template is specific to Kramp, so replacing Kramp with "DT Spare Parts" is correct.
            
            # Part Name / Desc
            real_name = part.get("Cleaned Description", "Spare Part").title()
            real_cat = part.get("Category", "Heavy Machinery Parts")
            
            content = content.replace("Hydraulic Seal Kit", real_name)
            content = content.replace("Hydraulic seal kit", real_name.lower())
            
            # Tech Specs (Fallback)
            content = content.replace("Viton / NBR", real_cat) 
            content = content.replace("Viton / NBR (High Temp)", real_cat)
            
            # Fix "Danfoss" reference in template
            content = content.replace("/ Danfoss", "") 
            
            # Contextual Sentences
            # "This kit is engineered for..." -> "This part is engineered for..."
            content = content.replace("This kit is", "This component is")
            
            # Save
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"Generated: {filename}")
            generated_urls.append(filename)
            count += 1

    print(f"--- Generation Complete. Created {count} pages. ---")

if __name__ == "__main__":
    generate_pages()
