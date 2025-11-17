#!/usr/bin/env python3
"""
Generate complete sitemaps for partstrading.com with all updated pages.
Includes: main pages, products, equipment models, categories, blog, multilingual pages
"""

import os
from pathlib import Path
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

BASE_URL = "https://partstrading.com"
TODAY = datetime.now().strftime("%Y-%m-%d")

def create_sitemap_xml(urls, filename):
    """Create a sitemap XML file"""
    urlset = ET.Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for url_data in urls:
        url_elem = ET.SubElement(urlset, 'url')
        
        loc = ET.SubElement(url_elem, 'loc')
        loc.text = url_data['loc']
        
        lastmod = ET.SubElement(url_elem, 'lastmod')
        lastmod.text = url_data.get('lastmod', TODAY)
        
        changefreq = ET.SubElement(url_elem, 'changefreq')
        changefreq.text = url_data.get('changefreq', 'weekly')
        
        priority = ET.SubElement(url_elem, 'priority')
        priority.text = url_data.get('priority', '0.5')
    
    # Pretty print
    xml_str = ET.tostring(urlset, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent='  ', encoding='utf-8').decode('utf-8')
    
    # Remove extra blank lines
    pretty_xml = '\n'.join([line for line in pretty_xml.split('\n') if line.strip()])
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    
    return len(urls)

def generate_main_sitemap():
    """Generate sitemap for main pages"""
    urls = [
        {'loc': f'{BASE_URL}/', 'lastmod': TODAY, 'changefreq': 'daily', 'priority': '1.0'},
        {'loc': f'{BASE_URL}/index.html', 'lastmod': TODAY, 'changefreq': 'daily', 'priority': '1.0'},
    ]
    
    # Add category pages
    category_pages = list(Path('pages/categories').glob('*.html')) if Path('pages/categories').exists() else []
    for page in category_pages:
        urls.append({
            'loc': f'{BASE_URL}/pages/categories/{page.name}',
            'lastmod': TODAY,
            'changefreq': 'weekly',
            'priority': '0.8'
        })
    
    # Add hub pages
    hub_pages = list(Path('pages/hubs').glob('*.html')) if Path('pages/hubs').exists() else []
    for page in hub_pages:
        urls.append({
            'loc': f'{BASE_URL}/pages/hubs/{page.name}',
            'lastmod': TODAY,
            'changefreq': 'weekly',
            'priority': '0.8'
        })
    
    count = create_sitemap_xml(urls, 'sitemap-main.xml')
    print(f"✓ sitemap-main.xml: {count} URLs")
    return count

def generate_blog_sitemap():
    """Generate sitemap for blog pages"""
    urls = []
    
    blog_path = Path('blog')
    if blog_path.exists():
        blog_pages = list(blog_path.glob('*.html'))
        for page in blog_pages:
            urls.append({
                'loc': f'{BASE_URL}/blog/{page.name}',
                'lastmod': TODAY,
                'changefreq': 'monthly',
                'priority': '0.7'
            })
    
    if urls:
        count = create_sitemap_xml(urls, 'sitemap-blog.xml')
        print(f"✓ sitemap-blog.xml: {count} URLs")
        return count
    return 0

def generate_equipment_sitemap():
    """Generate sitemap for equipment model pages"""
    urls = []
    
    equipment_path = Path('equipment-models')
    if equipment_path.exists():
        equipment_pages = list(equipment_path.glob('**/*.html'))
        for page in equipment_pages:
            # Get relative path from equipment-models
            rel_path = page.relative_to(equipment_path)
            urls.append({
                'loc': f'{BASE_URL}/equipment-models/{rel_path}',
                'lastmod': TODAY,
                'changefreq': 'monthly',
                'priority': '0.7'
            })
    
    if urls:
        count = create_sitemap_xml(urls, 'sitemap-models.xml')
        print(f"✓ sitemap-models.xml: {count} URLs")
        return count
    return 0

