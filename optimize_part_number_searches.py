#!/usr/bin/env python3
"""
Optimize titles and descriptions specifically for part number searches
Based on search console data showing high impressions but 0 clicks for part numbers
"""

import os
import re
from pathlib import Path

def create_part_number_optimized_title(part_number, part_name, brand=None):
    """Create title optimized for part number searches"""
    
    # Determine brand from part name or use generic
    if not brand:
        if any(b in part_name.lower() for b in ['volvo', 'scania', 'komatsu', 'cat', 'caterpillar', 'hitachi']):
            brand = 'Heavy Equipment'
        else:
            brand = 'Heavy Equipment'
    
    # Format optimized for part number searches
    # People searching "21534089" want to know: "Is this the right part? Is it available?"
    optimized_title = f"{part_number} - {part_name} | In Stock | {brand} Parts | Fast Shipping"
    
    # Keep under 60 characters for optimal display
    if len(optimized_title) > 60:
        optimized_title = f"{part_number} - {part_name} | In Stock | {brand}"
        if len(optimized_title) > 60:
            optimized_title = f"{part_number} - {part_name} | In Stock"
    
    return optimized_title

def create_part_number_optimized_description(part_number, part_name, brand=None):
    """Create description optimized for part number searches"""
    
    if not brand:
        brand = "Heavy Equipment"
    
    # Focus on what people searching part numbers want to know:
    # 1. Is this the right part?
    # 2. Is it available?
    # 3. How fast can I get it?
    # 4. What's the quality?
    
    description = f"✅ {part_number} - {part_name} for {brand} equipment. ✓ In Stock ✓ Fast Delivery ✓ Quality Guaranteed ✓ WhatsApp: +91-98210-37990"
    
    # Keep under 160 characters for optimal display
    if len(description) > 160:
        description = f"{part_number} - {part_name} for {brand}. In Stock. Fast Delivery. WhatsApp: +91-98210-37990"
        if len(description) > 160:
            description = f"{part_number} - {part_name}. In Stock. Fast Delivery. WhatsApp: +91-98210-37990"
    
    return description

def optimize_part_number_searches():
    """Optimize all product pages for part number searches"""
    
    products_dir = Path("pages/products")
    updated_count = 0
    
    # Process first 200 files as a test
    files_to_process = list(products_dir.glob("*.html"))[:200]
    
    for html_file in files_to_process:
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            part_number = html_file.stem
            
            # Skip non-product files
            if not part_number.isdigit() and not part_number.replace('-', '').replace('_', '').isalnum():
                continue
            
            # Extract current title and description
            title_match = re.search(r'<title>(.*?)</title>', content)
            desc_match = re.search(r'<meta name="description" content="(.*?)"', content)
            
            if not title_match:
                continue
            
            current_title = title_match.group(1)
            current_description = desc_match.group(1) if desc_match else ""
            
            # Extract part name from current title
            # Format: "Buy 1004057 Plunger - Heavy Equipment Parts | In Stock | Fast Shipping"
            if 'Buy' in current_title and ' - ' in current_title:
                # Remove "Buy" and extract part name
                part_name = current_title.split(' - ')[0].replace('Buy ', '').strip()
                # Remove part number to get just the name
                part_name = part_name.replace(part_number, '').strip()
                if not part_name:
                    part_name = f"Part {part_number}"
            else:
                part_name = f"Part {part_number}"
            
            # Create optimized title and description
            new_title = create_part_number_optimized_title(part_number, part_name)
            new_description = create_part_number_optimized_description(part_number, part_name)
            
            # Update content
            new_content = content
            
            # Update title
            new_content = new_content.replace(
                f'<title>{current_title}</title>',
                f'<title>{new_title}</title>'
            )
            
            # Update description
            if current_description:
                new_content = new_content.replace(
                    f'<meta name="description" content="{current_description}">',
                    f'<meta name="description" content="{new_description}">'
                )
            else:
                # Add description if missing
                new_content = new_content.replace(
                    '<meta name="author" content="Parts Trading Company">',
                    f'<meta name="description" content="{new_description}">\n    <meta name="author" content="Parts Trading Company">'
                )
            
            # Write back
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            updated_count += 1
            
            if updated_count <= 5:
                print(f"✅ {part_number}: '{current_title[:50]}...' -> '{new_title}'")
                print(f"   Description: '{new_description[:80]}...'")
                print()
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"✅ Optimized {updated_count} product pages for part number searches")
    print("\n🎯 Expected Results:")
    print("- Higher CTR for specific part number searches")
    print("- Better visibility in search results")
    print("- More clicks from product-specific queries")

if __name__ == "__main__":
    optimize_part_number_searches()
