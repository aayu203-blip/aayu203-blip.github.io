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
    return """
    <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 flex items-center justify-center opacity-70 mt-6 relative overflow-hidden group hover:opacity-100 transition-opacity">
        <svg class="w-32 h-32 text-gray-300 group-hover:text-yellow-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=')] opacity-50"></div>
        <span class="absolute bottom-2 right-4 text-[10px] text-gray-400 font-mono tracking-widest uppercase">TECH_SCHEMATIC_V2</span>
    </div>
    """

def get_translations_for_part(real_name):
    lower_name = real_name.lower()
    br = "Peças de reposição"
    id = "Suku cadang alat berat"
    tr = "İş makinesi yedek parça"

    if 'compressor' in lower_name:
        br, id, tr = "Compressor pneumático", "Kompresor udara", "Pnömatik kompresör"
    elif 'excavator' in lower_name or 'undercarriage' in lower_name:
        br, id, tr = "Peças de escavadeira", "Suku cadang excavator", "Ekskavatör parçaları"
    elif 'filter' in lower_name:
        br, id, tr = "Filtro de motor", "Filter mesin", "Motor filtresi"
    elif 'pump' in lower_name:
        br, id, tr = "Bomba hidráulica", "Pompa hidrolik", "Hidrolik pompa"

    return f"""
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-4">
        <div class="bg-white p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span class="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2"><span class="text-base">🇧🇷</span> Brazil (Portuguese)</span>
            <span class="font-medium text-gray-800">{br}</span>
        </div>
        <div class="bg-white p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span class="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2"><span class="text-base">🇮🇩</span> Indonesia (Bahasa)</span>
            <span class="font-medium text-gray-800">{id}</span>
        </div>
        <div class="bg-white p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span class="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider mb-2"><span class="text-base">🇹🇷</span> Turkey (Turkish)</span>
            <span class="font-medium text-gray-800">{tr}</span>
        </div>
    </div>
    """

def get_tco_comparison():
    return """
    <div class="mt-8 bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
        <div class="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-red-100 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <h3 class="font-bold text-gray-900">Total Cost of Ownership (TCO) Analysis: New vs. Salvage</h3>
            </div>
            <span class="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-100 px-2 py-1 rounded">Risk Advisory</span>
        </div>
        <div class="p-6">
            <p class="text-sm text-gray-600 mb-6 leading-relaxed">
                Many global buyers source used or refurbished European salvage network parts to cut upfront costs. This introduces massive, unpredictable operational risks. Compare the true cost of failure:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border border-gray-200 rounded-xl p-5 bg-gray-50">
                    <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><svg class="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg> Used / Refurbished Salvage</h4>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li class="flex items-center gap-2 text-red-600"><span class="text-red-500 font-bold">✗</span> Unknown metal fatigue limits</li>
                        <li class="flex items-center gap-2 text-red-600"><span class="text-red-500 font-bold">✗</span> Zero technical warranty coverage</li>
                        <li class="flex items-center gap-2 text-red-600"><span class="text-red-500 font-bold">✗</span> Catastrophic mid-operation failure risk</li>
                    </ul>
                </div>
                <div class="border border-green-200 rounded-xl p-5 bg-green-50/30 shadow-inner">
                    <h4 class="font-bold text-gray-900 mb-3 flex items-center gap-2"><svg class="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg> PTC Tier-1 Aftermarket (New)</h4>
                    <ul class="text-sm text-gray-800 space-y-2 font-medium">
                        <li class="flex items-center gap-2"><span class="text-green-500 font-bold">✓</span> CNC Machined to Exact OEM Specs</li>
                        <li class="flex items-center gap-2"><span class="text-green-500 font-bold">✓</span> Verified Aftermarket Reliability</li>
                        <li class="flex items-center gap-2"><span class="text-green-500 font-bold">✓</span> Eliminates unpredicted fleet downtime</li>
                    </ul>
                </div>
            </div>
            <div class="mt-6 text-center text-xs text-gray-500">
                A single day of fleet downtime costs 10x the initial savings of a salvaged component.
            </div>
        </div>
    </div>
    """

