#!/usr/bin/env python3
import os
import subprocess

def restore_english_product_pages():
    # Get all product HTML files
    product_files = []
    for root, dirs, files in os.walk('pages/products'):
        for file in files:
            if file.endswith('.html'):
                product_files.append(os.path.join(root, file))
    
    print(f"Found {len(product_files)} product files to restore")
    
    # Restore each product file to English version
    for product_file in product_files:
        print(f"Restoring: {product_file}")
        try:
            # Use git checkout to restore the English version
            result = subprocess.run(['git', 'checkout', 'e3a2c318e', '--', product_file], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Restored: {product_file}")
            else:
                print(f"❌ Failed to restore: {product_file}")
                print(f"Error: {result.stderr}")
        except Exception as e:
            print(f"❌ Error restoring {product_file}: {e}")
    
    print("✅ All product pages restored to English!")

if __name__ == "__main__":
    restore_english_product_pages()






