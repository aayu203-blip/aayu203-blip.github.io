import json
import os
import re

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
JSONL_FILE = os.path.join(DATA_DIR, 'full_dataset.jsonl')
ENRICHED_FILE = os.path.join(DATA_DIR, 'enriched_specs.json')
OUTPUT_SQL = os.path.join(DATA_DIR, 'seed.sql')

# Helper to slugify
def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def escape_sql(text):
    if text is None:
        return 'NULL'
    return "'" + text.replace("'", "''") + "'"

def main():
    print(f"Reading from {JSONL_FILE}...")
    
    # Load Enriched Data
    enriched_data = {}
    if os.path.exists(ENRICHED_FILE):
        try:
            with open(ENRICHED_FILE, 'r') as f:
                enriched_data = json.load(f)
            print(f"Loaded {len(enriched_data)} enriched specs.")
        except Exception as e:
            print(f"Warning: Could not load enriched specs: {e}")

    brands = set()
    products = []
    
    # Read JSONL
    # Limit to first 5000 for the seed file to avoid massive SQL files in Dev
    # (In prod, we would use COPY command or smaller batches)
    LIMIT = 5000 
    count = 0
    
    with open(JSONL_FILE, 'r') as f:
        for line in f:
            if count >= LIMIT:
                break
            
            try:
                item = json.loads(line)
                part_number = item.get('part_number', '').strip()
                if not part_number:
                    continue
                
                # Determine Brand (Simple heuristic or from source)
                # Assuming item['name'] might start with Brand or url contains it
                # For now, let's look for known brands or assume 'Generic' if unknown
                # Actually, data-loader.ts has heuristics. Let's do a simple extraction.
                
                raw_name = item.get('name', '')
                brand_slug = 'generic'
                brand_name = 'Generic'
                
                # Heuristic: Check common brands in raw name or url
                known_brands = ['Volvo', 'Caterpillar', 'Komatsu', 'Scania', 'Hitachi', 'Deere']
                normalized_text = (raw_name + " " + item.get('url', '')).lower()
                
                for b in known_brands:
                    if b.lower() in normalized_text:
                        brand_name = b
                        brand_slug = slugify(b)
                        break
                
                # Check formatting: "Brand - PartName"
                if brand_slug == 'generic' and ' - ' in raw_name:
                    potential_brand = raw_name.split(' - ')[0]
                    if len(potential_brand) < 20: # Sanity check
                        brand_name = potential_brand
                        brand_slug = slugify(potential_brand)

                brands.add((brand_slug, brand_name))
                
                # Enriched Data Merge
                specs = {}
                name = raw_name
                description = item.get('description', '')
                
                if part_number in enriched_data:
                    enriched = enriched_data[part_number]
                    specs = enriched.get('technical_specs', {})
                    if enriched.get('marketing_description'):
                        description = enriched.get('marketing_description')
                    # Could update name if we had a better one
                
                # SKU and Slug
                sku = f"{brand_slug}-{part_number}"
                slug = slugify(f"{brand_slug}-{part_number}")
                
                product = {
                    'part_number': part_number,
                    'brand_slug': brand_slug,
                    'name': name,
                    'sku': sku,
                    'description': description,
                    'specs': json.dumps(specs),
                    'slug': slug
                }
                products.append(product)
                count += 1
                
            except json.JSONDecodeError:
                continue

    print(f"Processed {len(products)} products.")

    # Generate SQL
    with open(OUTPUT_SQL, 'w') as sql:
        sql.write("-- Seed Data for God Mode V2\n")
        sql.write("BEGIN;\n\n")
        
        # Insert Brands
        sql.write("-- Brands\n")
        for slug, name in brands:
            sql.write(f"INSERT INTO brands (slug, name) VALUES ({escape_sql(slug)}, {escape_sql(name)}) ON CONFLICT (slug) DO NOTHING;\n")
        
        sql.write("\n-- Products\n")
        for p in products:
            # We need to sub-select the brand_id
            sql.write(f"""
INSERT INTO products (part_number, brand_id, name, sku, description, specs, slug)
VALUES (
    {escape_sql(p['part_number'])},
    (SELECT id FROM brands WHERE slug = {escape_sql(p['brand_slug'])}),
    {escape_sql(p['name'])},
    {escape_sql(p['sku'])},
    {escape_sql(p['description'])},
    {escape_sql(p['specs'])}::jsonb,
    {escape_sql(p['slug'])}
) ON CONFLICT (sku) DO NOTHING;
""")
        
        sql.write("\nCOMMIT;\n")
    
    print(f"SQL seed file generated at {OUTPUT_SQL}")

if __name__ == '__main__':
    main()
