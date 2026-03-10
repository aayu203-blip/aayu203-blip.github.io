import csv
import os
import re

# Paths
CSV_PATH = "tools/intelligence_engine/master_autonomous_export.csv"
OUTPUT_DIR = "pages/products"
TEMPLATE_PATH = "pages/products/20589122.html" # Using an existing product page as template

def clean_filename(s):
    return re.sub(r'[^a-z0-9]', '-', s.lower())

def generate_pages():
    if not os.path.exists(CSV_PATH):
        print(f"Error: {CSV_PATH} not found.")
        return

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Read template (if exists, else use a fallback)
    template_content = ""
    if os.path.exists(TEMPLATE_PATH):
        with open(TEMPLATE_PATH, "r") as f:
            template_content = f.read()
    else:
        print(f"Warning: Template {TEMPLATE_PATH} not found. Using a basic fallback.")
        template_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PART_NUMBER}} | {{DESCRIPTION}} | Parts Trading Company</title>
    <meta name="description" content="{{DESCRIPTION}} - Replacement part for {{BRAND}} {{CATEGORY}}. High quality spares at competitive prices.">
</head>
<body>
    <h1>{{PART_NUMBER}}</h1>
    <p>{{DESCRIPTION}}</p>
    <p>Brand: {{BRAND}}</p>
    <p>Category: {{CATEGORY}}</p>
</body>
</html>"""

    with open(CSV_PATH, "r") as f:
        reader = csv.DictReader(f)
        count = 0
        for row in reader:
            part_num = row.get("oem_reference_number") or row.get("Part Number", "Unknown")
            description = row.get("name") or row.get("Part Name", "Underground Rock Drifter Part")
            source = row.get("source_manual") or row.get("Source", "OEM Manual")
            brand = "Epiroc" if "epiroc" in source.lower() else "Sandvik" if "sandvik" in source.lower() else "Premium OEM"
            category = "Underground Rock Drifter"

            # Create personalized content
            content = template_content
            content = content.replace("20589122", part_num) # Replace template part number
            content = content.replace("CHARGE AIR HOSE", description) # Replace template description
            content = content.replace("Volvo", brand) # Replace template brand
            content = content.replace("Engine Parts and Cooling Parts", category) # Replace template category
            
            # Additional SEO adjustments
            content = content.replace("<title>CHARGE AIR HOSE | 20589122 | Volvo Spare Parts</title>", 
                                    f"<title>{part_num} | {description} | {brand} Rock Drifter Parts</title>")
            
            filename = f"{clean_filename(part_num)}.html"
            filepath = os.path.join(OUTPUT_DIR, filename)

            with open(filepath, "w") as out:
                out.write(content)
            
            print(f"Generated: {filepath}")
            count += 1
    
    print(f"Total pages generated: {count}")

if __name__ == "__main__":
    generate_pages()
