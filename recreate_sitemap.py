#!/usr/bin/env python3
"""
Recreate properly formatted sitemap files for upload
"""

import xml.etree.ElementTree as ET
from datetime import datetime

def recreate_sitemap(input_file, output_file, chunk_size=1000, start_index=0):
    """Recreate sitemap with proper XML structure"""
    
    # Parse existing sitemap
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    urls = root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url')
    total_urls = len(urls)
    
    # Get chunk of URLs
    end_index = min(start_index + chunk_size, total_urls)
    chunk_urls = urls[start_index:end_index]
    
    print(f"Processing {len(chunk_urls)} URLs for {output_file}")
    
    # Create new sitemap with proper structure
    new_root = ET.Element('urlset')
    new_root.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    current_date = '2025-01-15'
    
    for url_element in chunk_urls:
        loc = url_element.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
        if loc is not None:
            new_url_element = ET.SubElement(new_root, 'url')
            
            loc_element = ET.SubElement(new_url_element, 'loc')
            loc_element.text = loc.text
            
            lastmod_element = ET.SubElement(new_url_element, 'lastmod')
            lastmod_element.text = current_date
            
            changefreq_element = ET.SubElement(new_url_element, 'changefreq')
            changefreq_element.text = 'monthly'
            
            priority_element = ET.SubElement(new_url_element, 'priority')
            priority_element.text = '0.8'
    
    # Write with proper formatting
    tree = ET.ElementTree(new_root)
    ET.indent(tree, space="  ", level=0)
    tree.write(output_file, encoding='UTF-8', xml_declaration=True)
    
    print(f"Created {output_file} with {len(chunk_urls)} URLs")

def recreate_sitemap_index():
    """Recreate sitemap index"""
    
    sitemap_index = ET.Element('sitemapindex')
    sitemap_index.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    current_date = '2025-01-15'
    
    # Add main pages sitemap
    sitemap_entry = ET.SubElement(sitemap_index, 'sitemap')
    loc_entry = ET.SubElement(sitemap_entry, 'loc')
    loc_entry.text = 'https://partstrading.com/sitemap-main.xml'
    lastmod_entry = ET.SubElement(sitemap_entry, 'lastmod')
    lastmod_entry.text = current_date
    
    # Add product sitemaps
    for i in range(1, 4):
        sitemap_entry = ET.SubElement(sitemap_index, 'sitemap')
        loc_entry = ET.SubElement(sitemap_entry, 'loc')
        loc_entry.text = f'https://partstrading.com/sitemap-products-{i}.xml'
        lastmod_entry = ET.SubElement(sitemap_entry, 'lastmod')
        lastmod_entry.text = current_date
    
    # Add news sitemap
    sitemap_entry = ET.SubElement(sitemap_index, 'sitemap')
    loc_entry = ET.SubElement(sitemap_entry, 'loc')
    loc_entry.text = 'https://partstrading.com/news-sitemap.xml'
    lastmod_entry = ET.SubElement(sitemap_entry, 'lastmod')
    lastmod_entry.text = current_date
    
    # Write with proper formatting
    tree = ET.ElementTree(sitemap_index)
    ET.indent(tree, space="  ", level=0)
    tree.write('sitemap_index.xml', encoding='UTF-8', xml_declaration=True)
    
    print("Created sitemap_index.xml")

def main():
    """Recreate all sitemap files"""
    
    print("🔄 Recreating properly formatted sitemap files...")
    
    # Recreate product sitemaps
    recreate_sitemap('sitemap.xml', 'sitemap-products-1.xml', 1000, 0)
    recreate_sitemap('sitemap.xml', 'sitemap-products-2.xml', 1000, 1000)
    recreate_sitemap('sitemap.xml', 'sitemap-products-3.xml', 1000, 2000)
    
    # Recreate sitemap index
    recreate_sitemap_index()
    
    print("✅ All sitemap files recreated with proper XML structure!")
    print("\n📁 Files ready for upload:")
    print("- sitemap_index.xml (main sitemap index)")
    print("- sitemap-products-1.xml (1000 URLs)")
    print("- sitemap-products-2.xml (1000 URLs)")
    print("- sitemap-products-3.xml (497 URLs)")

if __name__ == "__main__":
    main()
