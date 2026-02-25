
import json
import os
import re
import random
from datetime import datetime

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
LIVE_REPO = os.path.join(BASE_DIR, "aayu203-blip.github.io")
DATA_FILE = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete", "god-mode", "data", "parts-database.json")
OUTPUT_DIR = os.path.join(LIVE_REPO, "pages", "intercept")

# --- GEO & KEYWORD DATA ---
MINING_HUBS = [
    "major mining regions worldwide", "North America", "South America", "Australia", "Africa"
]


SYNONYMS = ["Replacement Component", "Spare Part", "Aftermarket Unit", "Service Part", "Maintenance Item", "Heavy Duty Replacement", "Construction Part"]

# Live Header/Footer Templates

def load_templates():
    try:
        with open(os.path.join(BASE_DIR, "EXPERIMENTS/PTC_Website_Complete/scripts/live_header.html"), "r") as f:
            header = f.read()
        with open(os.path.join(BASE_DIR, "EXPERIMENTS/PTC_Website_Complete/scripts/live_footer.html"), "r") as f:
            footer = f.read()
        return header, footer
    except Exception as e:
        print(f"Error loading templates: {e}")
        return "", ""

LIVE_HEADER, LIVE_FOOTER = load_templates()

STICKY_CTA = """
<div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-2xl z-50 md:hidden flex gap-3">
    <a href="https://wa.me/919821037990?text=I%20need%20a%20price%20for%20{title}" class="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg animate-pulse">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        <span>Best Price</span>
    </a>
    <a href="tel:+919821037990" class="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
        <span>Call Expert</span>
    </a>
</div>
"""

