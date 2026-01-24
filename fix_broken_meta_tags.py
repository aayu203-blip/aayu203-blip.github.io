#!/usr/bin/env python3
"""
Fix corrupted meta description tags that are causing JSON parsing errors
"""

import re
from pathlib import Path

def fix_meta_description(filepath):
    """Fix broken meta description tags"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Find and fix malformed meta description tags
        # Pattern: meta tags with broken attributes like (part="" +91-98210-37990=""
        pattern = r'<meta\s+(?:.*?)\s*content="[^"]*\(part=""[^>]*>'
        
        if re.search(pattern, content):
            # Get part number from filename
            part_num = filepath.stem
            
            # Get brand from path
            brand = "Scania" if "scania" in str(filepath).lower() else "Volvo"
            
            # Create proper meta description
            proper_description = f'{brand} Heavy Equipment Spare Part {part_num} | OEM Quality | In Stock India | Fast Shipping | Call/WhatsApp: +91-98210-37990'
            
            # Replace the broken meta tag
            content = re.sub(
                r'<meta\s+[^>]*content="[^"]*\(part=""[^>]*>',
                f'<meta name="description" content="{proper_description}"/>',
                content
            )
            
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
    print("FIXING CORRUPTED META TAGS")
    print("="*70)
    
    # Files with known JSON errors
    problem_files = [
        "scania/misc/7037560.html",
        "volvo/engine/1104545.html",
        "volvo/engine/1104544.html",
        "volvo/engine/2413459.html",
    ]
    
    base_path = Path(".")
    fixed_count = 0
    
    for file_path in problem_files:
        full_path = base_path / file_path
        if full_path.exists():
            print(f"Checking {file_path}...")
            if fix_meta_description(full_path):
                fixed_count += 1
                print(f"   ✓ Fixed meta description")
            else:
                print(f"   - No issues found")
    
    # Also scan all scania and volvo folders for similar issues
    print("\nScanning for more corrupted meta tags...")
    all_files = list(base_path.glob("scania/**/*.html")) + list(base_path.glob("volvo/**/*.html"))
    
    for filepath in all_files:
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'content="' in content and '(part=""' in content:
                if fix_meta_description(filepath):
                    fixed_count += 1
                    print(f"   ✓ Fixed {filepath.name}")
        except:
            pass
    
    print(f"\n✅ Fixed {fixed_count} files with corrupted meta tags\n")

if __name__ == "__main__":
    main()














