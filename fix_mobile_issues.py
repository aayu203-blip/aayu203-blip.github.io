#!/usr/bin/env python3
"""
Script to fix mobile spacing and WhatsApp icon issues
"""

import os
import re
import glob

def fix_mobile_spacing(html_content):
    """Fix excessive spacing between header and body on mobile"""
    # Reduce the padding-top on mobile
    old_spacing = r'body {\s*padding-top: 6rem;\s*}'
    new_spacing = '''body {
            padding-top: 4rem;
        }
        
        @media (max-width: 768px) {
            body {
                padding-top: 3rem;
            }
        }'''
    
    return re.sub(old_spacing, new_spacing, html_content, flags=re.DOTALL)

def fix_whatsapp_icon(html_content):
    """Fix WhatsApp icon to show proper logo instead of green circle"""
    # Replace the complex SVG with a simpler, more reliable WhatsApp icon
    old_whatsapp_svg = r'<svg class="relative w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">\s*<path d="M24 11\.7c0 6\.45-5\.27 11\.68-11\.78 11\.68-2\.07 0-4-\.53-5\.7-1\.45L0 24l2\.13-6\.27a11\.57 11\.57 0 0 1-1\.7-6\.04C\.44 5\.23 5\.72 0 12\.23 0 18\.72 0 24 5\.23 24 11\.7M12\.22 1\.85c-5\.46 0-9\.9 4\.41-9\.9 9\.83 0 2\.15\.7 4\.14 1\.88 5\.76L2\.96 21\.1l3\.8-1\.2a9\.9 9\.9 0 0 0 5\.46 1\.62c5\.46 0 9\.9-4\.4 9\.9-9\.83a9\.88 9\.88 0 0 0-9\.9-9\.83m5\.95 12\.52c-\.08-\.12-\.27-\.19-\.56-\.33-\.28-\.14-1\.7-\.84-1\.97-\.93-\.26-\.1-\.46-\.15-\.65\.14-\.2\.29-\.75\.93-\.91 1\.12-\.17\.2-\.34\.22-\.63\.08-\.29-\.15-1\.22-\.45-2\.32-1\.43a8\.64 8\.64 0 0 1-1\.6-1\.98c-\.18-\.29-\.03-\.44\.12-\.58\.13-\.13\.29-\.34\.43-\.5\.15-\.17\.2-\.3\.29-\.48\.1-\.2\.05-\.36-\.02-\.5-\.08-\.15-\.65-1\.56-\.9-2\.13-\.24-\.58-\.48-\.48-\.65-\.48-\.17 0-\.37-\.03-\.56-\.03-\.2 0-\.5\.08-\.77\.36-\.26\.29-1 \.98-1 2\.4 0 1\.4 1\.03 2\.76 1\.17 2\.96\.14\.19 2 3\.17 4\.93 4\.32 2\.94 1\.15 2\.94\.77 3\.47\.72\.53-\.05 1\.7-\.7 1\.95-1\.36\.24-\.67\.24-1\.25\.17-1\.37"></path>\s*</svg>'
    
    new_whatsapp_svg = '''<svg class="relative w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>'''
    
    return re.sub(old_whatsapp_svg, new_whatsapp_svg, html_content, flags=re.DOTALL)

def process_product_file(file_path):
    """Process a single product file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix mobile spacing
        content = fix_mobile_spacing(content)
        
        # Fix WhatsApp icon
        content = fix_whatsapp_icon(content)
        
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
