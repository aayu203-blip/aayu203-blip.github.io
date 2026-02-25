
import json
import os
import re
from datetime import datetime

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
LIVE_REPO = os.path.join(BASE_DIR, "aayu203-blip.github.io")
DATA_FILE = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete", "god-mode", "data", "parts-database.json")
OUTPUT_DIR = os.path.join(LIVE_REPO, "pages", "intercept")
HUBS_DIR = os.path.join(LIVE_REPO, "pages", "models")

# Live Header/Footer Templates (extracted from index.html)
# We will load these dynamically or use hardcoded reliable versions
LIVE_HEADER = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <link href="{canonical}" rel="canonical"/>
    <meta name="robots" content="index, follow">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.13.3/dist/cdn.min.js" defer></script>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <style>
        .hero-gradient {{ background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%); }}
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
    <!-- NAV -->
    <nav class="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <a href="https://partstrading.com/" class="flex items-center space-x-2">
                    <img src="/assets/images/ptc-logo.png" alt="PTC" class="h-12">
                </a>
                <div class="hidden md:flex space-x-8">
                    <a href="https://partstrading.com/#brands" class="text-gray-700 hover:text-yellow-600 font-medium transition">Brands</a>
                    <a href="https://partstrading.com/#product-categories" class="text-gray-700 hover:text-yellow-600 font-medium transition">Products</a>
                    <a href="https://partstrading.com/blog/" class="text-gray-700 hover:text-yellow-600 font-medium transition">Blog</a>
                    <a href="https://partstrading.com/#contact" class="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition shadow-md">Get Quote</a>
                </div>
            </div>
        </div>
    </nav>
"""

LIVE_FOOTER = """
    <!-- FOOTER -->
    <footer class="bg-gray-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <h3 class="text-xl font-playfair font-bold mb-4">Parts Trading Company</h3>
                    <p class="text-gray-400">Serving the heavy machinery industry with premium aftermarket parts since 1956.</p>
                </div>
                <div>
                    <h4 class="font-bold mb-4 text-yellow-500">Quick Links</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li><a href="https://partstrading.com/" class="hover:text-white">Home</a></li>
                        <li><a href="https://partstrading.com/pages/sitemap.html" class="hover:text-white">Global Parts Directory</a></li>
                        <li><a href="https://partstrading.com/blog/" class="hover:text-white">Industry Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="font-bold mb-4 text-yellow-500">Contact</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>+971 50 123 4567</li>
                        <li>sales@partstrading.com</li>
                        <li>Dubai, UAE</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-800 pt-8 text-center text-gray-500">
                <p>&copy; 2026 Parts Trading Company. All rights reserved.</p>
            </div>
        </div>
    </footer>
    <script>AOS.init({duration: 800, once: true});</script>
