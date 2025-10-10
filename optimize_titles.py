#!/usr/bin/env python3
"""
Optimize page titles for better CTR and rankings
"""

import os
import re
from pathlib import Path

def optimize_title(title, part_number, category, brand=None):
    """Create optimized title for better CTR"""
    
    # Remove extra whitespace and normalize
    title = re.sub(r'\s+', ' ', title.strip())
    
    # Current format: "1004057 - Plunger | Air & Fluid Filtration Systems | Parts Trading Company India"
    
    # New optimized format for better CTR:
    if brand:
        new_title = f"Buy {part_number} {category} - {brand} Parts | In Stock | Fast Shipping"
    else:
        new_title = f"Buy {part_number} {category} - Heavy Equipment Parts | In Stock | Fast Shipping"
    
    # Ensure title is under 60 characters for optimal display
    if len(new_title) > 60:
        # Truncate intelligently
        new_title = new_title[:57] + "..."
    
    return new_title

def update_product_titles():
    """Update titles for all product pages"""
    
    products_dir = Path("pages/products")
    updated_count = 0
    
    for html_file in products_dir.glob("*.html"):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract current title
            title_match = re.search(r'<title>(.*?)</title>', content)
            if not title_match:
                continue
                
            current_title = title_match.group(1)
            
            # Extract part number from filename
            part_number = html_file.stem
            
            # Extract category and part name from current title
            # Format: "1004057 - Plunger | Air & Fluid Filtration Systems | Parts Trading Company India"
            parts = current_title.split('|')
            if len(parts) >= 2:
                part_info = parts[0].strip()
                category = parts[1].strip()
                
                # Extract part name from "1004057 - Plunger"
                if ' - ' in part_info:
                    part_name = part_info.split(' - ', 1)[1].strip()
                else:
                    part_name = part_info
                
                # Create optimized title
                new_title = optimize_title(current_title, part_number, part_name)
                
                # Replace in content
                new_content = content.replace(
                    f'<title>{current_title}</title>',
                    f'<title>{new_title}</title>'
                )
                
                # Write back
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_count += 1
                
                if updated_count <= 5:  # Show first 5 examples
                    print(f"Updated {part_number}: '{current_title}' -> '{new_title}'")
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Updated {updated_count} product page titles for better CTR")

if __name__ == "__main__":
    update_product_titles()