def generate_product_sitemaps():
    """Generate sitemaps for product pages (split into multiple files)"""
    # Collect all product URLs from various locations
    all_product_urls = []
    
    # Main product pages (volvo and scania folders)
    for brand in ['volvo', 'scania']:
        brand_path = Path(brand)
        if brand_path.exists():
            product_pages = list(brand_path.glob('**/*.html'))
            for page in product_pages:
                rel_path = page.relative_to(brand_path)
                all_product_urls.append({
                    'loc': f'{BASE_URL}/{brand}/{rel_path}',
                    'lastmod': TODAY,
                    'changefreq': 'monthly',
                    'priority': '0.6'
                })
    
    # Split into chunks of 40,000 URLs per sitemap (Google limit is 50,000)
    chunk_size = 40000
    total_count = 0
    
    for i in range(0, len(all_product_urls), chunk_size):
        chunk = all_product_urls[i:i + chunk_size]
        sitemap_num = (i // chunk_size) + 1
        count = create_sitemap_xml(chunk, f'sitemap-products-{sitemap_num}.xml')
        print(f"✓ sitemap-products-{sitemap_num}.xml: {count} URLs")
        total_count += count
    
    return total_count

def generate_multilingual_sitemaps():
    """Generate sitemaps for multilingual pages (disabled while language sites are offline)."""
    languages: list[str] = []
    
    total_count = 0
    sitemap_files = []
    
    for lang in languages:
        lang_path = Path(lang)
        if not lang_path.exists():
            continue
        
        urls = []
        
        # Homepage
        urls.append({
            'loc': f'{BASE_URL}/{lang}/',
            'lastmod': TODAY,
            'changefreq': 'weekly',
            'priority': '0.7'
        })
        
        # Collect pages (limit to avoid huge files)
        html_files = list(lang_path.glob('pages/**/*.html'))
        
        # Limit to 40000 URLs per language
        for page in html_files[:40000]:
            rel_path = page.relative_to(lang_path)
            urls.append({
                'loc': f'{BASE_URL}/{lang}/{rel_path}',
                'lastmod': TODAY,
                'changefreq': 'monthly',
                'priority': '0.5'
            })
        
        if urls:
            sitemap_file = f'sitemap-{lang}.xml'
            count = create_sitemap_xml(urls, sitemap_file)
            print(f"✓ {sitemap_file}: {count} URLs")
            sitemap_files.append(sitemap_file)
            total_count += count
    
    return total_count, sitemap_files

def generate_sitemap_index(sitemap_files):
    """Generate sitemap index file"""
    sitemapindex = ET.Element('sitemapindex')
    sitemapindex.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    for sitemap_file in sitemap_files:
        sitemap_elem = ET.SubElement(sitemapindex, 'sitemap')
        
        loc = ET.SubElement(sitemap_elem, 'loc')
        loc.text = f'{BASE_URL}/{sitemap_file}'
        
        lastmod = ET.SubElement(sitemap_elem, 'lastmod')
        lastmod.text = TODAY
    
    # Pretty print
    xml_str = ET.tostring(sitemapindex, encoding='utf-8')
    dom = minidom.parseString(xml_str)
    pretty_xml = dom.toprettyxml(indent='  ', encoding='utf-8').decode('utf-8')
    
    # Remove extra blank lines
    pretty_xml = '\n'.join([line for line in pretty_xml.split('\n') if line.strip()])
    
    with open('sitemap_index.xml', 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(pretty_xml)
    
    print(f"\n✓ sitemap_index.xml: {len(sitemap_files)} sitemaps")
    print(f"✓ sitemap.xml: (copy of index)")

def main():
    """Main function"""
    print("="*70)
    print("GENERATING COMPLETE SITEMAPS FOR PARTSTRADING.COM")
    print("="*70)
    print(f"Date: {TODAY}\n")
    
    all_sitemaps = []
    total_urls = 0
    
    # Generate main sitemap
    print("Generating main pages sitemap...")
    count = generate_main_sitemap()
    total_urls += count
    all_sitemaps.append('sitemap-main.xml')
    
    # Generate blog sitemap
    print("\nGenerating blog sitemap...")
    count = generate_blog_sitemap()
    if count > 0:
        total_urls += count
        all_sitemaps.append('sitemap-blog.xml')
    
    # Generate equipment models sitemap
    print("\nGenerating equipment models sitemap...")
    count = generate_equipment_sitemap()
    if count > 0:
        total_urls += count
        all_sitemaps.append('sitemap-models.xml')
    
    # Generate product sitemaps
    print("\nGenerating product sitemaps...")
    count = generate_product_sitemaps()
    total_urls += count
    # Add product sitemaps that were created
    for i in range(1, 100):
        if Path(f'sitemap-products-{i}.xml').exists():
            all_sitemaps.append(f'sitemap-products-{i}.xml')
        else:
            break
    
    # Generate multilingual sitemaps
    print("\nGenerating multilingual sitemaps...")
    count, lang_sitemaps = generate_multilingual_sitemaps()
    total_urls += count
    all_sitemaps.extend(lang_sitemaps)
    
    # Generate sitemap index
    print("\nGenerating sitemap index...")
    generate_sitemap_index(all_sitemaps)
    
    print("\n" + "="*70)
    print("SITEMAP GENERATION COMPLETE")
    print("="*70)
    print(f"\n📊 Total URLs: {total_urls:,}")
    print(f"📁 Total sitemap files: {len(all_sitemaps)}")
    print(f"\n📋 Sitemap files created:")
    for sitemap in sorted(all_sitemaps):
        print(f"   - {sitemap}")
    print(f"\n🎯 Main file: sitemap_index.xml (or sitemap.xml)")
    print(f"\n✅ Submit to Google Search Console:")
    print(f"   https://partstrading.com/sitemap.xml")
    print(f"   https://partstrading.com/sitemap_index.xml")
    print("\n")

if __name__ == "__main__":
    main()












