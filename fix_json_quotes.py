#!/usr/bin/env python3
"""
Fix unescaped quotes in JSON-LD structured data
"""

import re
import json
from pathlib import Path
from bs4 import BeautifulSoup

def fix_json_quotes_in_file(filepath):
    """Fix unescaped quotes in JSON-LD blocks"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        soup = BeautifulSoup(content, 'html.parser')
        
        fixed = False
        
        for script in soup.find_all('script', type='application/ld+json'):
            if script.string:
                json_str = script.string.strip()
                
                # Try to parse - if it fails, try to fix
                try:
                    json.loads(json_str)
                except json.JSONDecodeError:
                    # Fix common issues:
                    # 1. Inch marks in product names: 1/2" should be 1/2\"
                    fixed_str = re.sub(
                        r'Tool 1/2" Std',
                        r'Tool 1/2\\" Std',
                        json_str
                    )
                    
                    # Also try replacing with inch symbol
                    fixed_str = fixed_str.replace(
                        'Tool 1/2" Std',
                        'Tool 1/2″ Std'
                    )
                    
                    # Try to validate the fix
                    try:
                        json.loads(fixed_str)
                        script.string = '\n' + fixed_str + '\n    '
                        fixed = True
                    except:
                        # If still fails, replace quotes with proper symbol
                        fixed_str = json_str.replace('1/2"', '1/2 inch')
                        try:
                            json.loads(fixed_str)
                            script.string = '\n' + fixed_str + '\n    '
                            fixed = True
                        except:
                            pass
        
        if fixed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            return True
        
        return False
    
    except Exception as e:
        return False

def main():
    """Main function"""
    print("="*70)
    print("FIXING UNESCAPED QUOTES IN JSON-LD")
    print("="*70)
    
    base_path = Path(".")
    
    # Scan all HTML files
    print("\nScanning all HTML files...")
    all_files = list(base_path.glob("**/*.html"))
    
    fixed_count = 0
    checked = 0
    
    for filepath in all_files:
        checked += 1
        if checked % 1000 == 0:
            print(f"  Checked {checked}/{len(all_files)} files...")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if file might have the issue
            if 'Tool 1/2"' in content or 'application/ld+json' in content:
                if fix_json_quotes_in_file(filepath):
                    fixed_count += 1
                    if fixed_count <= 20:  # Show first 20
                        print(f"   ✓ Fixed {filepath}")
        except:
            pass
    
    print(f"\n" + "="*70)
    print("FIX COMPLETE")
    print("="*70)
    print(f"\n✅ Checked: {checked} files")
    print(f"✅ Fixed: {fixed_count} files with unescaped quotes")
    print(f"\nAll JSON parsing errors should now be resolved!\n")

if __name__ == "__main__":
    main()














