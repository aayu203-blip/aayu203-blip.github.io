#!/usr/bin/env python3
"""
Fix sitemap formatting - add proper XML structure and formatting
"""

import xml.etree.ElementTree as ET
from datetime import datetime

def fix_sitemap_format(filename):
    """Fix sitemap format by adding proper XML structure"""
    
    print(f"Fixing {filename}...")
    
    # Read the current content
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    
    # Check if it already has proper structure
    if '<?xml version=' in content and '<urlset' in content:
        print(f"{filename} already has proper structure")
        return
    
    # Parse the content to extract URLs
    urls = []
    lines = content.split('\n')
    for line in lines:
        if '<url>' in line and '<loc>' in line:
            urls.append(line.strip())
    
    if not urls:
        print(f"No URLs found in {filename}")
        return
    
    # Create proper XML structure
    root = ET.Element('urlset')
    root.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for url_content in urls:
        # Parse the URL content
        if '<loc>' in url_content and '</loc>' in url_content:
            # Extract URL
            start = url_content.find('<loc>') + 5
            end = url_content.find('</loc>')
            url = url_content[start:end]
            
            # Create proper URL element
            url_elem = ET.SubElement(root, 'url')
            
            loc_elem = ET.SubElement(url_elem, 'loc')
            loc_elem.text = url
            
            lastmod_elem = ET.SubElement(url_elem, 'lastmod')
            lastmod_elem.text = '2025-01-15'
            
            changefreq_elem = ET.SubElement(url_elem, 'changefreq')
            changefreq_elem.text = 'monthly'
            
            priority_elem = ET.SubElement(url_elem, 'priority')
            priority_elem.text = '0.8'
    
    # Write the properly formatted XML
    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ", level=0)
    tree.write(filename, encoding='UTF-8', xml_declaration=True)
    print(f"Fixed {filename} with {len(urls)} URLs")

def main():
    """Fix all sitemap files"""
    files_to_fix = [
        'sitemap-products-1.xml',
        'sitemap-products-2.xml', 
        'sitemap-products-3.xml'
    ]
    
    for filename in files_to_fix:
        try:
            fix_sitemap_format(filename)
        except Exception as e:
            print(f"Error fixing {filename}: {e}")
    
    print("✅ All sitemap files fixed!")

if __name__ == "__main__":
    main()