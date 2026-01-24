#!/usr/bin/env python3
"""
PRIORITY 2 SEO FIXES
6. Expand content (70 → 300+ words)
7. Optimize title tags (expand to 50-60 chars)
8. Add manufacturer (Dayco) to schema for APV parts
9. Improve OG tags
10. Remove duplicate Product schemas (keep only 1)
"""

import re
from pathlib import Path

def fix_priority2_seo():
    """Apply Priority 2 SEO fixes"""
    
    base_dir = Path(__file__).parent
    count = 0
    title_optimized = 0
    dayco_manufacturer_added = 0
    og_fixed = 0
    schemas_deduplicated = 0
    
    # Process all product pages
    for html_file in list(base_dir.glob('volvo/**/*.html')) + list(base_dir.glob('scania/**/*.html')):
        try:
            content = html_file.read_text(encoding='utf-8')
            original_content = content
            
            part_no = html_file.stem
            brand = 'Volvo' if 'volvo' in str(html_file) else 'Scania'
            
            # Get category from path
            category_slug = html_file.parent.name
            category_map = {
                'engine': 'Engine Components',
                'braking': 'Braking System',
                'suspension': 'Steering & Suspension',
                'transmission': 'Transmission & Differential',
                'filtration': 'Air & Fluid Filtration',
                'fuel': 'Fuel System',
                'exterior': 'Lighting & Exterior',
                'hydraulics': 'Hydraulic Systems',
                'hardware': 'Fasteners & Hardware',
                'misc': 'Miscellaneous'
            }
            category = category_map.get(category_slug, 'Spare Parts')
            
            # 7. Optimize title tag (expand to 50-60 chars)
            current_title_match = re.search(r'<title>([^<]+)</title>', content)
            if current_title_match:
                current_title = current_title_match.group(1)
                # If title is too short, expand it
                if len(current_title) < 50:
                    # Extract product description from H1 or structured data
                    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
                    if h1_match:
                        product_name = h1_match.group(1)
                        # Create optimized title
                        new_title = f"{product_name} | {category} | PTC India"
                        if len(new_title) > 60:
                            new_title = f"{brand} {part_no} {category} | PTC India"
                        
                        content = content.replace(
                            f'<title>{current_title}</title>',
                            f'<title>{new_title}</title>'
                        )
                        title_optimized += 1
            
            # 8. Add Dayco manufacturer for APV parts
            if part_no.startswith('APV') and '"manufacturer"' not in content:
                # Add manufacturer after brand in Product schema
                content = re.sub(
                    r'("brand": \{[^}]+\},)',
                    r'\1\n    "manufacturer": {\n        "@type": "Organization",\n        "name": "Dayco"\n    },',
                    content,
                    count=1
                )
                dayco_manufacturer_added += 1
            
            # 9. Fix OG tags (add space in "SuspensionParts", add Dayco to title)
            content = content.replace('SuspensionParts"', 'Suspension Parts"')
            content = content.replace('SuspensionParts', 'Suspension Parts')
            
            # Add Dayco to OG title for APV parts
            if part_no.startswith('APV'):
                content = re.sub(
                    r'(property="og:title"[^>]*>)([^D])(Hd (?:Accessory Tensioner|Idler Pulley))',
                    r'\1Dayco \3',
                    content
                )
                content = re.sub(
                    r'(property="twitter:title"[^>]*>)([^D])(Hd (?:Accessory Tensioner|Idler Pulley))',
                    r'\1Dayco \3',
                    content
                )
                og_fixed += 1
            
            # 10. Remove duplicate Product schemas (keep only first)
            # Find all Product schema blocks
            product_schemas = list(re.finditer(r'\{\s*"@context": "https://schema\.org",\s*"@type": "Product".*?\n\s*\}', content, re.DOTALL))
            if len(product_schemas) > 1:
                # Keep first, remove others
                for i in range(len(product_schemas) - 1, 0, -1):  # Remove from end to start
                    schema_block = product_schemas[i].group(0)
                    # Only remove if it's wrapped in <script type="application/ld+json">
                    schema_with_script = f'<script type="application/ld+json">\n{schema_block}\n</script>'
                    if schema_with_script in content:
                        content = content.replace(schema_with_script, '', 1)
                        schemas_deduplicated += 1
            
            # Save if changed
            if content != original_content:
                html_file.write_text(content, encoding='utf-8')
                count += 1
                
                if count % 500 == 0:
                    print(f"Processed {count} files...")
                    
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Priority 2 SEO fixes applied to {count} files!")
    print(f"  - Titles optimized: {title_optimized} files")
    print(f"  - Dayco manufacturer added: {dayco_manufacturer_added} APV parts")
    print(f"  - OG tags fixed: {og_fixed} files")
    print(f"  - Duplicate schemas removed: {schemas_deduplicated} files")

if __name__ == '__main__':
    fix_priority2_seo()











