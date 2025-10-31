#!/usr/bin/env python3
"""
Update logo size to h-24 (96px) on all pages and replace text-based logos with PTC logo image
"""

import os
import re
import glob
from pathlib import Path

def update_logo_size(filepath):
    """Update logo size in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern 1: Replace text-based logo with PTC logo image
        text_logo_pattern = r'(<span[^>]*id="nav-logo"[^>]*>)[^<]+(</span>)'
        text_logo_replacement = r'\1<img src="/assets/images/ptc-logo.png?v=1" alt="PTC Parts Trading Company" class="h-24 w-auto transition-all duration-300" id="nav-logo">\2'
        
        # Pattern 2: Update existing PTC logo size
        img_logo_pattern = r'(<img[^>]*src="[^"]*ptc-logo[^"]*"[^>]*class="[^"]*)h-\d+([^"]*"[^>]*>)'
        img_logo_replacement = r'\1h-24\2'
        
        # Pattern 3: Update any logo size
        general_logo_pattern = r'(<img[^>]*src="[^"]*logo[^"]*"[^>]*class="[^"]*)h-\d+([^"]*"[^>]*>)'
        general_logo_replacement = r'\1h-24\2'
        
        # Apply replacements
        new_content = re.sub(text_logo_pattern, text_logo_replacement, content, flags=re.IGNORECASE)
        new_content = re.sub(img_logo_pattern, img_logo_replacement, new_content, flags=re.IGNORECASE)
        new_content = re.sub(general_logo_pattern, general_logo_replacement, new_content, flags=re.IGNORECASE)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to update all pages"""
    print("🔧 Updating logo size to h-24 (96px) and replacing text-based logos on all pages...")
    
    # Find all HTML files
    html_files = []
    html_files.extend(glob.glob("*.html"))
    html_files.extend(glob.glob("pages/**/*.html"))
    
    if not html_files:
        print("❌ No HTML files found")
        return
    
    print(f"📁 Found {len(html_files)} HTML files")
    
    updated_count = 0
    error_count = 0
    
    for filepath in html_files:
        try:
            if update_logo_size(filepath):
                updated_count += 1
                print(f"✅ Updated: {filepath}")
            else:
                print(f"ℹ️  No changes needed: {filepath}")
        except Exception as e:
            error_count += 1
            print(f"❌ Error processing {filepath}: {e}")
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Updated: {updated_count} files")
    print(f"   ❌ Errors: {error_count} files")
    print(f"   📁 Total: {len(html_files)} files")
    
    if updated_count > 0:
        print(f"\n🎉 Successfully updated {updated_count} pages!")
        print("   All logos now set to h-24 (96px) size and text-based logos replaced with PTC logo image")

if __name__ == "__main__":
    main()
