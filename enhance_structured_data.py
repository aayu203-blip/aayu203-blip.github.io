#!/usr/bin/env python3
"""
Add enhanced structured data for rich snippets
"""

import os
import json
import re
from pathlib import Path

def create_product_schema(part_number, part_name, category, brand=None):
    """Create comprehensive Product schema for rich snippets"""
    
    # Determine brand from part number or category
    if not brand:
        if 'Volvo' in category or 'volvo' in part_name.lower():
            brand = "Volvo"
        elif 'Scania' in category or 'scania' in part_name.lower():
            brand = "Scania"
        elif 'Komatsu' in category or 'komatsu' in part_name.lower():
            brand = "Komatsu"
        elif 'CAT' in category or 'cat' in part_name.lower():
            brand = "Caterpillar"
        else:
            brand = "Heavy Equipment"
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": f"{part_number} - {part_name}",
        "description": f"High-quality replacement {part_name} for {brand} heavy equipment. Part number {part_number} from {category}. In stock with fast shipping across India.",
        "sku": part_number,
        "brand": {
            "@type": "Brand",
            "name": brand
        },
        "category": category,
        "offers": {
            "@type": "Offer",
            "price": "Contact for Price",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Parts Trading Company"
            },
            "url": f"https://partstrading.com/pages/products/{part_number}.html"
        },
        "image": f"https://partstrading.com/images/products/{part_number}.jpg",
        "url": f"https://partstrading.com/pages/products/{part_number}.html"
    }
    
    return json.dumps(schema, indent=2)

def add_breadcrumb_schema(category, part_number):
    """Add breadcrumb schema for better navigation"""
    
    schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://partstrading.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Products",
                "item": "https://partstrading.com/#product-categories"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": category,
                "item": f"https://partstrading.com/pages/hubs/category-{category.lower().replace(' ', '-').replace(',', '').replace('&', '')}.html"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": part_number,
                "item": f"https://partstrading.com/pages/products/{part_number}.html"
            }
        ]
    }
    
    return json.dumps(schema, indent=2)

def enhance_product_pages():
    """Add enhanced structured data to product pages"""
    
    products_dir = Path("pages/products")
    updated_count = 0
    
    for html_file in products_dir.glob("*.html"):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract part number from filename
            part_number = html_file.stem
            
            # Extract title and category
            title_match = re.search(r'<title>(.*?)</title>', content)
            if not title_match:
                continue
                
            title = title_match.group(1)
            
            # Extract part name and category from title
            # Format: "Buy 1004057 Plunger - Heavy Equipment Parts | In Stock | Fast Shipping"
            if ' - ' in title and '|' in title:
                part_info = title.split(' - ')[1].split(' |')[0].strip()
                category = "Heavy Equipment Parts"  # Default category
            else:
                part_info = title
                category = "Heavy Equipment Parts"
            
            # Check if structured data already exists
            if '<script type="application/ld+json">' in content:
                continue  # Skip if already has structured data
            
            # Only process actual product pages (not index.html)
            if part_number == 'index':
                continue
            
            # Create schemas
            product_schema = create_product_schema(part_number, part_info, category)
            breadcrumb_schema = add_breadcrumb_schema(category, part_number)
            
            # Add structured data before closing </head>
            structured_data = f"""
    <!-- Enhanced Structured Data for Rich Snippets -->
    <script type="application/ld+json">
{product_schema}
    </script>
    <script type="application/ld+json">
{breadcrumb_schema}
    </script>
"""
            
            # Insert before </head>
            if '</head>' in content:
                new_content = content.replace('</head>', f'{structured_data}</head>')
                
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_count += 1
                
                if updated_count <= 3:  # Show first 3 examples
                    print(f"Added structured data to {part_number}")
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Enhanced {updated_count} product pages with structured data for rich snippets")

if __name__ == "__main__":
    enhance_product_pages()
