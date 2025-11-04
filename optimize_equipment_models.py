#!/usr/bin/env python3
"""
Optimize ALL Equipment Model Pages (BEML, CAT, Komatsu, Volvo, Scania, etc.)
Equipment-specific SEO optimization
"""

import os
import re
from pathlib import Path

# Equipment-specific FAQ
EQUIPMENT_FAQ = [
    {
        'q': 'What parts are available for this equipment?',
        'a': 'We stock a comprehensive range including engine components, hydraulic parts, undercarriage, filters, electrical components, and wear parts. Contact us for specific part requirements.'
    },
    {
        'q': 'Do you ship equipment parts internationally?',
        'a': 'Yes, we export heavy equipment parts worldwide including Middle East, Africa, Southeast Asia, and other regions. Fast shipping with proper packaging for international delivery.'
    },
    {
        'q': 'Can you help identify the right part for my equipment?',
        'a': 'Absolutely. Provide us with your equipment serial number, part number, or a clear photo, and our technical team will help identify the correct replacement part.'
    },
    {
        'q': 'What is the lead time for equipment parts?',
        'a': 'In-stock parts ship same day from our Mumbai warehouse. Special order items typically arrive within 7-15 days depending on source and availability.'
    },
    {
        'q': 'Do you offer installation or technical guidance?',
        'a': 'We provide technical specifications and installation guidelines. For complex installations, we recommend certified technicians familiar with your equipment type.'
    }
]

def generate_equipment_faq():
    """Generate FAQ HTML and schema for equipment pages"""
    faq_items = []
    schema_items = []
    
    for faq in EQUIPMENT_FAQ:
        faq_items.append(f'''<div class="border-b border-gray-200 pb-4" x-data="{{open: false}}">
<button @click="open = !open" class="w-full text-left flex justify-between items-center py-2 hover:text-yellow-600 transition-colors">
<h3 class="font-semibold text-gray-900">{faq['q']}</h3>
<svg class="w-5 h-5 transform transition-transform" :class="{{\'rotate-180\': open}}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
</svg>
</button>
<div x-show="open" x-transition class="mt-2 text-gray-700">
{faq['a']}
</div>
</div>''')
        
        schema_items.append({
            "@type": "Question",
            "name": faq['q'],
            "acceptedAnswer": {"@type": "Answer", "text": faq['a']}
        })
    
    import json
    return '\n'.join(faq_items), json.dumps(schema_items, indent=4)

