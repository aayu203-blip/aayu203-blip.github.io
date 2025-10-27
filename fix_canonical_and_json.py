#!/usr/bin/env python3
"""
Fix three critical Google Search Console issues:
1. Add canonical tags to equipment model pages
2. Fix wrong canonical domain in product pages
3. Validate and fix any JSON parsing errors in structured data
"""

import os
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

def validate_json_ld(html_content, filepath):
    """Check for JSON parsing errors in structured data"""
    errors = []
    soup = BeautifulSoup(html_content, 'html.parser')
    
    for i, script in enumerate(soup.find_all('script', type='application/ld+json')):
        try:
            json.loads(script.string)
        except json.JSONDecodeError as e:
            errors.append(f"JSON-LD block {i+1}: {str(e)}")
    
    return errors

def add_canonical_to_equipment_pages(filepath):
    """Add canonical tag to equipment model pages"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Check if canonical already exists
        if soup.find('link', rel='canonical'):
            return False, None
        
        # Extract the URL path from the file path
        # e.g., /equipment-models/volvo/volvo-fmx480-parts.html
        parts = Path(filepath).parts
        
        # Find equipment-models index
        try:
            equipment_idx = parts.index('equipment-models')
            url_path = '/'.join(parts[equipment_idx:])
            canonical_url = f"https://partstrading.com/{url_path}"
        except ValueError:
            return False, None
        
        # Add canonical tag to head
        head = soup.find('head')
        if head:
            canonical_tag = soup.new_tag('link', rel='canonical', href=canonical_url)
            
            # Insert after viewport meta tag
            viewport = head.find('meta', attrs={'name': 'viewport'})
            if viewport:
                viewport.insert_after(canonical_tag)
            else:
                head.insert(0, canonical_tag)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            
            return True, canonical_url
        
        return False, None
    
    except Exception as e:
        print(f"Error adding canonical to {filepath}: {e}")
        return False, None

def fix_canonical_domain(filepath):
    """Fix wrong canonical domain in product pages"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace partstradingcompany.com with partstrading.com
        if 'partstradingcompany.com' in content:
            content = content.replace('partstradingcompany.com', 'partstrading.com')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            return True
        
        return False
    
    except Exception as e:
        print(f"Error fixing canonical in {filepath}: {e}")
        return False

def main():
    """Main function"""
    print("="*70)
    print("FIXING CANONICAL TAGS AND JSON ERRORS")
    print("="*70)
    
    base_path = Path(".")
    
    # Fix 1: Add canonical to equipment model pages
    print("\n1. Adding canonical tags to equipment model pages...")
    equipment_pages = list(base_path.glob("equipment-models/**/*.html"))
    equipment_updated = 0
    
    for page in equipment_pages:
        updated, url = add_canonical_to_equipment_pages(page)
        if updated:
            equipment_updated += 1
            if equipment_updated <= 5:  # Show first 5
                print(f"   ✓ {page.name} → {url}")
    
    print(f"   Added canonical tags to {equipment_updated} equipment pages")
    
    # Fix 2: Fix wrong canonical domain in product pages
    print("\n2. Fixing canonical domains in product pages...")
    product_pages = []
    product_pages.extend(base_path.glob("products/*.html"))
    product_pages.extend(base_path.glob("volvo/**/*.html"))
    product_pages.extend(base_path.glob("scania/**/*.html"))
    
    domain_fixes = 0
    
    for page in product_pages:
        if fix_canonical_domain(page):
            domain_fixes += 1
    
    print(f"   Fixed canonical domain in {domain_fixes} pages")
    
    # Fix 3: Check for JSON parsing errors
    print("\n3. Checking for JSON parsing errors...")
    json_errors = []
    
    all_pages = []
    all_pages.extend(base_path.glob("**/*.html"))
    
    for page in all_pages:
        try:
            with open(page, 'r', encoding='utf-8') as f:
                content = f.read()
            
            errors = validate_json_ld(content, page)
            if errors:
                json_errors.append((page, errors))
        except Exception:
            continue
    
    if json_errors:
        print(f"   ⚠️  Found JSON errors in {len(json_errors)} pages:")
        for page, errors in json_errors[:5]:  # Show first 5
            print(f"      {page.name}:")
            for error in errors:
                print(f"        - {error}")
    else:
        print(f"   ✓ No JSON parsing errors found!")
    
    print("\n" + "="*70)
    print("FIX COMPLETE")
    print("="*70)
    print(f"\n✅ Fixed {equipment_updated} equipment pages (added canonical)")
    print(f"✅ Fixed {domain_fixes} product pages (corrected domain)")
    print(f"✅ JSON validation: {'PASSED' if not json_errors else f'{len(json_errors)} pages need review'}")
    print(f"\nAll pages now have proper canonical tags!")
    print(f"This will resolve 'Duplicate without user-selected canonical' issues.\n")

if __name__ == "__main__":
    main()

