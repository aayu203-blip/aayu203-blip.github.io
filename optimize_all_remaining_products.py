#!/usr/bin/env python3
"""
BATCH 3-5: Complete optimization of all remaining product categories
Volvo Suspension, Filtration, and all Scania products
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

# Category-specific FAQs
CATEGORY_FAQS = {
    'suspension': [
        {
            'q': 'How do I know if suspension components need replacement?',
            'a': 'Signs include excessive bouncing, uneven tire wear, vehicle pulling to one side, or clunking noises over bumps. Have suspension inspected if experiencing these symptoms.'
        },
        {
            'q': 'Can I replace just one suspension component?',
            'a': 'While possible, replacing suspension components in pairs (both sides) ensures balanced performance and handling. Consult with a mechanic for specific recommendations.'
        },
        {
            'q': 'What causes premature suspension wear?',
            'a': 'Overloading, rough roads, lack of lubrication, and damaged bushings accelerate wear. Regular inspection and maintenance extend suspension life.'
        },
        {
            'q': 'Is alignment necessary after suspension replacement?',
            'a': 'Yes, wheel alignment is essential after replacing suspension components to ensure proper tire contact, even wear, and optimal handling.'
        }
    ],
    'filtration': [
        {
            'q': 'How often should filters be replaced?',
            'a': 'Oil filters: every oil change. Air filters: every 30,000-50,000 km. Fuel filters: every 40,000-60,000 km. Always follow manufacturer recommendations and adjust for operating conditions.'
        },
        {
            'q': 'What happens if I skip filter changes?',
            'a': 'Clogged filters reduce flow, decrease performance, increase fuel consumption, and can cause component damage. Regular replacement is essential for system protection.'
        },
        {
            'q': 'Can filters be cleaned and reused?',
            'a': 'Most filters are designed for single use. Some air filters can be cleaned if made of washable material, but replacement ensures optimal filtration efficiency.'
        },
        {
            'q': 'How do I choose the right filter micron rating?',
            'a': 'Use the specified rating for your application. Finer ratings (lower microns) provide better filtration but may restrict flow. Match OEM specifications for best results.'
        }
    ],
    'default': [
        {
            'q': 'How do I verify this is the correct part?',
            'a': 'Match the part number exactly with your current component or check your vehicle service manual. Contact us with your chassis number for verification assistance.'
        },
        {
            'q': 'What is your shipping time to my location?',
            'a': 'Orders from Mumbai typically reach major Indian cities within 2-4 days. International shipping available with 5-10 day delivery depending on destination.'
        },
        {
            'q': 'Do you offer bulk discounts?',
            'a': 'Yes, we offer competitive pricing for bulk orders and fleet customers. Contact us with your requirements for a custom quote.'
        },
        {
            'q': 'Can I return parts if they don\'t fit?',
            'a': 'Unused parts in original packaging can be returned within 30 days. Ensure correct part number before ordering to avoid returns.'
        }
    ]
}

def generate_category_description(product_name, part_no, brand, category):
    """Generate category-specific description"""
    product_lower = product_name.lower()
    brand = brand.capitalize()
    
    # Suspension descriptions
    if 'shock' in product_lower or 'absorber' in product_lower:
        return f"{brand} shock absorber (Part {part_no}) dampens suspension oscillations providing smooth ride quality. Controls spring rebound preventing excessive body movement. Essential for vehicle stability and comfort. Hydraulic design ensures consistent damping. In stock at our Mumbai warehouse. Fast shipping across India. ☎ +91-98210-37990."
    
    elif 'spring' in product_lower:
        return f"{brand} suspension spring (Part {part_no}) bears vehicle weight while allowing wheel movement. Heat-treated steel construction provides consistent load capacity. Critical for maintaining ride height and handling. Ready for same-day dispatch from Mumbai. ☎ +91-98210-37990."
    
    elif 'bushing' in product_lower or 'bush' in product_lower:
        return f"{brand} suspension bushing (Part {part_no}) isolates vibration and allows controlled movement. Rubber compound withstands temperature extremes and flexing. Prevents metal-to-metal contact reducing noise. Available for immediate shipping from our Mumbai facility. ☎ +91-98210-37990."
    
    elif 'link' in product_lower or 'rod' in product_lower:
        return f"{brand} suspension link (Part {part_no}) connects suspension components maintaining proper geometry. Precision-machined for exact fit and alignment. Essential for handling and tire wear. Ships from Mumbai stock. Trusted since 1956. ☎ +91-98210-37990."
    
    # Filtration descriptions
    elif 'oil filter' in product_lower:
        return f"{brand} oil filter (Part {part_no}) removes contaminants down to 20 microns protecting engine bearings and precision components. High dirt-holding capacity extends service intervals. Anti-drainback valve prevents dry starts. In stock in Mumbai for fast delivery across India. ☎ +91-98210-37990."
    
    elif 'fuel filter' in product_lower:
        return f"{brand} fuel filter (Part {part_no}) traps particles and water protecting injection system from damage. Multi-layer media ensures superior filtration. Prevents injector clogging and maintains fuel economy. Available for same-day dispatch from Mumbai. ☎ +91-98210-37990."
    
    elif 'air filter' in product_lower:
        return f"{brand} air filter (Part {part_no}) captures dust and debris before entering engine intake. Large surface area maintains airflow while trapping contaminants. Protects cylinders and piston rings from wear. Ships from our Mumbai warehouse. Fast delivery. ☎ +91-98210-37990."
    
    elif 'filter' in product_lower:
        return f"{brand} filter (Part {part_no}) removes harmful contaminants protecting system components. High-efficiency media captures fine particles extending component life. Easy installation and replacement. In stock at our Mumbai facility. ☎ +91-98210-37990."
    
    # Default
    else:
        return f"{brand} {product_name.lower()} (Part {part_no}) designed for reliable system performance. Manufactured to specifications ensuring proper function. Available for immediate dispatch from our Mumbai warehouse. Trusted supplier since 1956. Fast shipping across India. ☎ +91-98210-37990."

def get_faq_for_category(category_path):
    """Get FAQ based on category folder"""
    if 'suspension' in category_path:
        return CATEGORY_FAQS['suspension']
    elif 'filtration' in category_path or 'filter' in category_path:
        return CATEGORY_FAQS['filtration']
    else:
        return CATEGORY_FAQS['default']

def generate_faq_html_schema(faqs):
    """Generate FAQ HTML and schema"""
    faq_items = []
    schema_items = []
    
    for faq in faqs:
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
    
    return '\n'.join(faq_items), json.dumps(schema_items, indent=4)

def optimize_product(filepath, category_name):
    """Optimize any product page with category-specific content"""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<!-- Why Choose PTC -->' in content:
        return False, "Already optimized"
    
    original = content
    
    # Extract info
    part_no_match = re.search(r'Part Number:\s*([A-Z0-9-]+)', content)
    if not part_no_match:
        return False, "No part number"
    part_no = part_no_match.group(1)
    
    h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', content)
    if not h1_match:
        return False, "No H1"
    
    h1_text = h1_match.group(1).strip()
    product_name = re.sub(r'(Volvo|Scania)\s+', '', h1_text, flags=re.I)
    product_name = re.sub(r'\s+\d+.*$', '', product_name).strip()
    
    brand = 'Volvo' if 'volvo' in str(filepath).lower() else 'Scania'
    
    # 1. Keywords
    if '<meta name="keywords"' not in content:
        keywords = f"{brand} {part_no}, {product_name.lower()}, {brand.lower()} {category_name.lower()}, spare parts India, {brand.lower()} parts Mumbai, {part_no} India"
        content = re.sub(r'(<meta\s+(?:name|content)="description"[^>]*>\n)', r'\1<meta name="keywords" content="' + keywords + '"/>\n', content)
    
    # 2. Description
    new_desc = generate_category_description(product_name, part_no, brand, category_name)
    content = re.sub(r'<meta\s+(?:name|content)="description"\s+(?:content|name)="[^"]*"', f'<meta name="description" content="{new_desc}"', content, flags=re.IGNORECASE)
    content = re.sub(r'(<div class="mb-6">\s*<p class="text-gray-700 leading-relaxed">)[^<]+', r'\1' + new_desc, content)
    
    # 3. FAQ
    if '<!-- FAQ Section -->' not in content:
        faqs = get_faq_for_category(str(filepath))
        faq_html, faq_schema = generate_faq_html_schema(faqs)
        
        schema = f'<script type="application/ld+json">\n{{\n    "@context": "https://schema.org",\n    "@type": "FAQPage",\n    "mainEntity": {faq_schema}\n}}\n</script>\n'
        content = re.sub(r'(</head>)', schema + r'\1', content, count=1)
        
        faq_section = f'''<!-- FAQ Section -->
<div class="mt-12 bg-white rounded-xl shadow-lg p-8">
<h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
<div class="space-y-4">
{faq_html}
</div>
</div>

'''
        content = re.sub(r'(<!-- Related Parts Section)', faq_section + r'\1', content, count=1)
    
    # 4. H2 optimization
    content = re.sub(r'<h2 class="text-lg font-bold text-gray-900 mb-4">Key Features:</h2>', f'<h2 class="text-lg font-bold text-gray-900 mb-4">{brand} {part_no} Technical Features</h2>', content)
    content = re.sub(r'<h2 class="text-lg font-bold text-gray-900 mb-4">Additional Information:</h2>', f'<h2 class="text-lg font-bold text-gray-900 mb-4">Specifications & Details</h2>', content)
    
    # 5. Why Choose PTC
    if '<!-- Why Choose PTC -->' not in content:
        why_ptc = '''<!-- Why Choose PTC Section -->
<div class="mt-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
<h2 class="text-xl font-bold text-gray-900 mb-4">Why Choose Parts Trading Company?</h2>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Established 1956</p>
<p class="text-sm text-gray-600">Seven decades of expertise in heavy equipment parts</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Extensive Inventory</p>
<p class="text-sm text-gray-600">5000+ parts in stock for immediate dispatch</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Fast Delivery</p>
<p class="text-sm text-gray-600">Same-day shipping on orders before 2 PM</p>
</div>
</div>
<div class="flex items-start gap-3">
<svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
</svg>
<div>
<p class="font-semibold text-gray-900">Quality Assured</p>
<p class="text-sm text-gray-600">Rigorous inspection before dispatch</p>
</div>
</div>
</div>
</div>

'''
        content = re.sub(r'(<!-- FAQ Section -->)', why_ptc + r'\1', content, count=1)
    
    # 6. SVG aria-labels
    content = re.sub(r'(<svg[^>]*class="[^"]*w-[45] h-[45][^"]*"[^>]*)(>)', r'\1 aria-hidden="true"\2', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, product_name
    
    return False, "No changes"

def main():
    """Process all remaining Volvo and Scania products"""
    
    print("🔧 BATCH 3-5: All Remaining Product Categories\n")
    print("=" * 80)
    
    categories = [
        ('volvo/suspension', 'Suspension', 'Volvo'),
        ('volvo/filtration', 'Filtration', 'Volvo'),
        ('scania/engine', 'Engine', 'Scania'),
        ('scania/braking', 'Braking', 'Scania'),
        ('scania/suspension', 'Suspension', 'Scania'),
        ('scania/filtration', 'Filtration', 'Scania'),
    ]
    
    total_updated = 0
    
    for cat_path, cat_name, brand in categories:
        cat_dir = Path(cat_path)
        if not cat_dir.exists():
            # Try finding all subdirectories
            brand_path = Path(brand.lower())
            if brand_path.exists():
                subdirs = [d for d in brand_path.iterdir() if d.is_dir()]
                all_files = []
                for subdir in subdirs:
                    all_files.extend(list(subdir.glob('*.html')))
                
                if all_files:
                    print(f"\n📦 {brand} - Processing all categories ({len(all_files)} products)...")
                    
                    batch_updated = 0
                    for filepath in all_files:
                        success, message = optimize_product(str(filepath), cat_name)
                        if success:
                            batch_updated += 1
                            if batch_updated <= 3 or batch_updated % 100 == 0:
                                print(f"      ✅ {filepath.name}: {message} ({batch_updated} done)")
                    
                    total_updated += batch_updated
                    print(f"   ✅ {brand} complete: {batch_updated} products optimized")
            continue
        
        files = list(cat_dir.glob('*.html'))
        if not files:
            continue
        
        print(f"\n📦 {brand} {cat_name} ({len(files)} products)...")
        
        batch_updated = 0
        for filepath in files:
            success, message = optimize_product(str(filepath), cat_name)
            if success:
                batch_updated += 1
                if batch_updated <= 3 or batch_updated % 50 == 0:
                    print(f"      ✅ {filepath.name}: {message}")
        
        if batch_updated > 3:
            print(f"      ... and {batch_updated - 3} more")
        
        total_updated += batch_updated
    
    print(f"\n{'=' * 80}")
    print(f"✅ ALL REMAINING PRODUCTS COMPLETE")
    print(f"{'=' * 80}")
    print(f"Total products optimized: {total_updated}")
    print(f"\nNEXT: BEML equipment model pages")

if __name__ == "__main__":
    main()

