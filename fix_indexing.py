#!/usr/bin/env python3
"""
Script to fix Google indexing issues for PTC website
- Split large sitemap into smaller chunks
- Add metadata to each URL
- Create sitemap index
"""

import xml.etree.ElementTree as ET
from datetime import datetime
import math

def split_sitemap(input_file, chunk_size=1000):
    """Split large sitemap into smaller chunks with metadata"""
    
    # Parse existing sitemap
    tree = ET.parse(input_file)
    root = tree.getroot()
    
    urls = root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}url')
    total_urls = len(urls)
    chunks = math.ceil(total_urls / chunk_size)
    
    print(f"Found {total_urls} URLs, splitting into {chunks} chunks")
    
    # Create sitemap index
    sitemap_index = ET.Element('sitemapindex')
    sitemap_index.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Split URLs into chunks
    for i in range(chunks):
        start_idx = i * chunk_size
        end_idx = min((i + 1) * chunk_size, total_urls)
        chunk_urls = urls[start_idx:end_idx]
        
        # Create new sitemap for this chunk
        urlset = ET.Element('urlset')
        urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        
        for url_elem in chunk_urls:
            # Get the URL
            loc = url_elem.find('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
            if loc is not None:
                # Create new URL element with metadata
                new_url = ET.SubElement(urlset, 'url')
                
                # Add location
                new_loc = ET.SubElement(new_url, 'loc')
                new_loc.text = loc.text
                
                # Add lastmod
                lastmod = ET.SubElement(new_url, 'lastmod')
                lastmod.text = datetime.now().strftime('%Y-%m-%d')
                
                # Add changefreq
                changefreq = ET.SubElement(new_url, 'changefreq')
                changefreq.text = 'monthly'
                
                # Add priority
                priority = ET.SubElement(new_url, 'priority')
                priority.text = '0.8'
        
        # Save chunk sitemap
        chunk_filename = f'sitemap-products-{i+1}.xml'
        chunk_tree = ET.ElementTree(urlset)
        chunk_tree.write(chunk_filename, encoding='utf-8', xml_declaration=True)
        print(f"Created {chunk_filename} with {len(chunk_urls)} URLs")
        
        # Add to sitemap index
        sitemap = ET.SubElement(sitemap_index, 'sitemap')
        sitemap_loc = ET.SubElement(sitemap, 'loc')
        sitemap_loc.text = f'https://partstrading.com/{chunk_filename}'
        sitemap_lastmod = ET.SubElement(sitemap, 'lastmod')
        sitemap_lastmod.text = datetime.now().strftime('%Y-%m-%d')
    
    # Save sitemap index
    index_tree = ET.ElementTree(sitemap_index)
    index_tree.write('sitemap_index.xml', encoding='utf-8', xml_declaration=True)
    print("Created sitemap_index.xml")

if __name__ == "__main__":
    split_sitemap('sitemap.xml')
    print("\n✅ Sitemap splitting complete!")
    print("\nNext steps:")
    print("1. Upload all new sitemap files to your server")
    print("2. Update robots.txt to point to sitemap_index.xml")
    print("3. Submit sitemap_index.xml to Google Search Console")
    print("4. Request indexing for important pages")
