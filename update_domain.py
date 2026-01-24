#!/usr/bin/env python3
"""
Script to update all domain references from partstradingcompany.com to partstrading.com
"""

import os
import re
import glob

def update_domain_references(file_path):
    """Update domain references in a single file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace all instances of the old domain with the new domain
        old_domain = "partstradingcompany.com"
        new_domain = "partstrading.com"
        
        # Count replacements
        old_count = content.count(old_domain)
        
        if old_count > 0:
            # Replace the domain
            content = content.replace(old_domain, new_domain)
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Updated {old_count} references in {file_path}")
        else:
            print(f"  No changes needed in {file_path}")
            
    except Exception as e:
        print(f"✗ Error processing {file_path}: {e}")

def main():
    """Main function to process all HTML files"""
    # Find all HTML files
    html_files = glob.glob('**/*.html', recursive=True)
    
    print(f"Found {len(html_files)} HTML files to process")
    print("=" * 60)
    
    total_updates = 0
    
    for file_path in html_files:
        update_domain_references(file_path)
    
    print("=" * 60)
    print("Domain update complete!")
    print("All references to 'partstradingcompany.com' have been changed to 'partstrading.com'")

if __name__ == "__main__":
    main()
