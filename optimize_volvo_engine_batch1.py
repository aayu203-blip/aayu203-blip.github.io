#!/usr/bin/env python3
"""
BATCH 1: Volvo Engine Components - Manual Optimization
Category-specific, brand-specific customization
"""

import os
import re
import json
from pathlib import Path

# Load product database
with open('new_partDatabase_cleaned.js', 'r', encoding='utf-8') as f:
    db_content = f.read()
    match = re.search(r'const partDatabase = (\[.*?\]);', db_content, re.DOTALL)
    if match:
        products_db = json.loads(match.group(1))
        # Create lookup
        product_lookup = {p['Part No']: p for p in products_db}

# Engine component specific FAQ
ENGINE_FAQ = {
    'ring': [
        {
            'q': 'What is the function of an intermediate ring in Volvo engines?',
            'a': 'The intermediate ring maintains precise valve clearance, prevents exhaust gas leakage, and ensures optimal combustion chamber sealing. Critical for engine compression and performance.'
        },
        {
            'q': 'How often should engine rings be replaced?',
            'a': 'Engine rings should be inspected during major overhauls or when experiencing compression loss, excessive oil consumption, or blow-by. Typically replaced every 500,000+ km depending on usage.'
        },
        {
            'q': 'Is this compatible with D12 and D13 Volvo engines?',
            'a': 'Compatibility depends on your specific engine configuration. Check your part number against our database or contact us with your chassis number for verification.'
        },
        {
            'q': 'Do you ship engine components internationally?',
            'a': 'Yes, we ship Volvo engine parts worldwide. Fast delivery to India, Middle East, Africa, Southeast Asia, and other regions. Contact us for shipping quotes.'
        }
    ],
    'valve': [
        {
            'q': 'What does this valve control in the engine system?',
            'a': 'This valve regulates flow within the engine system, maintaining proper pressure and preventing backflow. Critical for optimal engine performance and fuel efficiency.'
        },
        {
            'q': 'How do I know if my valve needs replacement?',
            'a': 'Signs include loss of power, rough idling, increased fuel consumption, or unusual engine noises. Have the valve inspected if experiencing these symptoms.'
        },
        {
            'q': 'Are these valves compatible with older Volvo truck models?',
            'a': 'Many engine valves fit multiple model years. Verify compatibility using your part number or contact our technical team with your vehicle details.'
        },
        {
            'q': 'What is the warranty on engine valves?',
            'a': 'We provide warranty coverage on manufacturing defects. Installation must be performed by qualified technicians following proper procedures.'
        }
    ],
    'default': [
        {
            'q': 'What does this engine component do?',
            'a': 'This component plays a critical role in engine operation, ensuring proper function, sealing, or flow control depending on its specific application.'
        },
        {
            'q': 'How do I verify this is the correct part for my vehicle?',
            'a': 'Match the part number exactly with your current component or consult your vehicle service manual. You can also send us your chassis number for verification.'
        },
        {
            'q': 'Do you offer installation guidance?',
            'a': 'We recommend professional installation by qualified mechanics. Technical specifications and torque requirements are available upon request.'
        },
        {
            'q': 'What is your return policy for engine parts?',
            'a': 'We accept returns within 30 days if the part is unused and in original packaging. Custom orders or installed parts are non-returnable.'
        }
    ]
}

def get_faq_for_product(product_name):
    """Get relevant FAQ for product type"""
    product_lower = product_name.lower()
    
    for key in ENGINE_FAQ:
        if key in product_lower:
            return ENGINE_FAQ[key]
    
    return ENGINE_FAQ['default']