FLOATING_WA = """
<a aria-label="Contact us on WhatsApp" class="hidden md:flex fixed bottom-[20px] right-[20px] w-[60px] h-[60px] z-50 bg-green-500 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 items-center justify-center" href="https://wa.me/919821037990" rel="noopener noreferrer" target="_blank">
    <svg aria-hidden="true" class="h-8 w-8 text-white" fill="currentColor" viewbox="0 0 24 24">
    <path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0 2.15.7 4.14 1.88 5.76L2.96 21.1l3.8-1.2a9.9 9.9 0 0 0 5.46 1.62c5.46 0 9.9-4.4 9.9-9.83a9.88 9.88 0 0 0-9.9-9.83m5.95 12.52c-.08-.12-.27-.19-.56-.33-.28-.14-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.14-.2.29-.75.93-.91 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43a8.64 8.64 0 0 1-1.6-1.98c-.18-.29-.03-.44.12-.58.13-.13.29-.34.43-.5.15-.17.2-.3.29-.48.1-.2.05-.36-.02-.5-.08-.15-.65-1.56-.9-2.13-.24-.58-.48-.48-.65-.48-.17 0-.37-.03-.56-.03-.2 0-.5.08-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.96.14.19 2 3.17 4.93 4.32 2.94 1.15 2.94.77 3.47.72.53-.05 1.7-.7 1.95-1.36.24-.67.24-1.25.17-1.37"></path></svg>
</a>
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

def extract_deep_data(part):
    json_ld = part.get('json_ld', {})
    
    # 1. Compatibility List
    compatible_models = []
    is_compatible = json_ld.get('isCompatibleWith', [])
    if isinstance(is_compatible, list):
        for item in is_compatible:
            if isinstance(item, dict) and 'name' in item:
                compatible_models.append(item['name'])
    
    # 2. Cross References
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

def generate_faq_schema(brand, part_no, real_name):
    # FAQ Schema Generation
    faqs = [
        {
            "question": f"Is this {brand} {part_no} {real_name} compatible with my machine?",
            "answer": f"This part is designed as a direct replacement for {brand} OEM part {part_no}. It is manufactured to meet or exceed OEM specifications for fitment and performance."
        },
        {
            "question": f"Does Parts Trading Company ship {part_no} internationally?",
            "answer": f"Yes, we ship {brand} {part_no} and other heavy machinery parts to over 100 countries including USA, Canada, Australia, Chile, and across Africa."
        },
        {
            "question": "What is the warranty on this replacement part?",
            "answer": "All our aftermarket parts come with a standard warranty against manufacturing defects. We stand by the quality of our products."
        }
    ]
    
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }
    
    for faq in faqs:
        schema["mainEntity"].append({
            "@type": "Question",
            "name": faq["question"],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq["answer"]
            }
        })
        
    return f'<script type="application/ld+json">{json.dumps(schema)}</script>'

def generate_intercept_page(part, related_parts):
    brand = part.get('brand', 'Generic').title()
    part_no = part.get('part_number', 'Unknown')
    
    # Name Logic
    tech_specs = part.get('technical_specs', {})
    if isinstance(tech_specs, list): tech_specs = {}

    real_name = tech_specs.get('Part Type', 
                 tech_specs.get('Part Name', 
                 tech_specs.get('Component Type', 
                 part.get('product_name', f"{brand} {part_no}"))))
    
    if real_name == f"{brand} {part_no}":
        json_ld = part.get('json_ld', {})
        if json_ld and 'name' in json_ld:
            name_candidate = json_ld['name'].replace(f"{brand} {part_no}", "").replace(brand, "").replace(part_no, "").strip()
            if len(name_candidate) > 3:
                real_name = name_candidate.title()

    # If real_name already starts with Brand, don't repeat it.
    clean_real_name = real_name.replace(f"{brand} {part_no}", "").replace(brand, "").replace(part_no, "").strip()
    if not clean_real_name: clean_real_name = "Replacement Component"
    
    full_product_name = f"{brand} {part_no} {clean_real_name}".strip()
    # Double check for repetition
    if full_product_name.lower().count(brand.lower()) > 1:
        full_product_name = full_product_name.replace(f"{brand} {brand}", brand)

    
    # Deep Data
    compatible_models, cross_refs = extract_deep_data(part)
    fits_str = ", ".join(compatible_models[:3]) if compatible_models else ""
    
    # FAQ Schema
    faq_script = generate_faq_schema(brand, part_no, real_name)
    
    # Geo Targeting
    hubs = random.sample(MINING_HUBS, 3)
    
    # Description Logic
    description = part.get('final_html_description', '')
    if not description or len(description) < 50:
        json_desc = part.get('json_ld', {}).get('description', '')
        if len(json_desc) > 50:
            description = f"<p>{json_desc}</p>"
        else:
            synonym = random.choice(SYNONYMS)
            description = f"<p>Premium aftermarket {real_name} ({synonym}) for {brand} equipment. Replaces OEM part number {part_no}. Engineered for durability in harsh mining and construction environments.</p>"

    # Compatibility Section
    compatibility_html = ""
    if compatible_models:
        models_list = "".join([f"<li class='flex items-center gap-2'><span class='w-1.5 h-1.5 bg-blue-600 rounded-full'></span>{m}</li>" for m in compatible_models])
        compatibility_html = f"""
        <div class="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 class="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Compatible Models
            </h3>
            <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                {models_list}
            </ul>
        </div>
        """

    # Cross Reference Section
    cross_ref_html = ""
    if cross_refs:
        refs_str = ", ".join(cross_refs)
        cross_ref_html = f"""
        <div class="mt-6 mb-8 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <span class="font-bold text-gray-700">Replaces OEM:</span> {refs_str}
        </div>
        """

    # Specs Table Logic
    specs_html = ""
    if tech_specs:
        rows = ""
        for key, val in tech_specs.items():

            if key in ["Manufacturer", "Country of Origin", "Source", "Supplier"]: continue
            
            if isinstance(val, list): 
                val = ", ".join([str(v) for v in val])
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
    
    # Related Parts Logic
    related_html = ""
    if related_parts:
        cards = ""
        for rp in related_parts:
            rp_brand = rp.get('brand', 'Generic')
            rp_no = rp.get('part_number', 'Unknown')
            rp_slug = rp.get('slug', '')
            if not rp_slug: rp_slug = f"replacement-for-{slugify(rp_brand)}-{slugify(rp_no)}.html"
            if not rp_slug.endswith('.html'): rp_slug += '.html'
            
            cards += f"""
            <a href="/pages/intercept/{rp_slug}" class="block group cursor-pointer p-4 bg-white rounded-xl border border-gray-100 hover:shadow-lg transition">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{rp_brand}</span>
                <h4 class="font-bold text-gray-900 group-hover:text-yellow-600 mb-2">{rp_no}</h4>
                <span class="text-sm text-blue-600">View Details &rarr;</span>
            </a>
            """
        related_html = f"""
        <div class="mt-16 border-t border-gray-200 pt-12">
            <h3 class="text-2xl font-bold text-gray-900 mb-6">Related {brand} Parts</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cards}
            </div>
        </div>
        """

    # SEO Metadata
    title_suffix = f" | Fits {fits_str}" if fits_str else ""
    if len(title_suffix) > 30: title_suffix = title_suffix[:27] + "..."
    
    synonym_title = random.choice(SYNONYMS)
    page_title = f"{full_product_name}{title_suffix} | PTC"
    if fits_str:
        meta_desc = f"Buy {full_product_name}. {synonym_title}. Compatible with {fits_str}. High-quality aftermarket replacement. Global shipping available."
    else:
        meta_desc = f"Buy {full_product_name}. {synonym_title}. High-quality aftermarket replacement. Global shipping from Parts Trading Company."
    
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
                <div class="space-y-4">
                    <details class="group bg-white rounded-xl border border-gray-100 p-4 open">
                        <summary class="flex items-center justify-between cursor-pointer list-none font-bold text-gray-900">
                            <span>Does PTC ship {part_no} to <span class="dynamic-country">my location</span>?</span>
                            <span class="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                        </summary>
                        <div class="text-gray-600 mt-3 group-open:animate-fadeIn text-sm">
                            Yes, we ship to <span class="dynamic-country font-bold">over 100 countries</span> daily. Our logistics partners (DHL, FedEx, Maersk) ensure fast delivery to mining sites and workshops in <span class="dynamic-country">your region</span>.
                        </div>
                    </details>
                </div>

                <div class="p-8 md:p-12">
                    <div class="flex flex-col md:flex-row gap-8 items-start">


                        <div class="flex-1">
                            <span class="text-blue-600 font-bold tracking-wider text-xs uppercase mb-2 block bg-blue-50 w-fit px-2 py-1 rounded">{part.get('category') or 'Spare Part'}</span>
                            <h1 class="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-4">{full_product_name}</h1>
                            
                            <div class="prose text-gray-600 mb-8 leading-relaxed text-sm">
                                {description}
                            </div>
                            
                            {cross_ref_html}
                            {specs_html}
                            {compatibility_html}

                            <!-- CTAs -->
                            <div class="flex flex-col sm:flex-row gap-4 mt-8">
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
                                <li class="flex items-center gap-3">
                                    <span class="bg-purple-100 text-purple-700 p-1 rounded-full">★</span> Ships to <span class="dynamic-country">your location</span> & Worldwide
                                </li>
                            </ul>
                        </div>
                    </div>
                    {related_html}
                </div>
            </div>
        </div>
    </div>
    """
    



    # Inject Dynamic Headers - TARGETING ACTUAL HTML CONTENT
    # 0. Fix Header Colors & Spacing
    style_fix = """
    <style>
        /* Force Black Header Links */
        nav a, header a { color: #111 !important; }
        nav a:hover, header a:hover { color: #ca8a04 !important; }
        
        /* Fix Footer overlapping content */
        body { padding-bottom: 80px; }
        
        /* Ensure specific category span is visible */
        .category-badge { display: inline-block !important; }
    </style>
    """
    final_header = LIVE_HEADER.replace("</head>", f"{style_fix}\n</head>")

    # 1. Title
    final_header = final_header.replace("<title>Buy Volvo, Scania, Komatsu & CAT Parts India | OEM Spare Parts Mumbai | Parts Trading Company</title>", f"<title>{page_title}</title>")
    
    # 2. Description
    final_header = re.sub(r'<meta content="[^"]+" name="description"/>', f'<meta content="{meta_desc}" name="description"/>', final_header)
    
    # 3. Canonical
    final_header = final_header.replace('<link href="https://partstrading.com/" rel="canonical"/>', f'<link href="{page_url}" rel="canonical"/>')
    
    # 4. FAQ Schema (Inject before </head>)
    final_header = final_header.replace("</head>", f"{faq_script}\n</head>")
    
    # 5. Inject Country Detection Script
    country_detection_js = """
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Simple Country Detection via Timezone/Intl (Low latency, High accuracy for free)
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const countryMap = {
                'Asia/Dubai': 'United Arab Emirates',
                'Asia/Calcutta': 'India',
                'Asia/Kolkata': 'India',
                'America/New_York': 'USA',
                'Europe/London': 'UK',
                'Australia/Sydney': 'Australia',
                'Africa/Johannesburg': 'South Africa'
            };
            
            // Allow override if userLocation global is available (from main content script)
            let userCountry = 'your location';
            
            if (typeof userLocation !== 'undefined' && userLocation.country) {
                userCountry = userLocation.country;
            } else if (countryMap[timeZone]) {
                userCountry = countryMap[timeZone];
            } else {
                 // Fallback to rough region if possible or just generic
                 userCountry = timeZone.split('/')[0]; 
            }
            
            // Update Text
            document.querySelectorAll('.dynamic-country').forEach(el => {
                el.textContent = userCountry;
                el.classList.add('font-bold', 'text-green-600');
            });
            
        } catch (e) {
            console.log('Country detect failed', e);
        }
    });
    </script>
    """
    
    # Inject Sticky CTA into Footer AND The Script
    final_footer = LIVE_FOOTER.replace("</body>", f"{STICKY_CTA.format(title=full_product_name)}\n{FLOATING_WA}\n{country_detection_js}</body>")

    html = final_header + body + final_footer
    return slug, html

def main():
    print("--- Phase 12.5: NUCLEAR SEO UPGRADE ---")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    data = load_data()
    print(f"Loaded {len(data)} parts from God Mode DB.")
    
    # Pre-process for linking
    parts_by_brand = {}
    targets = ['caterpillar', 'komatsu', 'volvo', 'scania']
    
    for part in data:
        brand = part.get('brand', '').lower().strip()
        if brand == 'cat': brand = 'caterpillar'
        if brand in targets:
            if brand not in parts_by_brand: parts_by_brand[brand] = []
            parts_by_brand[brand].append(part)
            
    print("Built brand indices for linking.")
    
    count = 0
    for brand, parts in parts_by_brand.items():
        for part in parts:
            # Pick 4 random related parts
            related = random.sample(parts, min(4, len(parts)))
            # Remove self if possible
            related = [p for p in related if p['id'] != part['id']][:4]
            
            slug, html = generate_intercept_page(part, related)
            filepath = os.path.join(OUTPUT_DIR, slug)
            
            with open(filepath, 'w') as f:
                f.write(html)
            
            count += 1
            if count % 1000 == 0:
                print(f"Generated {count} pages...")
                
    print(f"COMPLETE: Generated {count} Nuclear SEO pages in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
