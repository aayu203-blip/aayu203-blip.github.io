#!/usr/bin/env python3
"""
Fix all corrupted meta tags that cause JSON parsing errors
"""

import re
from pathlib import Path

def fix_corrupted_file(filepath):
    """Fix all corrupted meta tags in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Get part number from filename
        part_num = filepath.stem
        
        # Get brand from path
        if "scania" in str(filepath).lower():
            brand = "Scania"
        elif "volvo" in str(filepath).lower():
            brand = "Volvo"
        else:
            brand = "Heavy Equipment"
        
        # Fix pattern 1: Corrupted meta description
        pattern1 = r'<meta\s+\(part=""[^>]*name="description"[^>]*>'
        if re.search(pattern1, content):
            desc = f'{brand} Heavy Equipment Spare Part {part_num} | OEM Quality | In Stock India | Fast Shipping | Call/WhatsApp: +91-98210-37990'
            content = re.sub(pattern1, f'<meta name="description" content="{desc}"/>', content)
        
        # Fix pattern 2: Corrupted og:description
        pattern2 = r'<meta\s+&=""[^>]*property="og:description"[^>]*>'
        if re.search(pattern2, content):
            desc = f'{brand} Heavy Equipment Spare Part {part_num} | OEM Quality | In Stock India | Fast Shipping'
            content = re.sub(pattern2, f'<meta property="og:description" content="{desc}"/>', content)
        
        # Fix pattern 3: Corrupted twitter:description
        pattern3 = r'<meta\s+&=""[^>]*property="twitter:description"[^>]*>'
        if re.search(pattern3, content):
            desc = f'{brand} Heavy Equipment Spare Part {part_num} | OEM Quality | In Stock India | Fast Shipping'
            content = re.sub(pattern3, f'<meta property="twitter:description" content="{desc}"/>', content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        return False

def main():
    """Main function"""
    print("="*70)
    print("FIXING ALL CORRUPTED META TAGS")
    print("="*70)
    
    base_path = Path(".")
    
    # Scan all HTML files for corrupted meta tags
    print("\nScanning volvo/ and scania/ folders...")
    all_files = list(base_path.glob("volvo/**/*.html")) + list(base_path.glob("scania/**/*.html"))
    
    fixed_count = 0
    checked = 0
    
    for filepath in all_files:
        checked += 1
        if checked % 500 == 0:
            print(f"  Checked {checked}/{len(all_files)} files...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file has corrupted meta tags
            if '(part=""' in content or '&=""' in content:
                if fix_corrupted_file(filepath):
                    fixed_count += 1
                    if fixed_count <= 10:  # Show first 10
                        print(f"   ✓ Fixed {filepath.name}")
        except:
            pass
    
    print(f"\n" + "="*70)
    print("FIX COMPLETE")
    print("="*70)
    print(f"\n✅ Checked: {checked} files")
    print(f"✅ Fixed: {fixed_count} files with corrupted meta tags")
    print(f"\nAll JSON parsing errors should now be resolved!\n")

if __name__ == "__main__":
    main()














