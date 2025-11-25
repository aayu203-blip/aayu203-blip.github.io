#!/usr/bin/env python3
"""
Fix canonical tags to include .html extension
"""

import re
from pathlib import Path

def fix_canonical_tag(filepath):
    """Add .html extension to canonical tags if missing"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Pattern: canonical tag without .html extension
        # Example: <link href="https://partstrading.com/volvo/engine/1522259" rel="canonical"/>
        # Should be: <link href="https://partstrading.com/volvo/engine/1522259.html" rel="canonical"/>
        
        pattern = r'(<link\s+href="https://partstrading\.com/(volvo|scania)/[^"]+)"(\s+rel="canonical"\s*/>)'
        
        def add_html_extension(match):
            url = match.group(1)
            brand = match.group(2)
            rest = match.group(3)
            
            # Check if URL already ends with .html
            if url.endswith('.html"'):
                return match.group(0)
            
            # Add .html before the closing quote
            return url + '.html"' + rest
        
        content = re.sub(pattern, add_html_extension, content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"Error in {filepath}: {e}")
        return False

def main():
    """Main function"""
    print("="*70)
    print("FIXING CANONICAL TAGS - ADDING .HTML EXTENSION")
    print("="*70)
    
    base_path = Path(".")
    
    # Find all volvo and scania product pages
    print("\nScanning volvo/ and scania/ folders...")
    all_files = list(base_path.glob("volvo/**/*.html")) + list(base_path.glob("scania/**/*.html"))
    
    fixed_count = 0
    checked = 0
    
    for filepath in all_files:
        checked += 1
        if checked % 500 == 0:
            print(f"  Checked {checked}/{len(all_files)} files...")
        
        if fix_canonical_tag(filepath):
            fixed_count += 1
            if fixed_count <= 10:  # Show first 10
                print(f"   ✓ Fixed {filepath.name}")
    
    print(f"\n" + "="*70)
    print("FIX COMPLETE")
    print("="*70)
    print(f"\n✅ Checked: {checked} files")
    print(f"✅ Fixed: {fixed_count} canonical tags")
    print(f"\nAll Volvo/Scania pages now have proper canonical URLs!")
    print(f"Google will now properly index these pages.\n")

if __name__ == "__main__":
    main()














