#!/usr/bin/env python3
"""
BATCH 2: Volvo Braking Components - Manual Optimization  
Braking-specific customization
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
        product_lookup = {p['Part No']: p for p in products_db}

# Braking component specific FAQ
BRAKING_FAQ = {
    'pad': [
        {
            'q': 'How do I know when brake pads need replacement?',
            'a': 'Replace brake pads when thickness is below 3mm, you hear squealing noises, or experience reduced braking performance. Regular inspection every 20,000 km is recommended.'
        },
        {
            'q': 'Are these brake pads suitable for heavy-duty applications?',
            'a': 'Yes, these brake pads are designed for commercial vehicle applications with high friction coefficient and heat resistance for consistent stopping power under load.'
        },
        {
            'q': 'Do I need to replace rotors when changing pads?',
            'a': 'Not always. Inspect rotor thickness and surface condition. Replace if warped, scored deeply, or below minimum thickness specification.'
        },
        {
            'q': 'What is the break-in procedure for new brake pads?',
            'a': 'Perform 20-30 moderate stops from 60 km/h to properly bed the pads. Avoid hard braking for the first 300 km to allow proper mating with rotors.'
        }
    ],
    'caliper': [
        {
            'q': 'What are signs of a failing brake caliper?',
            'a': 'Common signs include uneven braking, vehicle pulling to one side, brake fluid leaks, or a brake pedal that feels soft or spongy.'
        },
        {
            'q': 'Can I rebuild this caliper or should I replace it?',
            'a': 'Rebuilding is possible if the caliper bore is not pitted or corroded. However, replacement is recommended for reliability in commercial applications.'
        },
        {
            'q': 'How often should brake calipers be serviced?',
            'a': 'Inspect calipers during every brake service. Clean and lubricate slide pins every brake pad change. Full rebuild or replacement typically at 200,000-300,000 km.'
        },
        {
            'q': 'What causes brake calipers to seize?',
            'a': 'Moisture contamination in brake fluid, corroded slide pins, damaged seals, or lack of maintenance cause calipers to seize. Regular service prevents this.'
        }
    ],
    'drum': [
        {
            'q': 'How do I measure brake drum wear?',
            'a': 'Use a drum micrometer to measure internal diameter. Replace if diameter exceeds maximum specification (usually stamped on drum) or if cracked, scored, or out-of-round.'
        },
        {
            'q': 'Can brake drums be machined?',
            'a': 'Yes, drums can be machined if within specifications. However, replacement is often more cost-effective for heavily worn or damaged drums.'
        },
        {
            'q': 'What causes brake drum overheating?',
            'a': 'Overloading, dragging brakes, improper adjustment, or glazed linings cause overheating. Ensure proper brake adjustment and adequate cooling.'
        },
        {
            'q': 'How long do brake drums typically last?',
            'a': 'With proper maintenance, brake drums can last 300,000-500,000 km. Lifespan depends on load, driving conditions, and maintenance quality.'
        }
    ],
    'default': [
        {
            'q': 'What is the function of this braking component?',
            'a': 'This component is essential for reliable braking system operation, ensuring proper stopping power, control, and safety in all conditions.'
        },
        {
            'q': 'How do I verify compatibility with my vehicle?',
            'a': 'Match the part number exactly with your current component. You can also send us your chassis number for verification before ordering.'
        },
        {
            'q': 'Is professional installation required?',
            'a': 'Yes, brake components should be installed by qualified mechanics. Proper installation and bleeding are critical for safety and performance.'
        },
        {
            'q': 'What is included in the package?',
            'a': 'Package includes the brake component as listed. Hardware, seals, or additional parts may need to be ordered separately depending on your application.'
        }
    ]
}

def get_faq_for_braking(product_name):
    """Get relevant FAQ for braking product type"""
    product_lower = product_name.lower()
    
    for key in BRAKING_FAQ:
        if key in product_lower:
            return BRAKING_FAQ[key]
    
    return BRAKING_FAQ['default']

def generate_faq_html(faqs):
    """Generate FAQ HTML with schema"""
    faq_items = []
    schema_items = []
    
    for faq in faqs:
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
    
    return '\n'.join(faq_items), json.dumps(schema_items, indent=4)

def create_braking_description(product_name, part_no):
    """Create braking-specific description"""
    product_lower = product_name.lower()
    
    if 'pad' in product_lower or 'lining' in product_lower:
        return f"Volvo brake pad (Part {part_no}) delivers consistent stopping power with high friction coefficient. Heat-resistant material prevents fade during heavy braking. Essential for maintaining safe braking distances. Designed for commercial vehicle applications. In stock at our Mumbai warehouse with same-day dispatch. Trusted supplier since 1956. ☎ +91-98210-37990."
    
    elif 'caliper' in product_lower:
        return f"Volvo brake caliper (Part {part_no}) applies hydraulic pressure converting it to mechanical clamping force. Precision-machined bore ensures smooth piston operation. Critical for even brake pad contact and consistent stopping. Ready to ship from Mumbai. Fast delivery across India. ☎ +91-98210-37990."
    
    elif 'disc' in product_lower or 'rotor' in product_lower:
        return f"Volvo brake disc (Part {part_no}) provides friction surface for brake pads ensuring effective heat dissipation. Ventilated design prevents brake fade under heavy use. Essential for maintaining braking performance. Available for immediate dispatch from our Mumbai facility. ☎ +91-98210-37990."
    
    elif 'drum' in product_lower:
        return f"Volvo brake drum (Part {part_no}) provides braking surface for shoe contact. Heavy-duty construction withstands high temperatures and loads. Critical for reliable stopping power in commercial applications. In stock in Mumbai for fast shipping across India. ☎ +91-98210-37990."
    
    elif 'chamber' in product_lower or 'cylinder' in product_lower:
        return f"Volvo brake chamber (Part {part_no}) converts air pressure into mechanical force for brake actuation. Spring-loaded design ensures fail-safe operation. Essential for pneumatic braking systems. Ships from our Mumbai warehouse. Trusted since 1956. ☎ +91-98210-37990."
    
    elif 'valve' in product_lower:
        return f"Volvo brake valve (Part {part_no}) regulates air pressure distribution in the braking system. Precise control ensures balanced braking and prevents wheel lock-up. Critical for safe vehicle operation. Available for same-day dispatch from Mumbai. ☎ +91-98210-37990."
    
    elif 'hose' in product_lower or 'line' in product_lower:
        return f"Volvo brake hose (Part {part_no}) transmits hydraulic pressure from master cylinder to calipers. Reinforced construction withstands high pressure without expansion. DOT-approved specifications for safety. In stock in Mumbai. Fast delivery across India. ☎ +91-98210-37990."
    
    else:
        return f"Volvo braking component (Part {part_no}) designed for reliable braking system performance. Ensures proper function, safety, and control in all conditions. Manufactured to strict specifications. Available for immediate dispatch from our Mumbai warehouse. Trusted supplier since 1956. ☎ +91-98210-37990."

def optimize_volvo_braking_product(filepath):
    """Optimize a single Volvo braking product page"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Skip if already optimized
    if '<!-- Why Choose PTC -->' in content:
        return False, "Already optimized"
    
    # Extract product info
    part_no_match = re.search(r'Part Number:\s*([A-Z0-9-]+)', content)
    if not part_no_match:
        return False, "No part number"
    
    part_no = part_no_match.group(1)
    
    # Extract product name from H1
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    if h1_match:
        h1_text = h1_match.group(1).strip()
        product_name = re.sub(r'Volvo\s+', '', h1_text, flags=re.I)
        product_name = re.sub(r'\s+\d+.*$', '', product_name).strip()
    else:
        return False, "No H1"
    
    # 1. ADD KEYWORDS
    if '<meta name="keywords"' not in content:
        keywords = f"Volvo {part_no}, {product_name.lower()}, volvo brake parts, braking components India, volvo spare parts Mumbai, brake safety, {part_no} India"
        keywords_tag = f'<meta name="keywords" content="{keywords}"/>\n'
        content = re.sub(r'(<meta\s+(?:name|content)="description"[^>]*>\n)', r'\1' + keywords_tag, content)
    
    # 2. BRAKING-SPECIFIC DESCRIPTION
    new_desc = create_braking_description(product_name, part_no)
    
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
    
    # 3. ADD FAQ SECTION
    if '<!-- FAQ Section -->' not in content:
        faqs = get_faq_for_braking(product_name)
        faq_html, faq_schema_json = generate_faq_html(faqs)
        
        # Add FAQ schema
        faq_schema = f'''<script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": {faq_schema_json}
}}
</script>
'''
        content = re.sub(r'(</head>)', faq_schema + r'\1', content, count=1)
        
        # Add FAQ HTML
        faq_section = f'''<!-- FAQ Section -->
<div class="mt-12 bg-white rounded-xl shadow-lg p-8">
<h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
<div class="space-y-4">
{faq_html}
</div>
</div>

'''
        content = re.sub(r'(<!-- Related Parts Section)', faq_section + r'\1', content, count=1)
    
    # 4. OPTIMIZE H2 HEADINGS
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-4">Key Features:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-4">Volvo {part_no} Braking Specifications</h2>',
        content
    )
    
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-4">Additional Information:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-4">Compatibility & Technical Data</h2>',
        content
    )
    
    content = re.sub(
        r'<h2 class="text-lg font-bold text-gray-900 mb-6">Related Parts:</h2>',
        f'<h2 class="text-lg font-bold text-gray-900 mb-6">Related Brake Components</h2>',
        content
    )
    
    # 5. ADD "WHY CHOOSE PTC"
    if '<!-- Why Choose PTC -->' not in content:
        why_ptc = '''<!-- Why Choose PTC Section -->
<div class="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
<h2 class="text-xl font-bold text-gray-900 mb-4">Why Trust PTC for Brake Parts?</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Safety-Critical Quality</p>
<p class="text-sm text-gray-600">All brake components tested for performance and reliability</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Large Brake Inventory</p>
<p class="text-sm text-gray-600">Complete brake system parts for Volvo trucks and excavators</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Fast Dispatch</p>
<p class="text-sm text-gray-600">Same-day shipping on orders placed before 2 PM from Mumbai</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Technical Expertise</p>
<p class="text-sm text-gray-600">Knowledgeable staff helps you find the right brake parts</p>
</div>
</div>
</div>
</div>

'''
        content = re.sub(r'(<!-- FAQ Section -->)', why_ptc + r'\1', content, count=1)
    
    # 6. ADD CROSS-SELL
    if '<!-- Frequently Bought Together -->' not in content:
        cross_sell = '''<!-- Frequently Bought Together -->
<div class="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
<h3 class="text-lg font-bold text-gray-900 mb-4">Complete Your Brake Service</h3>
<p class="text-sm text-gray-600 mb-4">Customers also purchased:</p>
<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
<a href="/pages/categories/volvo-braking-system-components.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Brake Fluid & DOT 4
</a>
<a href="/pages/categories/volvo-air-and-fluid-filtration-systems.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Air Filters
</a>
<a href="/pages/categories/volvo-suspension-and-steering-components.html" class="flex items-center gap-2 text-sm text-gray-700 hover:text-yellow-600 transition-colors">
<svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
</svg>
Suspension Parts
</a>
</div>
</div>

'''
        content = re.sub(r'(<!-- Contact Information Section -->)', cross_sell + r'\1', content, count=1)
    
    # 7. ADD SVG ARIA-LABELS
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
    """Optimize Volvo Braking Components"""
    
    print("🔧 BATCH 2: Volvo Braking Components - Manual Optimization\n")
    print("=" * 80)
    print("Braking-Specific Customization")
    print("=" * 80)
    
    braking_dir = Path('volvo/braking')
    if not braking_dir.exists():
        print("❌ Volvo braking directory not found")
        return
    
    files = list(braking_dir.glob('*.html'))
    print(f"\n📦 Found {len(files)} Volvo braking products")
    print(f"\nBraking-specific optimizations:")
    print(f"  ✅ Keywords (brake safety focus)")
    print(f"  ✅ Descriptions (stopping power, friction, safety)")
    print(f"  ✅ FAQ (brake-specific questions)")
    print(f"  ✅ H2 headings (braking specifications)")
    print(f"  ✅ Why Choose PTC (safety-critical quality)")
    print(f"  ✅ Cross-sell (brake fluid, filters)")
    print(f"  ✅ SVG accessibility")
    print(f"\n" + "=" * 80)
    
    updated = 0
    for filepath in files:
        success, message = optimize_volvo_braking_product(str(filepath))
        if success:
            updated += 1
            if updated <= 5 or updated % 50 == 0:
                print(f"   ✅ {filepath.name}: {message}")
    
    if updated > 5:
        print(f"   ... and {updated - 5} more")
    
    print(f"\n{'=' * 80}")
    print(f"✅ BATCH 2 COMPLETE: Volvo Braking Components")
    print(f"{'=' * 80}")
    print(f"Files processed: {len(files)}")
    print(f"Files updated: {updated}")

if __name__ == "__main__":
    main()

