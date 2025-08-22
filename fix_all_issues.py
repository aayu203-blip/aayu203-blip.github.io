#!/usr/bin/env python3
"""
Script to fix WhatsApp icon, brand display, and application data
"""

import os
import re
import glob
import json

def fix_whatsapp_icon(html_content):
    """Fix WhatsApp icon to show proper logo"""
    # The correct WhatsApp SVG path from homepage
    correct_whatsapp_svg = '<path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 0 0 5.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 0 0-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43a8.64 8.64 0 0 1-1.6-1.98c-.18-.29-.03-.44.12-.58.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.65-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37"/>'
    
    # Replace any malformed WhatsApp SVG path
    pattern = r'(<svg class="relative w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">\s*<path d=")[^"]*(".*?/>\s*</svg>)'
    replacement = r'\1' + correct_whatsapp_svg + r'\2'
    
    html_content = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    return html_content

def get_product_data(part_number):
    """Get product data from database"""
    try:
        # Load the database
        with open('database/new_partDatabase.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract the partDatabase array
        start = content.find('const partDatabase = [')
        end = content.rfind('];') + 1
        db_content = content[start + 20:end]
        
        # Parse as JSON
        products = json.loads(db_content)
        
        # Find the product
        for product in products:
            if product["Part No"] == part_number:
                return product
        
        return None
    except Exception as e:
        print(f"Error loading database: {e}")
        return None

def fix_brand_and_application(html_content, part_number):
    """Fix brand display and application data"""
    # Get product data from database
    product_data = get_product_data(part_number)
    
    if product_data:
        brand = product_data.get("Brand", "")
        application = product_data.get("Application", "")
        
        # Fix brand display - should only show "Volvo" or "Scania"
        if brand:
            # Replace any existing brand information
            brand_pattern = r'(<p class="text-lg font-semibold text-green-600">Brand: )[^<]*(</p>)'
            brand_replacement = f'\\1{brand}\\2'
            html_content = re.sub(brand_pattern, brand_replacement, html_content)
            
            # If no brand line exists, add it after PTC Number
            if 'Brand:' not in html_content:
                brand_line = f'\n                        <p class="text-lg font-semibold text-green-600">Brand: {brand}</p>'
                html_content = re.sub(
                    r'(<p class="text-lg font-semibold text-blue-600">PTC Number: [^<]*</p>)',
                    r'\1' + brand_line,
                    html_content
                )
        
        # Fix application display
        if application:
            # Replace any existing application information
            app_pattern = r'(<p class="text-gray-600 text-xs"><strong>Application:</strong> )[^<]*(</p>)'
            app_replacement = f'\\1{application}\\2'
            html_content = re.sub(app_pattern, app_replacement, html_content)
            
            # If no application line exists, add it
            if 'Application:' not in html_content:
                app_line = f'\n                                <p class="text-gray-600 text-xs"><strong>Application:</strong> {application}</p>'
                # Find a good place to insert it (after description)
                html_content = re.sub(
                    r'(<p class="text-yellow-600 text-sm mb-3 font-semibold"><strong>[^<]*</strong></p>)',
                    r'\1' + app_line,
                    html_content
                )
    
    return html_content

def process_product_file(file_path):
    """Process a single product file"""
    print(f"Processing: {file_path}")
    
    try:
        # Extract part number from filename
        filename = os.path.basename(file_path)
        part_number = filename.replace('.html', '')
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix WhatsApp icon
        content = fix_whatsapp_icon(content)
        
        # Fix brand and application
        content = fix_brand_and_application(content, part_number)
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Fixed: {file_path}")
        
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

def main():
    """Main function to process all product files"""
    # Find all product HTML files
    product_files = glob.glob('pages/products/*.html')
    
    print(f"Found {len(product_files)} product files to process")
    print("=" * 50)
    
    for file_path in product_files:
        process_product_file(file_path)
    
    print("=" * 50)
    print("Processing complete!")

if __name__ == "__main__":
    main()