def get_bulk_rfq_banner():
    return """
    <div class="w-full bg-gray-900 text-white py-3 md:py-2 px-4 shadow-md sticky top-0 z-40 border-b border-yellow-500/30">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
            <div class="flex items-center gap-3">
                <span class="flex h-6 w-6 rounded-full bg-yellow-500/20 text-yellow-400 items-center justify-center border border-yellow-500/50">
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </span>
                <span class="text-sm font-medium tracking-wide">Fleet Overhaul? Upload your complete Bill of Materials (BOM) for priority pricing.</span>
            </div>
            <a href="mailto:sales@partstrading.com?subject=Bulk%20BOM%20Submission" class="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-1.5 px-4 rounded shadow-sm text-sm transition-colors whitespace-nowrap border border-yellow-400">
                Upload BOM (.xlsx / .pdf)
            </a>
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
        model_rows += f'<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2 mb-2 border border-gray-200 shadow-sm">{m}</span>'

    specs_html = ""
    if tech_specs:
        rows = ""
        for key, val in tech_specs.items():
            if isinstance(val, list): val = ", ".join([str(v) for v in val])
            rows += f"""
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td class="py-3 px-4 text-sm font-medium text-gray-500 w-[40%]">{key}</td>
                <td class="py-3 px-4 text-sm font-bold text-gray-900 font-mono">{val}</td>
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
           class="flex w-full items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-200">
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
    {get_bulk_rfq_banner()}
    <nav class="bg-white border-b border-gray-100 py-4 shadow-sm sticky top-[48px] md:top-[44px] z-30">
        <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <a href="https://partstrading.com/" class="flex items-center"><img src="/assets/images/ptc-logo.png" alt="PTC" class="h-10 transition-transform hover:scale-105"></a>
            <div class="hidden md:flex gap-6 font-medium text-sm text-gray-700">
                <a href="/" class="hover:text-yellow-600 transition-colors">Home</a>
                <a href="/pages/products/" class="hover:text-yellow-600 text-yellow-600 transition-colors">Global Catalog</a>
                <a href="mailto:sales@partstrading.com" class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">Contact Sales</a>
            </div>
        </div>
    </nav>
