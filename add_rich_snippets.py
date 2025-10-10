#!/usr/bin/env python3
"""
Add rich snippets structured data to product pages
This will help part numbers show up with enhanced search results
"""

import json
import re
from pathlib import Path

def create_rich_snippet_schema(part_number, part_name, brand=None):
    """Create structured data for rich snippets"""
    
    if not brand:
        # Try to detect brand from part name
        part_lower = part_name.lower()
        if 'volvo' in part_lower:
            brand = "Volvo"
        elif 'scania' in part_lower:
            brand = "Scania"
        elif 'komatsu' in part_lower:
            brand = "Komatsu"
        elif 'cat' in part_lower or 'caterpillar' in part_lower:
            brand = "Caterpillar"
        else:
            brand = "Heavy Equipment"
    
    # Create comprehensive schema for rich snippets
    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": f"{part_number} - {part_name}",
        "description": f"High-quality replacement {part_name} for {brand} heavy equipment. Part number {part_number}. In stock with fast shipping across India.",
        "sku": part_number,
        "mpn": part_number,  # Manufacturer Part Number
        "brand": {
            "@type": "Brand",
            "name": brand
        },
        "category": "Automotive Parts",
        "offers": {
            "@type": "Offer",
            "price": "Contact for Price",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "Parts Trading Company",
                "url": "https://partstrading.com"
            },
            "url": f"https://partstrading.com/pages/products/{part_number}.html"
        },
        "image": f"https://partstrading.com/images/products/{part_number}.jpg",
        "url": f"https://partstrading.com/pages/products/{part_number}.html",
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Part Number",
                "value": part_number
            },
            {
                "@type": "PropertyValue", 
                "name": "Brand",
                "value": brand
            },
            {
                "@type": "PropertyValue",
                "name": "Availability",
                "value": "In Stock"
            }
        ]
    }
    
    return json.dumps(schema, indent=2)

def add_rich_snippets():
    """Add rich snippets to product pages"""
    
    products_dir = Path("pages/products")
    updated_count = 0
    
    # Process first 100 files as a test
    files_to_process = list(products_dir.glob("*.html"))[:100]
    
    for html_file in files_to_process:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Skip if already has structured data
            if 'application/ld+json' in content:
                continue
            
            part_number = html_file.stem
            
            # Skip non-product files
            if not part_number.isdigit() and not part_number.replace('-', '').replace('_', '').isalnum():
                continue
            
            # Extract part name from title
            title_match = re.search(r'<title>(.*?)</title>', content)
            if not title_match:
                continue
            
            title = title_match.group(1)
            
            # Extract part name from title format: "21534089 - Part Name | In Stock"
            if ' - ' in title and ' |' in title:
                part_name = title.split(' - ')[1].split(' |')[0].strip()
            else:
                part_name = f"Part {part_number}"
            
            # Create structured data
            schema_json = create_rich_snippet_schema(part_number, part_name)
            
            # Create the script tag
            structured_data = f"""    <script type="application/ld+json">
{schema_json}
    </script>
"""
            
            # Insert before </head>
            if '    </head>' in content:
                new_content = content.replace('    </head>', f'{structured_data}    </head>')
            elif '</head>' in content:
                new_content = content.replace('</head>', f'{structured_data}</head>')
            else:
                continue  # Skip if no </head> found
            
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            updated_count += 1
            
            if updated_count <= 5:
                print(f"✅ Added rich snippets to {part_number}: {part_name}")
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Added rich snippets to {updated_count} product pages")
    print("\n🎯 Expected Results:")
    print("- Part numbers may show with enhanced search results")
    print("- Star ratings, prices, and availability info in search")
    print("- Higher click-through rates from search results")

if __name__ == "__main__":
    add_rich_snippets()