def optimize_equipment_page(filepath):
    """Optimize equipment model page"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<!-- Why Choose PTC -->' in content:
        return False, "Already optimized"
    
    original = content
    
    # Extract brand and model from path
    match = re.search(r'equipment-models/([^/]+)/([^/]+)\.html', str(filepath))
    if not match:
        return False, "Path error"
    
    brand_folder = match.group(1)
    model_file = match.group(2)
    
    # Map brand names
    brand_map = {
        'beml': 'BEML',
        'caterpillar': 'Caterpillar',
        'cat': 'CAT',
        'komatsu': 'Komatsu',
        'volvo': 'Volvo',
        'scania': 'Scania',
        'hitachi': 'Hitachi',
        'hyundai': 'Hyundai',
        'liugong': 'LiuGong',
        'mait': 'MAIT',
        'sany': 'SANY',
        'soilmec': 'Soilmec'
    }
    
    brand = brand_map.get(brand_folder.lower(), brand_folder.upper())
    model = model_file.replace('-parts', '').replace(brand_folder.lower() + '-', '').replace('-', ' ').upper()
    
    # Extract title
    title_match = re.search(r'<title>([^<]+)</title>', content)
    current_title = title_match.group(1) if title_match else ''
    
    # 1. ADD/UPDATE KEYWORDS
    if '<meta name="keywords"' not in content:
        keywords = f"{brand} {model} parts, {brand} {model} spare parts India, {brand} parts Mumbai, excavator parts, equipment spare parts, {brand} {model} hydraulic"
        keywords_tag = f'<meta name="keywords" content="{keywords}"/>\n'
        content = re.sub(r'(<meta\s+(?:name|content)="description"[^>]*>\n)', r'\1' + keywords_tag, content)
    
    # 2. ADD FAQ SECTION
    if '<!-- FAQ Section -->' not in content:
        faq_html, faq_schema = generate_equipment_faq()
        
        schema = f'''<script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {faq_schema}
}}
</script>
'''
        content = re.sub(r'(</head>)', schema + r'\1', content, count=1)
        
        faq_section = f'''<!-- FAQ Section -->
<section class="py-16 bg-white">
<div class="max-w-7xl mx-auto px-4">
<div class="text-center mb-12">
<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
<div class="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
</div>
<div class="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
<div class="space-y-4">
{faq_html}
</div>
</div>
</div>
</section>

'''
        # Insert before footer
        content = re.sub(r'(<footer)', faq_section + r'\1', content, count=1)
    
    # 3. ADD "WHY CHOOSE PTC" SECTION
    if '<!-- Why Choose PTC -->' not in content:
        why_ptc = f'''<!-- Why Choose PTC Section -->
<section class="py-16 bg-gradient-to-br from-yellow-50 to-amber-50">
<div class="max-w-7xl mx-auto px-4">
<div class="text-center mb-12">
<h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose PTC for {brand} Parts?</h2>
<div class="w-24 h-1 bg-yellow-400 mx-auto rounded-full"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<div class="bg-white rounded-xl p-6 shadow-md text-center">
<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
<svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
</svg>
</div>
<h3 class="font-bold text-gray-900 mb-2">Since 1956</h3>
<p class="text-sm text-gray-600">70 years of expertise in heavy equipment parts supply</p>
</div>
<div class="bg-white rounded-xl p-6 shadow-md text-center">
<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
<svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
</svg>
</div>
<h3 class="font-bold text-gray-900 mb-2">Large Inventory</h3>
<p class="text-sm text-gray-600">5000+ parts in stock for immediate dispatch</p>
</div>
<div class="bg-white rounded-xl p-6 shadow-md text-center">
<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
<svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
<path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
</svg>
</div>
<h3 class="font-bold text-gray-900 mb-2">Fast Shipping</h3>
<p class="text-sm text-gray-600">Same-day dispatch from Mumbai warehouse</p>
</div>
<div class="bg-white rounded-xl p-6 shadow-md text-center">
<div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
<svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
</div>
<h3 class="font-bold text-gray-900 mb-2">Quality Assured</h3>
<p class="text-sm text-gray-600">All parts inspected before dispatch</p>
</div>
</div>
</div>
</section>

'''
        content = re.sub(r'(<footer)', why_ptc + r'\1', content, count=1)
    
    # 4. OPTIMIZE H2 HEADINGS
    content = re.sub(
        r'<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">([^<]*) Specifications</h2>',
        f'<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{brand} {model} Technical Specifications</h2>',
        content
    )
    
    # 5. ADD SVG ARIA-LABELS
    content = re.sub(
        r'(<svg[^>]*class="w-[0-9]+ h-[0-9]+[^>]*)(>)',
        lambda m: m.group(1) + ' aria-hidden="true"' + m.group(2) if 'aria-hidden' not in m.group(0) else m.group(0),
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, f"{brand} {model}"
    
    return False, "No changes"

def main():
    """Optimize all equipment model pages"""
    
    print("🔧 Equipment Model Pages - Complete Optimization\n")
    print("=" * 80)
    
    equipment_dir = Path('equipment-models')
    if not equipment_dir.exists():
        print("❌ Equipment directory not found")
        return
    
    brand_stats = {}
    total_updated = 0
    
    # Process each brand folder
    for brand_folder in sorted(equipment_dir.iterdir()):
        if not brand_folder.is_dir():
            continue
        
        brand_name = brand_folder.name.upper()
        files = list(brand_folder.glob('*.html'))
        
        if not files:
            continue
        
        print(f"\n📦 {brand_name} Equipment ({len(files)} models)...")
        
        updated = 0
        for filepath in files:
            success, message = optimize_equipment_page(str(filepath))
            if success:
                updated += 1
                if updated <= 3 or updated == len(files):
                    print(f"      ✅ {filepath.name}: {message}")
        
        if updated > 3 and updated < len(files):
            print(f"      ... and {updated - 3} more")
        
        brand_stats[brand_name] = {'total': len(files), 'updated': updated}
        total_updated += updated
    
    print(f"\n{'=' * 80}")
    print(f"✅ ALL EQUIPMENT MODEL PAGES COMPLETE")
    print(f"{'=' * 80}")
    
    print(f"\n📊 Brand Breakdown:")
    for brand, stats in sorted(brand_stats.items()):
        print(f"   • {brand}: {stats['updated']}/{stats['total']} optimized")
    
    print(f"\n📈 Total: {total_updated} equipment pages optimized")
    print(f"\n✅ Added to each page:")
    print(f"   • Keywords meta tag (equipment-specific)")
    print(f"   • FAQ section + schema (5 questions)")
    print(f"   • Why Choose PTC section (trust signals)")
    print(f"   • Optimized H2 headings")
    print(f"   • SVG accessibility (aria-labels)")

if __name__ == "__main__":
    main()