"""

    main_content = f"""
    <main class="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <!-- BREADCRUMB -->
        <nav class="flex text-xs text-gray-500 mb-8 uppercase tracking-wider font-semibold items-center">
            <a href="/" class="hover:text-yellow-600 flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> Home</a>
            <span class="mx-2">/</span>
            <span class="text-gray-900">Aftermarket {brand}</span>
            <span class="mx-2">/</span>
            <span class="text-yellow-600">{part_no}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <!-- LEFT COLUMN: DATA ANCHOR -->
            <div class="lg:col-span-8">
                <!-- Brand Trust Transference Badge -->
                <div class="mb-4 inline-flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg shadow-sm">
                    <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                    <div>
                        <span class="block text-xs font-bold text-blue-900 uppercase tracking-widest leading-none mb-1">Powered by Tier-1 OEM Suppliers</span>
                        <span class="block text-[11px] text-blue-700 leading-none">Manufactured to exact OEM spec (Valeo, Dayco, FTE equivalents). Zero dealer markup.</span>
                    </div>
                </div>

                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                    <span class="font-mono text-yellow-500 mr-2 drop-shadow-sm">{part_no}</span><br/>
                    {real_name} Compatible with {brand}
                </h1>
                
                <p class="text-lg text-gray-600 mb-8 max-w-2xl leading-relaxed">
                    Engineered aftermarket equivalent for original {brand} part {part_no}. Strict dimensional tolerances to ensure immediate fitment and extreme operational durability under heavy loads.
                </p>

                <!-- Technical Specification Matrix -->
                <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div class="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        <h2 class="font-bold text-gray-900 text-lg">Engineering Specifications</h2>
                    </div>
                    {specs_html if specs_html else '<div class="p-6 text-sm text-gray-500 font-medium">Full metallurgical and dimensional specification sheet available upon Request For Quote.</div>'}
                </div>

                {get_svg_schematic(real_name)}
                
                {get_tco_comparison()}

                <!-- TABS (Below the Fold Logic) -->
                <div class="mt-12" x-data="{{ tab: 'global' }}">
                    <div class="flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
                        <button @click="tab = 'global'" :class="tab === 'global' ? 'border-yellow-500 text-yellow-600 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm transition-colors">Global Search Matrix</button>
                        <button @click="tab = 'cross'" :class="tab === 'cross' ? 'border-yellow-500 text-yellow-600 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm transition-colors">Universal Cross-Ref</button>
                        <button @click="tab = 'fitment'" :class="tab === 'fitment' ? 'border-yellow-500 text-yellow-600 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'" class="whitespace-nowrap py-4 px-6 border-b-2 font-bold text-sm transition-colors">Compatibility Matrix</button>
                    </div>
                    
                    <div class="p-6 bg-white border border-t-0 border-gray-200 rounded-b-2xl shadow-sm min-h-[250px]">
                        <div x-show="tab === 'global'" class="space-y-2">
                            <h3 class="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">Semantic Native Translations</h3>
                            <p class="text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">Index data for international procurement officers operating in native languages.</p>
                            {get_translations_for_part(real_name)}
                        </div>
                        <div x-show="tab === 'cross'" style="display: none;" class="space-y-2">
                            <h3 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Known Aftermarket Equivalents</h3>
                            {cross_ref_rows if cross_ref_rows else '<div class="text-gray-500 text-sm py-4 border-b border-gray-100 flex items-center justify-between"><span>Primary OEM Equivalent</span><span class="font-mono text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded">' + str(part_no) + '</span></div>'}
                        </div>
                        <div x-show="tab === 'fitment'" style="display: none;" class="space-y-4">
                            <h3 class="font-bold text-gray-900 mb-2 text-sm uppercase tracking-wider">Verified Machine Fitment</h3>
                            <p class="text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">Always verify fitment with your engine serial number before purchasing.</p>
                            <div class="flex flex-wrap">{model_rows if model_rows else f'<span class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"><svg class="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>{brand} Heavy Equipment</span>'}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: CONVERSION ENGINE & LOGISTICS -->
            <div class="lg:col-span-4 space-y-6">
                
                <!-- Main RFQ Block -->
                <div class="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-36">
                    <div class="mb-6 pb-6 border-b border-gray-100">
                        <div class="flex items-center gap-2 text-green-600 mb-2">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span class="font-bold text-sm uppercase tracking-wide">Ready for Export</span>
                        </div>
                        <p class="text-[13px] text-gray-500 leading-relaxed">Verified match for Part No: <span class="font-mono text-gray-900 font-bold bg-gray-100 px-1.5 py-0.5 rounded ml-1">{part_no}</span></p>
                    </div>

                    <a href="https://wa.me/919821037990?text=I%20am%20requesting%20a%20B2B%20quote%20for%20{brand}%20{part_no}%20({real_name})" 
                       class="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-200/50 mb-4 group">
                        <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.384 0 12.031c0 2.126.552 4.195 1.6 6.009L.46 24l6.115-1.602c1.761.942 3.75 1.439 5.807 1.439 6.646 0 12.031-5.383 12.031-12.031C24.413 5.386 19.031 0 12.031 0zm.006 21.666c-1.801 0-3.565-.483-5.115-1.4l-.367-.217-3.801.996.996-3.705L3.5 16.92A9.873 9.873 0 0 1 2.128 12.03C2.128 6.556 6.551 2.133 12.033 2.133A9.88 9.88 0 0 1 21.91 12.034c0 5.472-4.423 9.895-9.878 9.895z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
                        Quote via WhatsApp
                    </a>
                    
                    <a href="mailto:sales@partstrading.com?subject=RFQ%3A%20{part_no}%20{brand}" 
                       class="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6">
                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        Email RFQ
                    </a>

                    <!-- Concierge Sourcing / Lead Salvage -->
                    <div class="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-8">
                        <h4 class="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-2 flex items-center gap-2"><svg class="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> Priority Sourcing</h4>
                        <p class="text-xs text-gray-600 mb-3 leading-relaxed">Obsolete or backordered? Our global broker network locates rare components within 72 hours.</p>
                        <a href="mailto:sourcing@partstrading.com?subject=Concierge%20Sourcing%20Request%3A%20{part_no}" class="text-xs font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-wide underline underline-offset-2">Initiate Concierge Search &rarr;</a>
                    </div>

                    <!-- Global Logistics Modules -->
                    <div class="space-y-3">
                        <h4 class="font-bold text-gray-900 text-[10px] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Global Trade Compliance Nodes</h4>
                        
                        <div class="flex items-start gap-3 p-3 bg-blue-50/40 border border-blue-100/50 rounded-lg">
                            <span class="text-lg">🇧🇷</span>
                            <div>
                                <p class="text-[11px] font-bold text-gray-900 uppercase tracking-wide">Brazil Export Ready</p>
                                <p class="text-[10px] text-gray-600 mt-1 leading-relaxed">ICMS commercial invoice formatting. Corporate PIX cross-border confirmed via EBANX.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 p-3 bg-red-50/40 border border-red-100/50 rounded-lg">
                            <span class="text-lg">🇮🇩</span>
                            <div>
                                <p class="text-[11px] font-bold text-gray-900 uppercase tracking-wide">Indonesia Compliance</p>
                                <p class="text-[10px] text-gray-600 mt-1 leading-relaxed">Exact HS Codes pre-mapped for API-U clearance. Xendit / QRIS corporate transfers online.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3 p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
                            <span class="text-lg">🇹🇷</span>
                            <div>
                                <p class="text-[11px] font-bold text-gray-900 uppercase tracking-wide">Turkey TAREKS Integration</p>
                                <p class="text-[10px] text-gray-600 mt-1 leading-relaxed">TSE document packet included. iyzico infrastructure active for stable Lira B2B settlement.</p>
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
    print("Initializing Phase 18.5 Advanced B2B Architecture Generator...")
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
            
    print(f"COMPLETE: Successfully generated {count} Advanced B2B Commerce Pages in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
