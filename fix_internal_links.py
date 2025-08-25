#!/usr/bin/env python3
"""
Fix internal links in all international product pages to point to correct paths.
"""

import os
import glob
import re

def fix_internal_links(file_path):
    """Fix internal links in a single product page."""
    
    print(f"Fixing internal links: {file_path}")
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix navigation links - should point to language-specific homepage
    # From: href="../../index.html" 
    # To: href="../../../index.html"
    content = re.sub(r'href="\.\./\.\./index\.html"', 'href="../../../index.html"', content)
    
    # Fix navigation links with anchor tags
    # From: href="../../index.html#home"
    # To: href="../../../index.html#home"
    content = re.sub(r'href="\.\./\.\./index\.html#', 'href="../../../index.html#', content)
    
    # Fix breadcrumb links - should point to language-specific pages
    # From: href="../volvo-categories.html"
    # To: href="../volvo-categories.html" (this is correct)
    
    # Fix category links - should point to language-specific category pages
    # From: href="../categories/volvo-engine-components.html"
    # To: href="../categories/volvo-engine-components.html" (this is correct)
    
    # Fix CSS links - should point to correct CSS path
    # From: href="../../../assets/css/styles.css"
    # To: href="../../../assets/css/styles.css" (this is correct)
    
    # Write the fixed content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Fixed internal links successfully!")
    return True

def main():
    """Main function to fix internal links in all international product pages."""
    
    # Get the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Language directories
    languages = ['ru', 'fr', 'cn', 'ar', 'es', 'kn', 'ta', 'ml', 'te', 'hi', 'id']
    
    total_fixed = 0
    
    for lang in languages:
        lang_dir = os.path.join(base_dir, lang, 'pages', 'products')
        
        if not os.path.exists(lang_dir):
            print(f"Language directory not found: {lang_dir}")
            continue
        
        print(f"\nProcessing {lang.upper()} product pages...")
        
        # Get all HTML files in the language's product directory
        html_files = glob.glob(os.path.join(lang_dir, '*.html'))
        
        if not html_files:
            print(f"  No HTML files found in {lang_dir}")
            continue
        
        lang_fixed = 0
        for html_file in html_files:
            if fix_internal_links(html_file):
                lang_fixed += 1
        
        print(f"  Fixed {lang_fixed} out of {len(html_files)} files for {lang.upper()}")
        total_fixed += lang_fixed
    
    print(f"\nTotal files fixed: {total_fixed}")
    print("All internal links have been updated to point to correct paths!")

if __name__ == "__main__":
    main()
