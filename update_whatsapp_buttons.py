#!/usr/bin/env python3
import os
import re
import json
from pathlib import Path

def extract_product_info_from_file(file_path):
    """Extract product information from a product page HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract part number from filename
        part_number = Path(file_path).stem
        
        # Extract title from HTML
        title_match = re.search(r'<title>(.*?)</title>', content)
        title = title_match.group(1) if title_match else f"Part {part_number}"
        
        # Extract brand from title or content
        brand = "Unknown"
        if "Volvo" in title:
            brand = "Volvo"
        elif "Scania" in title:
            brand = "Scania"
        elif "Komatsu" in title:
            brand = "Komatsu"
        elif "CAT" in title:
            brand = "CAT"
        elif "Hitachi" in title:
            brand = "Hitachi"
        elif "Kobelco" in title:
            brand = "Kobelco"
        
        # Extract description from title
        description = title.split('|')[0].strip() if '|' in title else title
        
        # Extract category from title
        category = "Unknown"
        if '|' in title:
            parts = title.split('|')
            if len(parts) >= 2:
                category = parts[1].strip()
        
        return {
            'part_number': part_number,
            'title': title,
            'brand': brand,
            'description': description,
            'category': category
        }
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return None

def update_whatsapp_button(file_path, product_info):
    """Update the WhatsApp button in a product page with product-specific information"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create the WhatsApp message
        message = f"Hi! I am interested in {product_info['description']} (Part No: {product_info['part_number']}). Please provide a quote and availability."
        encoded_message = message.replace(' ', '%20').replace('(', '%28').replace(')', '%29')
        
        # Update the floating WhatsApp button
        old_pattern = r'href="https://wa\.me/919821037990"[^>]*>'
        new_href = f'href="https://wa.me/919821037990?text={encoded_message}"'
        
        # Find and replace the WhatsApp button href
        content = re.sub(old_pattern, new_href, content)
        
        # Also update the requestQuoteOnWhatsApp function call if it exists
        old_function_call = r'requestQuoteOnWhatsApp\("[^"]*", "[^"]*", "[^"]*", "[^"]*", "[^"]*"\)'
        new_function_call = f'requestQuoteOnWhatsApp("{product_info["part_number"]}", "{product_info["description"]}", "{product_info["brand"]}", "{product_info["category"]}", "")'
        
        content = re.sub(old_function_call, new_function_call, content)
        
        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Updated {file_path} with product-specific WhatsApp message")
        return True
        
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    """Main function to update all product pages"""
    products_dir = Path("pages/products")
    
    if not products_dir.exists():
        print("Products directory not found!")
        return
    
    # Get all HTML files in the products directory
    product_files = list(products_dir.glob("*.html"))
    
    print(f"Found {len(product_files)} product files")
    
    updated_count = 0
    
    for file_path in product_files:
        print(f"\nProcessing {file_path.name}...")
        
        # Extract product information
        product_info = extract_product_info_from_file(file_path)
        
        if product_info:
            # Update the WhatsApp button
            if update_whatsapp_button(file_path, product_info):
                updated_count += 1
                print(f"✓ Updated {file_path.name}")
                print(f"  Part: {product_info['part_number']}")
                print(f"  Brand: {product_info['brand']}")
                print(f"  Description: {product_info['description']}")
        else:
            print(f"✗ Failed to extract product info from {file_path.name}")
    
    print(f"\n✅ Successfully updated {updated_count} out of {len(product_files)} product files")

if __name__ == "__main__":
    main()

