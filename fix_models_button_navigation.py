#!/usr/bin/env python3
"""
Fix MODELS button navigation on Volvo/Scania product pages
The button was redirecting to ../index.html instead of ../../index.html
"""

import re
from pathlib import Path

def fix_models_button(filepath):
    """Fix the MODELS button navigation path"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix the MODELS button href from ../index.html to ../../index.html
        # This is needed because product pages are at /brand/category/partnum.html
        # So they need to go up TWO levels to reach the homepage
        
        content = content.replace(
            'href="../index.html#equipment-models"',
            'href="../../index.html#equipment-models"'
        )
        
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
    print("FIXING MODELS BUTTON NAVIGATION")
    print("="*70)
    
    base_path = Path(".")
    
    # Find all Volvo and Scania product pages
    print("\nScanning volvo/ and scania/ folders...")
    all_files = list(base_path.glob("volvo/**/*.html")) + list(base_path.glob("scania/**/*.html"))
    
    fixed_count = 0
    checked = 0
    
    for filepath in all_files:
        checked += 1
        if checked % 500 == 0:
            print(f"  Checked {checked}/{len(all_files)} files...")
        
        if fix_models_button(filepath):
            fixed_count += 1
            if fixed_count <= 10:  # Show first 10
                print(f"   ✓ Fixed {filepath.name}")
    
    print(f"\n" + "="*70)
    print("FIX COMPLETE")
    print("="*70)
    print(f"\n✅ Checked: {checked} files")
    print(f"✅ Fixed: {fixed_count} files")
    print(f"\nMODELS button now correctly navigates to homepage!\n")

if __name__ == "__main__":
    main()