def generate_faq_html(faqs):
    """Generate FAQ HTML with schema"""
    faq_items = []
    schema_items = []
    
    for i, faq in enumerate(faqs):
        faq_items.append(f'''<div class="border-b border-gray-200 pb-4" x-data="{{open: false}}">
<button @click="open = !open" class="w-full text-left flex justify-between items-center py-2 hover:text-yellow-600 transition-colors">
<h3 class="font-semibold text-gray-900">{faq['q']}</h3>
<svg class="w-5 h-5 transform transition-transform" :class="{{\'rotate-180\': open}}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['a']
            }
        })
    
    faq_html = '\n'.join(faq_items)
    faq_schema = json.dumps(schema_items, indent=4)
    
    return faq_html, faq_schema

def optimize_volvo_engine_product(filepath):
    """Optimize a single Volvo engine product page"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Extract product info
    part_no_match = re.search(r'Part Number:\s*([A-Z0-9-]+)', content)
    if not part_no_match:
        return False, "No part number"
    
    part_no = part_no_match.group(1)
    
    # Get from database
    product_data = product_lookup.get(part_no, {})
    
    # Extract product name from H1
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    if h1_match:
        h1_text = h1_match.group(1).strip()
        product_name = re.sub(r'Volvo\s+', '', h1_text, flags=re.I)
        product_name = re.sub(r'\s+\d+.*$', '', product_name).strip()
    else:
        return False, "No H1"
    
    # 1. ADD KEYWORDS META TAG
    if '<meta name="keywords"' not in content:
        keywords = f"Volvo {part_no}, {product_name.lower()}, volvo {product_name.lower()}, volvo engine parts, engine components India, volvo spare parts Mumbai, {part_no} India"
        keywords_tag = f'<meta name="keywords" content="{keywords}"/>\n'
        
        # Insert after description
        content = re.sub(
            r'(<meta\s+(?:name|content)="description"[^>]*>\n)',
            r'\1' + keywords_tag,
            content
        )
    
    # 2. IMPROVE DESCRIPTION (Engine-specific)
    application = product_data.get('Application', '')
    
    # Create engine-specific description
    if 'ring' in product_name.lower():
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) ensures precise valve clearance and prevents exhaust gas leakage in Volvo engines. Critical for maintaining compression ratios and optimal combustion. Manufactured to OEM specifications for reliable performance. In stock at our Mumbai warehouse with fast shipping across India. Trusted supplier since 1956. ☎ +91-98210-37990."
    elif 'valve' in product_name.lower():
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) controls flow and maintains pressure in the engine system. Heat-resistant construction withstands extreme operating temperatures. Essential for proper engine operation and fuel efficiency. Ready to ship from Mumbai. Fast delivery across India. ☎ +91-98210-37990."
    elif 'gasket' in product_name.lower():
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) creates reliable seal preventing leaks in the engine system. Multi-layer construction handles extreme pressure and temperature cycles. Critical for maintaining system integrity. In stock in Mumbai for immediate dispatch. ☎ +91-98210-37990."
    elif 'sensor' in product_name.lower():
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) provides accurate monitoring of engine parameters. Fast response time ensures optimal system control and protection. Essential for ECU operation and performance. Available for same-day shipping from our Mumbai warehouse. ☎ +91-98210-37990."
    elif 'pump' in product_name.lower():
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) maintains proper circulation and pressure in the engine system. Efficient design reduces power loss while ensuring adequate flow. Critical for lubrication and cooling. Ships from Mumbai stock. Fast delivery across India. ☎ +91-98210-37990."
    else:
        new_desc = f"Volvo {product_name.lower()} (Part {part_no}) designed for reliable engine system performance. Manufactured to strict specifications ensuring proper fit and function. Essential component for optimal operation. In stock at our Mumbai facility with fast shipping across India. Trusted since 1956. ☎ +91-98210-37990."
    
    # Update meta description
    content = re.sub(
        r'<meta\s+(?:name|content)="description"\s+(?:content|name)="[^"]*"',
        f'<meta name="description" content="{new_desc}"',
        content,
        flags=re.IGNORECASE
    )
    
    # Update body description
    content = re.sub(
        r'(<div class="mb-6">\s*<p class="text-gray-700 leading-relaxed">)[^<]+',
        r'\1' + new_desc,
        content
    )
    
    # 3. ADD FAQ SECTION + SCHEMA
    if '<!-- FAQ Section -->' not in content:
        faqs = get_faq_for_product(product_name)
        faq_html, faq_schema_json = generate_faq_html(faqs)
        
        # Add FAQ schema to head
        faq_schema = f'''<script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {faq_schema_json}
}}
</script>
'''
        
        # Insert schema before closing </head>
        content = re.sub(
            r'(</head>)',
            faq_schema + r'\1',
            content,
            count=1
        )
        
        # Add FAQ section HTML before Related Parts
        faq_section = f'''<!-- FAQ Section -->
<div class="mt-12 bg-white rounded-xl shadow-lg p-8">
<h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
<div class="space-y-4">
{faq_html}
</div>
</div>

