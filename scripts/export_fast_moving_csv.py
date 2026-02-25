import json
import csv

def export_fast_moving_csv():
    input_file = 'next-engine/data/parts-database.json'
    output_file = 'fast_moving_parts.csv'
    
    print(f"Reading {input_file}...")
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    # Get last 2000 items as per audit logic
    tail = data[-2000:]
    volvo_parts = [p for p in tail if str(p.get('brand')).lower() == 'volvo']
    
    print(f"Found {len(volvo_parts)} Volvo parts in the tail.")
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Part No', 'Part Name', 'Compatible With', 'Alt Part Nos', 'Application', 'Category']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for p in volvo_parts:
            # 1. Part Number
            pn = p.get('part_number') or p.get('partNumber') or "Unknown"
            brand = p.get('brand', 'Volvo')
            
            # 2. Part Name (Clean Description)
            specs = p.get('technical_specs', {}) or {}
            clean_name = specs.get('Part Type')
            
            if not clean_name:
                # Try to clean product name: "Volvo 12345 Ring Gear" -> "Ring Gear"
                raw = p.get('product_name') or p.get('name') or ""
                # Simple strip approach
                tokens = raw.split()
                # Remove brand and pn if present (case insensitive)
                filtered = [t for t in tokens if t.lower() != brand.lower() and t.lower() != str(pn).lower()]
                clean_name = " ".join(filtered)
            
            if not clean_name:
                clean_name = "Spare Part"
                
            # 3. Compatible With (Machine Models)
            # Try 'compatibility' array first, then 'application' field if it looks like a model
            comp_list = []
            
            # Check explicit compatibility list
            raw_comp = p.get('compatibility', [])
            if raw_comp:
                comp_list.extend(raw_comp)
                
            # Check root application field
            app_root = p.get('application', '')
            if app_root and app_root not in comp_list:
                comp_list.append(app_root)
                
            # Check JSON-LD isCompatibleWith
            jld = p.get('json_ld', {})
            compat_ld = jld.get('isCompatibleWith', [])
            if isinstance(compat_ld, list):
                for c in compat_ld:
                    cname = c.get('name', '').replace(brand, '').strip()
                    if cname and cname not in comp_list:
                        comp_list.append(cname)
                        
            comp_str = ", ".join(comp_list[:15]) # Limit to first 15 models
            
            # 4. Alt Part Nos
            alts = []
            cr_nums = p.get('cross_reference_numbers', [])
            if cr_nums: alts.extend(cr_nums)
            
            oem_refs = p.get('oem_cross_references', [])
            for ref in oem_refs:
                if isinstance(ref, dict):
                    alts.append(f"{ref.get('brand')}:{ref.get('partNumber')}")
            
            if 'Alternate Part Numbers' in specs:
                 val = specs['Alternate Part Numbers']
                 if isinstance(val, list): alts.extend([str(v) for v in val])
                 else: alts.append(str(val))
            
            alt_str = "; ".join(sorted(list(set(alts))))
            
            # 5. Application (Functional Application eg. "Cooling System")
            # If specs has 'Application' and it's different from the models, keep it.
            spec_app = specs.get('Application', '')
            if spec_app in comp_list:
                spec_app = "" # Duplicate
            
            # 6. Category
            cat = p.get('category', '')

            writer.writerow({
                'Part No': pn,
                'Part Name': clean_name,
                'Compatible With': comp_str,
                'Alt Part Nos': alt_str,
                'Application': spec_app,
                'Category': cat
            })
            
    print(f"Successfully exported {len(volvo_parts)} parts to {output_file}")

if __name__ == "__main__":
    export_fast_moving_csv()
