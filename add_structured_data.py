#!/usr/bin/env python3
"""
Add structured data to product pages for rich snippets
"""

import os
import json
import re
from pathlib import Path

def create_simple_product_schema(part_number, part_name):
    """Create simple Product schema"""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": f"{part_number} - {part_name}",
        "description": f"High-quality replacement {part_name} for heavy equipment. Part number {part_number}. In stock with fast shipping across India.",
        "sku": part_number,
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "INR"
        }
    }
    
    return json.dumps(schema, indent=2)

def add_to_product_pages():
    """Add structured data to product pages"""
    
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
            
            # Extract part name from title
            title_match = re.search(r'<title>(.*?)</title>', content)
            if title_match:
                title = title_match.group(1)
                # Extract part name from "Buy 1004057 Plunger - Heavy Equipment Parts"
                if 'Buy' in title and ' - ' in title:
                    part_name = title.split(' - ')[0].replace('Buy ', '').strip()
                    # Remove part number to get just the name
                    part_name = part_name.replace(part_number, '').strip()
                else:
                    part_name = f"Part {part_number}"
            else:
                part_name = f"Part {part_number}"
            
            # Create structured data
            schema = create_simple_product_schema(part_number, part_name)
            
            # Add before the first meta tag
            structured_data = f"""<script type="application/ld+json">
{schema}
</script>
    """
            
            # Insert after <head>
            if '<head>' in content:
                new_content = content.replace('<head>', f'<head>\n{structured_data}')
                
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_count += 1
                
                if updated_count <= 5:
                    print(f"Added structured data to {part_number}: {part_name}")
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Added structured data to {updated_count} product pages")

if __name__ == "__main__":
    add_to_product_pages()