'''
        
        # Insert before Related Parts
        content = re.sub(
            r'(<!-- Related Parts Section)',
            faq_section + r'\1',
            content,
            count=1
        )
    
    # 4. OPTIMIZE H2 HEADINGS
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-4">Key Features:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-4">Volvo {part_no} Technical Features</h2>',
        content
    )
    
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-4">Additional Information:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-4">Specifications & Compatibility</h2>',
        content
    )
    
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-6">Related Parts:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-6">Compatible Engine Components</h2>',
        content
    )
    
    # 5. ADD "WHY CHOOSE PTC" SECTION
    if '<!-- Why Choose PTC -->' not in content:
        why_ptc = '''<!-- Why Choose PTC Section -->
<div class="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
<h2 class="text-xl font-bold text-gray-900 mb-4">Why Choose Parts Trading Company?</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">70 Years in Business</p>
<p class="text-sm text-gray-600">Established in 1956, we've been serving the industry for seven decades</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">5000+ Parts in Stock</p>
<p class="text-sm text-gray-600">Extensive inventory for Volvo, Scania, CAT, Komatsu, and more</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Same-Day Dispatch</p>
<p class="text-sm text-gray-600">Orders placed before 2 PM ship the same day from Mumbai</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Quality Assured</p>
<p class="text-sm text-gray-600">All parts inspected and tested before dispatch</p>
</div>
</div>
</div>
</div>

'''
        # Insert before FAQ section
        content = re.sub(
            r'(<!-- FAQ Section -->)',
            why_ptc + r'\1',
            content,
            count=1
        )
    
    # 6. ADD CROSS-SELL SECTION
    if '<!-- Frequently Bought Together -->' not in content:
        cross_sell = '''<!-- Frequently Bought Together -->
<div class="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
<h3 class="text-lg font-bold text-gray-900 mb-4">Complete Your Engine Maintenance</h3>
<p class="text-sm text-gray-600 mb-4">Customers who bought this also ordered:</p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
<a href="/pages/categories/volvo-air-and-fluid-filtration-systems.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Oil & Air Filters
</a>
<a href="/pages/categories/volvo-engine-components.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Gaskets & Seals
</a>
<a href="/pages/categories/volvo-braking-system-components.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Brake Components
</a>
</div>
</div>

'''
        # Insert after Related Parts
        content = re.sub(
            r'(</div>\s*</div>\s*</div>\s*<!-- Contact Information Section -->)',
            cross_sell + r'\1',
            content,
            count=1
        )
    
    # 7. ADD SVG ARIA-LABELS
    # Add aria-label to decorative SVGs
    content = re.sub(
        r'(<svg[^>]*class="[^"]*w-5 h-5[^"]*"[^>]*)(>)',
        r'\1 aria-hidden="true"\2',
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, product_name
    
    return False, "No changes"

def main():
    """Optimize Volvo Engine Components - Batch 1"""
    
    print("🔧 BATCH 1: Volvo Engine Components - Manual Optimization\n")
    print("=" * 80)
    print("Category-Specific Customization for Engine Parts")
    print("=" * 80)
    
    engine_dir = Path('volvo/engine')
    if not engine_dir.exists():
        print("❌ Volvo engine directory not found")
        return
    
    files = list(engine_dir.glob('*.html'))
    print(f"\n📦 Found {len(files)} Volvo engine products")
    print(f"\nOptimizing with:")
    print(f"  ✅ Keywords meta tags (engine-specific)")
    print(f"  ✅ Enhanced descriptions (technical, category-specific)")
    print(f"  ✅ FAQ section + schema (4 questions)")
    print(f"  ✅ H2 optimization (keyword-rich)")
    print(f"  ✅ Why Choose PTC section (trust signals)")
    print(f"  ✅ Cross-sell section (complementary products)")
    print(f"  ✅ SVG accessibility (aria-labels)")
    print(f"\n" + "=" * 80)
    
    updated = 0
    for i, filepath in enumerate(files[:50]):  # First batch of 50
        success, message = optimize_volvo_engine_product(str(filepath))
        if success:
            updated += 1
            if updated <= 5 or updated % 10 == 0:
                print(f"   ✅ {filepath.name}: {message}")
    
    if updated > 5:
        print(f"   ... and {updated - 5} more")
    
    print(f"\n{'=' * 80}")
    print(f"✅ BATCH 1 COMPLETE: Volvo Engine Components")
    print(f"{'=' * 80}")
    print(f"Files processed: {min(50, len(files))}")
    print(f"Files updated: {updated}")
    print(f"\nNext batches:")
    print(f"  • Volvo Braking (Batch 2)")
    print(f"  • Volvo Suspension (Batch 3)")
    print(f"  • Scania Engine (Batch 4)")
    print(f"  • Scania Braking (Batch 5)")

if __name__ == "__main__":
    main()

