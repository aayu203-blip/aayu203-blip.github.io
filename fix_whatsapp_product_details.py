#!/usr/bin/env python3
"""
Fix WhatsApp buttons on all product pages to include product-specific details
"""

import os
import re
import glob
from pathlib import Path

def extract_product_info_from_filename(filepath):
    """Extract product info from the HTML content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract part number from filename
        filename = os.path.basename(filepath)
        part_number = filename.replace('.html', '')
        
        # Extract product details from content
        # Look for the product title
        title_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
        description = title_match.group(1).strip() if title_match else part_number
        
        # Extract brand
        brand_match = re.search(r'Brand</th>\s*<td[^>]*>([^<]+)</td>', content)
        brand = brand_match.group(1).strip() if brand_match else "Unknown"
        
        # Extract category
        category_match = re.search(r'Category</th>\s*<td[^>]*>([^<]+)</td>', content)
        category = category_match.group(1).strip() if category_match else "Unknown"
        
        # Extract application
        application_match = re.search(r'Application</th>\s*<td[^>]*>([^<]+)</td>', content)
        application = application_match.group(1).strip() if application_match else "N/A"
        
        return part_number, description, brand, category, application
        
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None, None, None, None, None

def fix_whatsapp_button(filepath):
    """Fix the WhatsApp button in a product page"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract product info
        part_number, description, brand, category, application = extract_product_info_from_filename(filepath)
        
        if not part_number:
            return False
        
        # Clean up the description (remove extra spaces and special characters)
        description = re.sub(r'\s+', ' ', description).strip()
        
        # Find the floating WhatsApp button
        whatsapp_pattern = r'(<!-- WhatsApp Float Button \(Product Specific\) -->\s*<a[^>]*class="whatsapp-float[^"]*"[^>]*href=")[^"]*("[^>]*>)'
        
        # Create the new onclick attribute
        onclick_attr = f'onclick="requestQuoteOnWhatsApp(\'{part_number}\', \'{description}\', \'{brand}\', \'{category}\', \'{application}\')"'
        
        # Replace the href with javascript:void(0) and add onclick
        replacement = r'\1javascript:void(0);" ' + onclick_attr + r'\2'
        
        # Apply the replacement
        new_content = re.sub(whatsapp_pattern, replacement, content, flags=re.DOTALL)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to fix all product pages"""
    print("🔧 Fixing WhatsApp buttons on all product pages...")
    
    # Find all product HTML files
    product_files = glob.glob("pages/products/*.html")
    
    if not product_files:
        print("❌ No product files found in pages/products/")
        return
    
    print(f"📁 Found {len(product_files)} product files")
    
    fixed_count = 0
    error_count = 0
    
    for filepath in product_files:
        try:
            if fix_whatsapp_button(filepath):
                fixed_count += 1
                print(f"✅ Fixed: {os.path.basename(filepath)}")
            else:
                print(f"ℹ️  No changes needed: {os.path.basename(filepath)}")
        except Exception as e:
            error_count += 1
            print(f"❌ Error processing {os.path.basename(filepath)}: {e}")
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Fixed: {fixed_count} files")
    print(f"   ❌ Errors: {error_count} files")
    print(f"   📁 Total: {len(product_files)} files")
    
    if fixed_count > 0:
        print(f"\n🎉 Successfully updated {fixed_count} product pages!")
        print("   All floating WhatsApp buttons now include product-specific details")

if __name__ == "__main__":
    main()