</body>
</html>
"""

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')

def load_data():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

def generate_intercept_page(part):
    brand = part.get('brand', 'Generic').title()
    part_no = part.get('part_number', 'Unknown')
    
    # Smart Naming Logic
    tech_specs = part.get('technical_specs', {})
    real_name = tech_specs.get('Part Type', 
                 tech_specs.get('Part Name', 
                 tech_specs.get('Component Type', 
                 part.get('product_name', f"{brand} {part_no}"))))
    
    if real_name == f"{brand} {part_no}":
        # Final fallback check in JSON-LD
        json_ld = part.get('json_ld', {})
        if json_ld and 'name' in json_ld:
            # Clean "Scania 123456 Part Name" -> "Part Name"
            name_candidate = json_ld['name'].replace(f"{brand} {part_no}", "").replace(brand, "").replace(part_no, "").strip()
            if len(name_candidate) > 3:
                real_name = name_candidate.title()

    full_product_name = f"{brand} {part_no} {real_name}"
    
    # Description Logic
    description = part.get('final_html_description', '')
    if not description or len(description) < 50:
        json_desc = part.get('json_ld', {}).get('description', '')
        if len(json_desc) > 50:
            description = f"<p>{json_desc}</p>"
        else:
            description = f"<p>Premium aftermarket {real_name} for {brand} equipment. Replaces OEM part number {part_no}. Engineered for durability and precise fitment.</p>"

    # Specs Table Logic
    specs_html = ""
    if tech_specs:
        rows = ""
        for key, val in tech_specs.items():
            if isinstance(val, list): val = ", ".join(val)
            rows += f"""
            <tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <td class="py-3 px-4 font-medium text-gray-600">{key}</td>
                <td class="py-3 px-4 font-bold text-gray-900">{val}</td>
            </tr>
            """
        if rows:
            specs_html = f"""
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="font-bold text-gray-900 flex items-center gap-2">
                        <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Technical Specifications
                    </h3>
                </div>
                <table class="w-full text-sm">
                    <tbody>{rows}</tbody>
                </table>
            </div>
            """

    # SEO Metadata
    page_title = f"{full_product_name} | Replacement Parts | PTC"
    meta_desc = f"Buy {full_product_name}. High-quality aftermarket replacement. Global shipping from Parts Trading Company."
    slug = f"replacement-for-{slugify(brand)}-{slugify(part_no)}.html"
    page_url = f"https://partstrading.com/pages/intercept/{slug}"
    
    # Body Content
    body = f"""
    <div class="pt-28 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="flex mb-8 text-sm text-gray-500">
                <a href="https://partstrading.com/" class="hover:text-yellow-600">Home</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">{brand} Parts</span>
                <span class="mx-2">/</span>
                <span class="text-yellow-600 font-bold truncate">{part_no}</span>
            </nav>

            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <!-- Urgency Header -->
                <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 px-8 py-4 flex items-center justify-between text-white shadow-md">
                    <span class="font-bold flex items-center gap-2 text-black/80">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        VERIFIED FITMENT
                    </span>
                    <span class="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white">
                        In Stock
                    </span>
                </div>

                <div class="p-8 md:p-12">
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div class="flex-1">
                            <span class="text-blue-600 font-bold tracking-wider text-xs uppercase mb-2 block bg-blue-50 w-fit px-2 py-1 rounded">{part.get('category', 'Spare Part')}</span>
                            <h1 class="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">{full_product_name}</h1>
                            
                            <div class="prose text-gray-600 mb-8 leading-relaxed text-sm">
                                {description}
                            </div>
                            
                            {specs_html}

                            <!-- CTAs -->
                            <div class="flex flex-col sm:flex-row gap-4">
                                <a href="https://wa.me/971501234567?text=Best%20price%20for%20{brand}%20{part_no}%20({real_name})" 
                                   class="flex-1 bg-green-600 hover:bg-green-500 text-white text-center px-8 py-4 rounded-xl font-bold transition shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2 group">
                                    <svg class="w-6 h-6 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                    Get Pricing
                                </a>
                            </div>
                        </div>
                        
                        <!-- Trust Column -->
                        <div class="w-full md:w-1/3 bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <h4 class="font-bold text-gray-900 mb-4">PTC Guarantee</h4>
                            <ul class="space-y-4 text-sm">
                                <li class="flex items-center gap-3">
                                    <span class="bg-green-100 text-green-700 p-1 rounded-full">✓</span> 30-Day Warranty
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="bg-blue-100 text-blue-700 p-1 rounded-full">✈</span> Global Shipping
                                </li>
                                <li class="flex items-center gap-3">
                                    <span class="bg-purple-100 text-purple-700 p-1 rounded-full">★</span> OEM Spec Match
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """
    
    html = LIVE_HEADER.format(title=page_title, description=meta_desc, canonical=page_url) + body + LIVE_FOOTER
    return slug, html

def main():
    print("--- Phase 5: Global Brand Expansion ---")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    data = load_data()
    print(f"Loaded {len(data)} parts from God Mode DB.")
    
    targets = ['caterpillar', 'komatsu']
    count = 0
    
    for part in data:
        brand = part.get('brand', '').lower().strip()
        if brand == 'cat': brand = 'caterpillar'
        
        if brand in targets:
            slug, html = generate_intercept_page(part)
            filepath = os.path.join(OUTPUT_DIR, slug)
            
            with open(filepath, 'w') as f:
                f.write(html)
            
            count += 1
            if count % 1000 == 0:
                print(f"Generated {count} pages...")
                
    print(f"COMPLETE: Generated {count} new intercept pages in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
