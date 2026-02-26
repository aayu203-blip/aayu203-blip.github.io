import json
import os
import re

BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
DATA_FILE = os.path.join(BASE_DIR, "god-mode", "data", "parts-database.json")
OUTPUT_DIR = os.path.join(BASE_DIR, "pages", "products")
LIVE_FOOTER_FILE = os.path.join(BASE_DIR, "scripts", "live_footer.html")

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', str(text).lower()).strip('-')

def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def load_footer():
    with open(LIVE_FOOTER_FILE, 'r') as f:
        return f.read()

def extract_deep_data(part):
    json_ld = part.get('json_ld', {})
    
    compatible_models = []
    is_compatible = json_ld.get('isCompatibleWith', [])
    if isinstance(is_compatible, list):
        for item in is_compatible:
            if isinstance(item, dict) and 'name' in item:
                compatible_models.append(item['name'])
    
    cross_refs = []
    additional_props = json_ld.get('additionalProperty', [])
    if isinstance(additional_props, list):
        for prop in additional_props:
            if isinstance(prop, dict):
                name = prop.get('name', '').lower()
                val = prop.get('value', '')
                if 'cross' in name or 'oem' in name or 'reference' in name:
                    cross_refs.append(f"{val} ({prop.get('name')})")

    return compatible_models, cross_refs

def get_svg_schematic(part_type):
    # Pure schematic SVG silhouette to break text walls
    return """
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 flex items-center justify-center opacity-70 mt-6 relative overflow-hidden">
        <svg class="w-32 h-32 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <span class="absolute bottom-2 right-4 text-[10px] text-gray-400 font-mono tracking-widest uppercase">TECH_SCHEMATIC_V2</span>
    </div>
    """

def get_translations(real_name):
    # Simulated mapping or generic translations to capture local keywords
    return f"""
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
        <div class="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
            <span class="text-xs text-gray-400 block uppercase tracking-wider mb-1">Portuguese (Brazil)</span>
            <span class="font-medium text-gray-800">Peça de reposição: {real_name}</span>
        </div>
        <div class="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
            <span class="text-xs text-gray-400 block uppercase tracking-wider mb-1">Bahasa (Indonesia)</span>
            <span class="font-medium text-gray-800">Suku cadang: {real_name}</span>
        </div>
        <div class="bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
            <span class="text-xs text-gray-400 block uppercase tracking-wider mb-1">Turkish (Turkey)</span>
            <span class="font-medium text-gray-800">Yedek parça: {real_name}</span>
        </div>
    </div>
    """

