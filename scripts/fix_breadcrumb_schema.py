#!/usr/bin/env python3
"""
Fix breadcrumb structured data by adding standalone BreadcrumbList schema
to all converted product pages.
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

def fix_breadcrumb_schema(filepath: Path) -> bool:
    """Add standalone BreadcrumbList schema to a product page."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Check if standalone breadcrumb schema already exists
        breadcrumb_scripts = soup.find_all('script', {'type': 'application/ld+json'})
        has_standalone_breadcrumb = False
        product_script = None
        
        for script in breadcrumb_scripts:
            if script.string:
                try:
                    data = json.loads(script.string)
                    # Check if this is a standalone BreadcrumbList
                    if isinstance(data, dict) and data.get('@type') == 'BreadcrumbList' and '@context' in data:
                        has_standalone_breadcrumb = True
                    # Find the Product schema
                    elif isinstance(data, dict) and data.get('@type') == 'Product':
                        product_script = script
                except (json.JSONDecodeError, AttributeError):
                    continue
        
        # If standalone breadcrumb exists, still check and fix URLs if needed
        if has_standalone_breadcrumb:
            # Find and fix the standalone breadcrumb URLs
            for script in breadcrumb_scripts:
                if script.string:
                    try:
                        data = json.loads(script.string)
                        if isinstance(data, dict) and data.get('@type') == 'BreadcrumbList' and '@context' in data:
                            items = data.get('itemListElement', [])
                            fixed = False
                            for item in items:
                                item_url = item.get('item', '')
                                if item_url and not item_url.endswith('.html') and not item_url.endswith('/'):
                                    if '/scania/' in item_url or '/volvo/' in item_url:
                                        if '?' in item_url:
                                            base, query = item_url.split('?', 1)
                                            item['item'] = base + '.html?' + query
                                        else:
                                            item['item'] = item_url + '.html'
                                        fixed = True
                            if fixed:
                                script.string = json.dumps(data, indent=4)
                                with open(filepath, 'w', encoding='utf-8') as f:
                                    f.write(str(soup))
                                return True
                    except (json.JSONDecodeError, AttributeError, KeyError):
                        continue
            return False
        
        # Extract breadcrumb from Product schema and create standalone
        if product_script and product_script.string:
            try:
                product_data = json.loads(product_script.string)
                breadcrumb = product_data.get('breadcrumb')
                
                if isinstance(breadcrumb, dict) and breadcrumb.get('@type') == 'BreadcrumbList':
                    # Fix breadcrumb URLs to include .html extension
                    items = breadcrumb.get('itemListElement', [])
                    for item in items:
                        item_url = item.get('item', '')
                        # If URL doesn't end with .html and is a product page URL, add .html
                        if item_url and not item_url.endswith('.html') and not item_url.endswith('/'):
                            # Check if it's a product page URL (contains /scania/ or /volvo/ with part number)
                            if '/scania/' in item_url or '/volvo/' in item_url:
                                # Extract the path and add .html
                                if '?' in item_url:
                                    base, query = item_url.split('?', 1)
                                    item['item'] = base + '.html?' + query
                                else:
                                    item['item'] = item_url + '.html'
                    
                    # Create standalone BreadcrumbList schema
                    standalone_breadcrumb = {
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        'itemListElement': items
                    }
                    
                    # Create new script tag
                    breadcrumb_script = soup.new_tag('script', type='application/ld+json')
                    breadcrumb_script.string = json.dumps(standalone_breadcrumb, indent=4)
                    
                    # Insert after the Product schema script
                    product_script.insert_after(breadcrumb_script)
                    
                    # Write back to file
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(str(soup))
                    
                    return True
            except (json.JSONDecodeError, AttributeError, KeyError) as e:
                print(f"Error processing {filepath}: {e}")
                return False
        
        return False
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False

def main():
    """Fix breadcrumb schemas in all product pages."""
    # Get script directory and go up to project root
    script_dir = Path(__file__).parent
    base_path = script_dir.parent
    
    # Find all product HTML files in scania and volvo directories
    product_dirs = []
    for brand in ['scania', 'volvo']:
        brand_path = base_path / brand
        if brand_path.exists():
            # Get all subdirectories
            for subdir in brand_path.iterdir():
                if subdir.is_dir() and (subdir / 'index.html').exists() == False:  # Skip if it's not a category page
                    product_dirs.append(subdir)
    
    # Also explicitly add known directories
    known_dirs = [
        base_path / 'scania' / 'engine',
        base_path / 'scania' / 'transmission',
        base_path / 'scania' / 'suspension',
        base_path / 'scania' / 'hydraulics',
        base_path / 'scania' / 'misc',
        base_path / 'volvo' / 'engine',
        base_path / 'volvo' / 'transmission',
        base_path / 'volvo' / 'suspension',
        base_path / 'volvo' / 'hydraulics',
        base_path / 'volvo' / 'misc',
    ]
    for known_dir in known_dirs:
        if known_dir.exists() and known_dir not in product_dirs:
            product_dirs.append(known_dir)
    
    total_fixed = 0
    total_processed = 0
    
    for product_dir in product_dirs:
        if not product_dir.exists():
            continue
        
        html_files = list(product_dir.glob('*.html'))
        print(f"Processing {len(html_files)} files in {product_dir}...")
        
        for html_file in html_files:
            total_processed += 1
            if fix_breadcrumb_schema(html_file):
                total_fixed += 1
                if total_fixed % 100 == 0:
                    print(f"  Fixed {total_fixed} files so far...")
    
    print(f"\n✅ Complete!")
    print(f"   Processed: {total_processed} files")
    print(f"   Fixed: {total_fixed} files")
    print(f"   Already had standalone breadcrumb: {total_processed - total_fixed} files")

if __name__ == '__main__':
    main()

