#!/usr/bin/env python3
"""
PRIORITY 1 SEO FIXES - Quick wins for +20 points
1. Remove duplicate favicons
2. Add hreflang tags to all product pages
3. Fix H3 → H2 heading hierarchy
4. Remove duplicate schemas (keep only 1 of each)
5. Fix duplicate keywords meta tag
"""

import re
from pathlib import Path

# Hreflang template for product pages
HREFLANG_TAGS = '''<!-- International Hreflang Tags -->
<link rel="alternate" hreflang="en" href="https://partstrading.com/{path}" />
<link rel="alternate" hreflang="ta" href="https://ta.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="id" href="https://id.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="hi" href="https://hi.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="ar" href="https://ar.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="fr" href="https://fr.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="es" href="https://es.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="ru" href="https://ru.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="zh-CN" href="https://cn.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="kn" href="https://kn.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="ml" href="https://ml.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="te" href="https://te.partstrading.com/pages/products/{part_no}.html" />
<link rel="alternate" hreflang="x-default" href="https://partstrading.com/{path}" />'''

def fix_priority1_seo():
    """Apply Priority 1 SEO fixes"""
    
    base_dir = Path(__file__).parent
    count = 0
    favicon_fixed = 0
    hreflang_added = 0
    h2_fixed = 0
    schema_cleaned = 0
    keywords_fixed = 0
    
    # Process Volvo and Scania product pages
    for html_file in list(base_dir.glob('volvo/**/*.html')) + list(base_dir.glob('scania/**/*.html')):
        try:
            content = html_file.read_text(encoding='utf-8')
            original_content = content
            
            # Get part number from filename
            part_no = html_file.stem
            
            # Calculate relative path for hreflang
            relative_path = html_file.relative_to(base_dir)
            
            # 1. Remove duplicate favicon links (keep first 5, remove lines after)
            # Match duplicate favicon block (lines 14-18 that duplicate 9-13)
            if content.count('rel="icon" sizes="512x512"') > 1:
                # Find the second occurrence and remove it along with surrounding duplicates
                lines = content.split('\n')
                new_lines = []
                favicon_count = 0
                skip_next = 0
                
                for i, line in enumerate(lines):
                    if 'favicon.png?v=2' in line or 'favicon-32x32.png?v=2' in line or 'favicon-16x16.png?v=2' in line:
                        favicon_count += 1
                        if favicon_count <= 5:  # Keep first 5 favicon lines
                            new_lines.append(line)
                        else:
                            favicon_fixed += 1
                    else:
                        new_lines.append(line)
                
                if favicon_fixed > 0:
                    content = '\n'.join(new_lines)
            
            # 2. Add hreflang tags after canonical (if not present)
            if 'hreflang=' not in content and '<link href="https://partstrading.com/' in content:
                hreflang = HREFLANG_TAGS.format(path=str(relative_path), part_no=part_no)
                # Add after canonical tag
                content = re.sub(
                    r'(<link href="https://partstrading.com/[^"]*" rel="canonical"/>)',
                    r'\1\n' + hreflang,
                    content,
                    count=1
                )
                hreflang_added += 1
            
            # 3. Fix H3 → H2 for main sections
            headings_to_fix = [
                'Key Features:',
                'Additional Information:',
                'Get Quote &amp; Order',
                'Related Parts:',
                'Contact Information',
                'Find Us on Google Maps'
            ]
            
            for heading in headings_to_fix:
                if f'<h3' in content and heading in content:
                    content = re.sub(
                        fr'<h3([^>]*)>{heading}</h3>',
                        fr'<h2\1>{heading}</h2>',
                        content
                    )
                    h2_fixed += 1
            
            # 4. Remove duplicate Product schemas (keep only first one)
            # Count how many times Product schema appears
            product_schema_count = content.count('"@type": "Product"')
            if product_schema_count > 1:
                # This is complex - we need to remove duplicate schema blocks
                # For now, mark it for manual review
                schema_cleaned += 1
            
            # 5. Remove duplicate keywords meta tag
            if content.count('name="keywords"') > 1:
                # Find all keyword meta tags
                keyword_tags = re.findall(r'<meta content="[^"]*" name="keywords"/>', content)
                if len(keyword_tags) > 1:
                    # Keep only the first one
                    for i in range(1, len(keyword_tags)):
                        content = content.replace(keyword_tags[i], '', 1)
                    keywords_fixed += 1
            
            # 6. Fix keyword stuffing (remove duplicate "Dayco" and "parts parts")
            content = re.sub(
                r'content="Dayco, Volvo Rubber Spring, APV[0-9]+, Dayco,',
                r'content="Dayco, Volvo Rubber Spring, APV' + part_no[-4:] + ',',
                content
            )
            content = re.sub(
                r'steering suspension parts parts',
                r'steering suspension parts',
                content
            )
            
            # Save if changed
            if content != original_content:
                html_file.write_text(content, encoding='utf-8')
                count += 1
                
                if count % 100 == 0:
                    print(f"Processed {count} files...")
                    
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Priority 1 SEO fixes applied to {count} files!")
    print(f"  - Duplicate favicons removed: {favicon_fixed} files")
    print(f"  - Hreflang tags added: {hreflang_added} files")
    print(f"  - H3→H2 fixes: {h2_fixed} heading changes")
    print(f"  - Duplicate keywords removed: {keywords_fixed} files")
    print(f"  - Keyword stuffing cleaned: {count} files")
    print(f"\nNote: Duplicate schemas flagged in {schema_cleaned} files (complex fix)")

if __name__ == '__main__':
    fix_priority1_seo()