def generate_page(part, live_footer):
    brand = part.get('brand', 'Generic').title()
    part_no = part.get('part_number', 'Unknown')
    
    tech_specs = part.get('technical_specs', {})
    if isinstance(tech_specs, list): tech_specs = {}

    real_name = tech_specs.get('Part Type', 
                 tech_specs.get('Part Name', 
                 tech_specs.get('Component Type', 
                 part.get('product_name', f"Replacement Part"))))
                 
    if real_name.startswith(brand):
        real_name = real_name.replace(brand, "").strip()
    if part_no in real_name:
        real_name = real_name.replace(part_no, "").strip()
    if len(real_name) < 3:
        real_name = "Component"

    compatible_models, cross_refs = extract_deep_data(part)
    fits_str = ", ".join(compatible_models[:3]) if compatible_models else f"{brand} Heavy Machinery"
    cross_str = " | ".join(cross_refs[:2]) if cross_refs else f"OEM {part_no}"

    # Algorithmic Meta Title (Legally Bulletproof)
    page_title = f"{part_no} Aftermarket {real_name} Compatible with {brand} | Fits {fits_str} | PTC"
    if len(page_title) > 65: page_title = page_title[:62] + "..."
    
    meta_desc = f"Request Quote for Aftermarket {real_name} (Replaces {brand} {part_no}). Verified fitment for {fits_str}. Global B2B shipping & OEM spec match."

    slug = f"aftermarket-{slugify(brand)}-{slugify(part_no)}.html"
    page_url = f"https://partstrading.com/pages/products/{slug}"

    # Cross Refs HTML
    cross_ref_rows = ""
    for cr in cross_refs:
        cross_ref_rows += f'<div class="flex justify-between py-2 border-b border-gray-100 last:border-0"><span class="text-gray-600">Cross Reference</span><span class="font-mono font-medium text-gray-900">{cr}</span></div>'

    # Models HTML
    model_rows = ""
    for m in compatible_models:
        model_rows += f'<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-2">{m}</span>'

    specs_html = ""
    if tech_specs:
        rows = ""
        for key, val in tech_specs.items():
            if isinstance(val, list): val = ", ".join([str(v) for v in val])
            rows += f"""
            <tr class="border-b border-gray-100 hover:bg-gray-50/50">
                <td class="py-3 px-4 text-sm font-medium text-gray-500 w-1/3">{key}</td>
                <td class="py-3 px-4 text-sm font-bold text-gray-900">{val}</td>
            </tr>
            """
        if rows:
            specs_html = f"""
            <table class="w-full text-left border-collapse">
                <tbody>{rows}</tbody>
            </table>
            """

    mobile_whatsapp = f"""
    <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <a href="https://wa.me/919821037990?text=I%20need%20a%20quote%20for%20{brand}%20{part_no}%20({real_name})" 
           class="flex w-full items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.384 0 12.031c0 2.126.552 4.195 1.6 6.009L.46 24l6.115-1.602c1.761.942 3.75 1.439 5.807 1.439 6.646 0 12.031-5.383 12.031-12.031C24.413 5.386 19.031 0 12.031 0zm.006 21.666c-1.801 0-3.565-.483-5.115-1.4l-.367-.217-3.801.996.996-3.705L3.5 16.92A9.873 9.873 0 0 1 2.128 12.03C2.128 6.556 6.551 2.133 12.033 2.133A9.88 9.88 0 0 1 21.91 12.034c0 5.472-4.423 9.895-9.878 9.895z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
            Quote via WhatsApp
        </a>
    </div>
    """

    header = f"""<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page_title}</title>
    <meta name="description" content="{meta_desc}">
    <link href="{page_url}" rel="canonical"/>
    <meta name="robots" content="index, follow">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.13.3/dist/cdn.min.js" defer></script>
</head>
<body class="bg-gray-50 text-gray-900 pb-20 md:pb-0 font-sans">
    <nav class="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <a href="https://partstrading.com/" class="flex items-center"><img src="/assets/images/ptc-logo.png" alt="PTC" class="h-10"></a>
            <div class="hidden md:flex gap-6 font-medium text-sm text-gray-700">
                <a href="/" class="hover:text-yellow-600">Home</a>
                <a href="/pages/products/" class="hover:text-yellow-600 text-yellow-600">Global Parts Catalog</a>
            </div>
        </div>
    </nav>
"""

    main_content = f"""
    <main class="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <!-- BREADCRUMB -->
        <nav class="flex text-xs text-gray-500 mb-8 uppercase tracking-wider font-semibold">
            <a href="/" class="hover:text-yellow-600">Parts Trading Company</a>
            <span class="mx-2">/</span>
            <span class="text-gray-900">Aftermarket {brand}</span>
            <span class="mx-2">/</span>
            <span class="text-yellow-600">{part_no}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- LEFT COLUMN: DATA ANCHOR -->
            <div class="lg:col-span-8">
                <div class="mb-2">
                    <span class="bg-gray-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-sm">Aftermarket Replacement</span>
                </div>
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
                    <span class="font-mono text-yellow-500 mr-2">{part_no}</span><br/>
                    {real_name} Compatible with {brand}
                </h1>
                
                <p class="text-lg text-gray-600 mb-8 max-w-2xl">
                    Engineered aftermarket equivalent for original {brand} part {part_no}. Strict OEM dimensional tolerances to ensure immediate fitment and extreme operational durability.
                </p>

                <!-- Technical Specification Matrix -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div class="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        <h2 class="font-bold text-gray-900 text-lg">Engineering Specifications</h2>
                    </div>
                    {specs_html if specs_html else '<div class="p-6 text-sm text-gray-500">Full specification sheet available upon Request For Quote.</div>'}
                </div>

                {get_svg_schematic(real_name)}

                <!-- TABS (Below the Fold Logic) -->
                <div class="mt-12" x-data="{{ tab: 'cross' }}">
                    <div class="flex border-b border-gray-200 overflow-x-auto">
                        <button @click="tab = 'cross'" :class="tab === 'cross' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm">Universal Cross-Ref</button>
                        <button @click="tab = 'fitment'" :class="tab === 'fitment' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm">Compatibility Matrix</button>
                        <button @click="tab = 'global'" :class="tab === 'global' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm">Local Terminology</button>
                    </div>
                    
                    <div class="p-6 bg-white border border-t-0 border-gray-200 rounded-b-2xl shadow-sm min-h-[250px]">
                        <div x-show="tab === 'cross'" class="space-y-2">
                            <h3 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Known Aftermarket Equivalents</h3>
                            {cross_ref_rows if cross_ref_rows else '<div class="text-gray-500 text-sm py-2 border-b border-gray-100">Primary OEM Equivalent: <span class="font-mono text-gray-900 font-medium ml-2">' + str(part_no) + '</span></div>'}
                        </div>
                        <div x-show="tab === 'fitment'" style="display: none;">
                            <h3 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Verified Machine Fitment</h3>
                            <div class="flex flex-wrap">{model_rows if model_rows else f'<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{brand} Heavy Equipment</span>'}</div>
                        </div>
                        <div x-show="tab === 'global'" style="display: none;">
                            <h3 class="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">Global Search Matrix</h3>
                            <p class="text-xs text-gray-500 mb-4">Semantic translations for international procurement parity.</p>
                            {get_translations(real_name)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: CONVERSION ENGINE -->
            <div class="lg:col-span-4">
                <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-24">
                    
                    <div class="mb-6 pb-6 border-b border-gray-100">
                        <div class="flex items-center gap-2 text-green-600 mb-2">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span class="font-bold text-sm uppercase tracking-wide">Verified Configuration</span>
                        </div>
                        <p class="text-xs text-gray-500">Part No: <span class="font-mono text-gray-900 font-bold">{part_no}</span></p>
                    </div>

                    <a href="https://wa.me/919821037990?text=I%20am%20requesting%20a%20B2B%20quote%20for%20{brand}%20{part_no}%20({real_name})" 
                       class="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-200 mb-4">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.384 0 12.031c0 2.126.552 4.195 1.6 6.009L.46 24l6.115-1.602c1.761.942 3.75 1.439 5.807 1.439 6.646 0 12.031-5.383 12.031-12.031C24.413 5.386 19.031 0 12.031 0zm.006 21.666c-1.801 0-3.565-.483-5.115-1.4l-.367-.217-3.801.996.996-3.705L3.5 16.92A9.873 9.873 0 0 1 2.128 12.03C2.128 6.556 6.551 2.133 12.033 2.133A9.88 9.88 0 0 1 21.91 12.034c0 5.472-4.423 9.895-9.878 9.895z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
                        Quote via WhatsApp
                    </a>
                    
                    <a href="mailto:sales@partstrading.com?subject=RFQ%3A%20{part_no}%20{brand}" 
                       class="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mb-8">
                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        Email RFQ
                    </a>

                    <!-- Global Logistics Modules -->
                    <div class="space-y-4">
                        <h4 class="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Global Trade Compliance</h4>
                        
                        <div class="flex items-start gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                            <span class="text-xl">🇧🇷</span>
                            <div>
                                <p class="text-xs font-bold text-gray-900">Brazil Export Ready</p>
                                <p class="text-[11px] text-gray-600 mt-0.5">Commercial Invoice configured for ICMS clearance. Corporate PIX payments verified via EBANX/PagBrasil.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 p-3 bg-red-50/50 border border-red-100 rounded-lg">
                            <span class="text-xl">🇮🇩</span>
                            <div>
                                <p class="text-xs font-bold text-gray-900">Indonesia Compliance</p>
                                <p class="text-[11px] text-gray-600 mt-0.5">HS Codes provided for API-U/API-P licensing. Direct QRIS / Xendit institutional banking accepted.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <span class="text-xl">🇹🇷</span>
                            <div>
                                <p class="text-xs font-bold text-gray-900">Turkey TAREKS Integration</p>
                                <p class="text-[11px] text-gray-600 mt-0.5">TSE inspection documentation ready. Expedited land-bridge routing. iyzico infrastructure active.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
        </div>
    </main>
    {mobile_whatsapp}
    <!-- INJECT LIVE FOOTER -->
    {live_footer}
"""
    return slug, header + main_content

def main():
    print("Initializing Phase 18 B2B Architecture Generator...")
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    data = load_data()
    live_footer_html = load_footer()
    
    # Simple replace to strip html/body tags from footer content
    live_footer_html = re.sub(r'<!DOCTYPE html>.*<body[^>]*>', '', live_footer_html, flags=re.IGNORECASE|re.DOTALL)
    live_footer_html = live_footer_html.replace('</body>', '').replace('</html>', '')
    
    count = 0
    generated_slugs = set()
    
    for part in data:
        slug, html = generate_page(part, live_footer_html)
        if slug in generated_slugs:
            continue
            
        filepath = os.path.join(OUTPUT_DIR, slug)
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html)
            generated_slugs.add(slug)
            count += 1
            if count % 2000 == 0:
                print(f"Generated {count} B2B pages...")
        except BaseException:
            pass
            
    print(f"COMPLETE: Successfully generated {count} High-Density B2B Commerce Pages in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
