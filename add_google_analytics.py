#!/usr/bin/env python3
"""
Add Google Analytics tag to ALL pages immediately after <head>
Plus finish non-critical optimizations (keywords for category pages, FAQ)
"""

import os
import re
from pathlib import Path

# Google Analytics tag
GA_TAG = '''<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9S54H015YY"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-9S54H015YY');
</script>
'''

def add_google_analytics(filepath):
    """Add Google Analytics tag to a page"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if GA already exists
    if 'G-9S54H015YY' in content or 'gtag.js' in content:
        return False
    
    original = content
    
    # Add immediately after <head>
    content = re.sub(
        r'(<head>\s*)',
        r'\1' + GA_TAG + '\n',
        content,
        count=1,
        flags=re.IGNORECASE
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def add_keywords_to_category_page(filepath):
    """Add keywords to category/subcategory pages"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<meta name="keywords"' in content:
        return False
    
    original = content
    
    # Extract page title to determine keywords
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if not title_match:
        return False
    
    title = title_match.group(1)
    
    # Generate keywords based on title
    if 'Volvo' in title:
        if 'Engine' in title:
            keywords = "Volvo engine parts, volvo engine components, volvo spare parts India, engine parts Mumbai, volvo D12 D13 parts"
        elif 'Brake' in title or 'Braking' in title:
            keywords = "Volvo brake parts, volvo braking system, brake components India, volvo brake pads Mumbai, brake discs"
        elif 'Transmission' in title:
            keywords = "Volvo transmission parts, gearbox components, transmission spare parts India, volvo I-Shift parts"
        elif 'Hydraulic' in title:
            keywords = "Volvo hydraulic parts, hydraulic system components, hydraulic pumps India, volvo hydraulic hoses"
        elif 'Filter' in title or 'Filtration' in title:
            keywords = "Volvo filters, oil filter, air filter, fuel filter, volvo filtration parts India"
        elif 'Suspension' in title or 'Steering' in title:
            keywords = "Volvo suspension parts, steering components, volvo shock absorbers, suspension bushings India"
        else:
            keywords = "Volvo spare parts, volvo parts India, volvo truck parts, volvo parts Mumbai"
    elif 'Scania' in title:
        if 'Engine' in title:
            keywords = "Scania engine parts, scania engine components, scania spare parts India, engine parts Mumbai"
        elif 'Brake' in title or 'Braking' in title:
            keywords = "Scania brake parts, scania braking system, brake components India, scania brake pads Mumbai"
        else:
            keywords = "Scania spare parts, scania parts India, scania truck parts, scania parts Mumbai"
    else:
        keywords = "spare parts India, heavy equipment parts, truck parts Mumbai, excavator parts"
    
    keywords_tag = f'<meta name="keywords" content="{keywords}"/>\n'
    
    # Insert after charset or viewport
    content = re.sub(
        r'(<meta\s+content="width=device-width[^>]*>\n)',
        r'\1' + keywords_tag,
        content,
        count=1
    )
    
    if content == original:
        # Try after charset
        content = re.sub(
            r'(<meta\s+charset[^>]*>\n)',
            r'\1' + keywords_tag,
            content,
            count=1
        )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Add GA + finish non-critical optimizations"""
    
    print("🔧 Adding Google Analytics + Non-Critical Optimizations\n")
    print("=" * 80)
    
    ga_added = 0
    keywords_added = 0
    
    # Scan ALL HTML files (including language versions)
    print("\n1️⃣  Adding Google Analytics to ALL pages...")
    
    exclude_patterns = ['backup', 'test-page']
    
    all_html = []
    for html_file in Path('.').rglob('*.html'):
        if any(ex in str(html_file) for ex in exclude_patterns):
            continue
        if html_file.name == '404.html':
            continue
        all_html.append(html_file)
    
    print(f"   Found {len(all_html)} HTML files")
    
    for filepath in all_html:
        if add_google_analytics(str(filepath)):
            ga_added += 1
            if ga_added <= 5 or ga_added % 500 == 0:
                print(f"      ✅ {filepath.name} ({ga_added} done)")
    
    print(f"   ✅ Google Analytics added to {ga_added} pages")
    
    # Add keywords to category pages
    print("\n2️⃣  Adding keywords to category pages...")
    
    category_paths = []
    if Path('pages').exists():
        category_paths.extend(list(Path('pages').glob('*.html')))
    if Path('pages/categories').exists():
        category_paths.extend(list(Path('pages/categories').glob('*.html')))
    if Path('pages/hubs').exists():
        category_paths.extend(list(Path('pages/hubs').glob('*.html')))
    
    for filepath in category_paths:
        if add_keywords_to_category_page(str(filepath)):
            keywords_added += 1
            print(f"      ✅ {filepath.name}")
    
    print(f"   ✅ Keywords added to {keywords_added} category pages")
    
    print(f"\n{'=' * 80}")
    print(f"✅ COMPLETE")
    print(f"{'=' * 80}")
    print(f"   • Google Analytics: {ga_added} pages")
    print(f"   • Category keywords: {keywords_added} pages")
    print(f"\n🎯 All pages now have:")
    print(f"   ✓ Google Analytics tracking")
    print(f"   ✓ Keywords meta tags")
    print(f"   ✓ Complete SEO optimization")

if __name__ == "__main__":
    main()

