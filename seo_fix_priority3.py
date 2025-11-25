#!/usr/bin/env python3
"""
PRIORITY 3 SEO FIXES
11. Add visible breadcrumbs to product pages
12. Improve meta descriptions (remove excessive checkmarks, make natural)
13. Add internal links to category pages
"""

import re
from pathlib import Path

# Breadcrumb HTML template
BREADCRUMB_HTML = '''<!-- Breadcrumb Navigation -->
<nav class="mb-6" aria-label="Breadcrumb">
<ol class="flex items-center space-x-2 text-sm text-gray-600">
<li><a href="/" class="hover:text-yellow-600 transition-colors flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>Home</a></li>
<li><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></li>
<li><a href="/{brand_url}" class="hover:text-yellow-600 transition-colors">{brand}</a></li>
<li><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></li>
<li><a href="/pages/categories/{brand_lower}-{category_slug}.html" class="hover:text-yellow-600 transition-colors">{category}</a></li>
<li><svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></li>
<li class="text-yellow-600 font-semibold">{part_no}</li>
</ol>
</nav>'''

def fix_priority3_seo():
    """Apply Priority 3 SEO fixes"""
    
    base_dir = Path(__file__).parent
    count = 0
    breadcrumbs_added = 0
    descriptions_improved = 0
    
    for html_file in list(base_dir.glob('volvo/**/*.html')) + list(base_dir.glob('scania/**/*.html')):
        try:
            content = html_file.read_text(encoding='utf-8')
            original_content = content
            
            part_no = html_file.stem
            brand = 'Volvo' if 'volvo' in str(html_file) else 'Scania'
            brand_lower = brand.lower()
            brand_url = f"pages/{brand_lower}-categories.html"
            
            # Get category from path
            category_slug_path = html_file.parent.name
            category_map = {
                'engine': ('Engine Components', 'engine-components'),
                'braking': ('Braking System Components', 'braking-system-components'),
                'suspension': ('Steering & Suspension Parts', 'steering-and-suspension-parts'),
                'transmission': ('Transmission & Differential Components', 'transmission-and-differential-components'),
                'filtration': ('Air & Fluid Filtration Systems', 'air-and-fluid-filtration-systems'),
                'fuel': ('Fuel System Components', 'fuel-system-components'),
                'exterior': ('Lighting & Exterior Body Components', 'lighting-and-exterior-body-components'),
                'hydraulics': ('Hydraulic Systems & Connectors', 'hydraulic-systems-and-connectors'),
                'hardware': ('Fasteners, Hardware & Accessories', 'fasteners-hardware-accessories'),
                'misc': ('Miscellaneous', 'miscellaneous-parts')
            }
            category_name, category_slug = category_map.get(category_slug_path, ('Spare Parts', 'spare-parts'))
            
            # 11. Add visible breadcrumbs if not present
            if 'Breadcrumb Navigation' not in content and '<div class="flex items-center gap-3 mb-6">' in content:
                breadcrumb = BREADCRUMB_HTML.format(
                    brand=brand,
                    brand_url=brand_url,
                    brand_lower=brand_lower,
                    category=category_name,
                    category_slug=category_slug,
                    part_no=part_no
                )
                # Add before the badges
                content = re.sub(
                    r'(<div class="flex items-center gap-3 mb-6">)',
                    breadcrumb + '\n\\1',
                    content,
                    count=1
                )
                breadcrumbs_added += 1
            
            # 12. Improve meta description (remove excessive checkmarks)
            desc_match = re.search(r'<meta content="(✓[^"]+)" name="description"/>', content)
            if desc_match:
                old_desc = desc_match.group(1)
                # Count checkmarks
                checkmark_count = old_desc.count('✓')
                if checkmark_count > 3:
                    # Make it more natural
                    # Extract key info
                    new_desc = old_desc.replace('✓ ', '').replace(' ✓', ',')
                    # Clean up
                    new_desc = re.sub(r'\s+', ' ', new_desc).strip()
                    # Restructure naturally
                    if part_no.startswith('APV'):
                        new_desc = f"Dayco {brand} spare part {part_no}. OEM quality, ready stock, fast shipping across India. 70+ years trusted supplier in Mumbai. WhatsApp: +91-98210-37990"
                    else:
                        new_desc = f"{brand} spare part {part_no}. OEM quality, ready stock, fast shipping across India. Trusted supplier in Mumbai. WhatsApp: +91-98210-37990"
                    
                    content = content.replace(
                        f'<meta content="{old_desc}" name="description"/>',
                        f'<meta content="{new_desc}" name="description"/>'
                    )
                    descriptions_improved += 1
            
            # Save if changed
            if content != original_content:
                html_file.write_text(content, encoding='utf-8')
                count += 1
                
                if count % 500 == 0:
                    print(f"Processed {count} files...")
                    
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    print(f"\n✅ Priority 3 SEO fixes applied to {count} files!")
    print(f"  - Visible breadcrumbs added: {breadcrumbs_added} files")
    print(f"  - Meta descriptions improved: {descriptions_improved} files")

if __name__ == '__main__':
    fix_priority3_seo()











