#!/usr/bin/env python3
"""
Fix sitemap structure by adding proper XML declaration and urlset wrapper
"""

import xml.etree.ElementTree as ET
from datetime import datetime

def fix_sitemap_structure(filename):
    """Fix sitemap structure by adding proper XML wrapper"""
    
    print(f"Fixing {filename}...")
    
    # Read the current content
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    # Check if it already has proper structure
    if '<?xml version=' in content and '<urlset' in content:
        print(f"{filename} already has proper structure")
        return
    
    # Create proper XML structure
    xml_header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml_footer = '\n</urlset>'
    
    # Wrap the content with proper XML structure
    fixed_content = xml_header + content + xml_footer
    
    # Write back the fixed content
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"Fixed {filename}")

def main():
    """Fix all sitemap files"""
    files_to_fix = [
        'sitemap-products-1.xml',
        'sitemap-products-2.xml', 
        'sitemap-products-3.xml'
    ]
    
    for filename in files_to_fix:
        try:
            fix_sitemap_structure(filename)
        except Exception as e:
            print(f"Error fixing {filename}: {e}")
    
    print("✅ All sitemap files fixed!")

if __name__ == "__main__":
    main()