import json
import re

def is_valid_part_number(pn):
    # Part numbers should be relatively short. 
    # If it's longer than 30 chars and has spaces, it's likely a scraped sentence.
    if len(pn) > 30 and ' ' in pn:
        return False
    # If it contains known gibberish words
    if "Cocstoesxt" in pn or "CTCPT" in pn:
        return False
    return True

def clean_caterpillar_data():
    input_path = 'data/parts-database.json'
    output_path = 'data/parts-database-clean.json'
    
    with open(input_path, 'r') as f:
        data = json.load(f)
    
    print(f"Total parts before cleaning: {len(data)}")
    
    cleaned_data = []
    deleted_count = 0
    fixed_count = 0
    
    for part in data:
        # 1. Filter out garbage part numbers
        if part.get('brand') == 'Caterpillar':
            if not is_valid_part_number(part.get('part_number', '')):
                deleted_count += 1
                continue
            
            # 2. Fix Name and Description
            name = part.get('product_name', '') or part.get('name', '')
            
            # Remove "Caterpillar Replacement Component" prefix
            # Case insensitive replace
            clean_name = re.sub(r'Caterpillar Replacement Component\s*', '', name, flags=re.IGNORECASE).strip()
            
            # Check if remaining name is gibberish
            # Heuristic: If it's very long (> 50 chars) or has "Cocstoesxt"
            if len(clean_name) > 50 or "Cocstoesxt" in clean_name or "Ctcpt" in clean_name:
                # Fallback to simple name
                clean_name = f"Caterpillar {part['part_number']}"
            
            # If name was just the part number, ensure it has "Caterpillar" prefix for context
            if clean_name == part['part_number']:
                clean_name = f"Caterpillar {part['part_number']}"
                
            # Update fields
            part['product_name'] = clean_name
            part['name'] = clean_name
            
            # Fix Description
            # If description is empty or contains gibberish
            desc = part.get('description', '') or part.get('final_html_description', '')
            if not desc or "Cocstoesxt" in desc or "Ctcpt" in desc or len(desc) < 10:
                part['final_html_description'] = (
                    f"<p>Genuine quality replacement part for Caterpillar equipment. "
                    f"Part Number: {part['part_number']}. "
                    f"Engineered for durability and perfect fit. "
                    f"Available for global shipping.</p>"
                )
                part['description'] = f"Buy Caterpillar {part['part_number']}. specific high-quality replacement part."
            
            fixed_count += 1
            cleaned_data.append(part)
        else:
            cleaned_data.append(part)
            
    print(f"Deleted {deleted_count} garbage entries.")
    print(f"Fixed {fixed_count} Caterpillar entries.")
    print(f"Total parts after cleaning: {len(cleaned_data)}")
    
    with open(output_path, 'w') as f:
        json.dump(cleaned_data, f, indent=2)
        
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    clean_caterpillar_data()
