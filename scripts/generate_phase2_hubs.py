
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
LIVE_REPO = os.path.join(BASE_DIR, "aayu203-blip.github.io")
OUTPUT_DIR = os.path.join(LIVE_REPO, "pages", "models")

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
        .hero-pattern {{ background-color: #f3f4f6; background-image: radial-gradient(#d1d5db 1px, transparent 1px); background-size: 20px 20px; }}
    </style>
</head>
<body class="bg-white text-gray-900 font-sans antialiased">
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
                     <a href="https://partstrading.com/#contact" class="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition shadow-md">Get Quote</a>
                </div>
            </div>
        </div>
    </nav>
"""

LIVE_FOOTER = """
    <footer class="bg-gray-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2026 Parts Trading Company. Global Shipping.</p>
        </div>
    </footer>
    <script>AOS.init({duration: 800, once: true});</script>
</body>
</html>
"""

CLUSTERS = [
    {
        "brand": "Caterpillar",
        "model": "3306",
        "title": "Caterpillar 3306 Engine Parts | Rebuild Kits & Components",
        "desc": "Shop premium aftermarket parts for Caterpillar 3306 engines. Pistons, liners, gasket kits, and turbos in stock. Fast global shipping from Dubai.",
        "content_intro": "The Caterpillar 3306 is the workhorse of the heavy equipment industry. We stock a comprehensive range of replacement parts to keep your 3306 running at peak performance."
    },
    {
        "brand": "Caterpillar",
        "model": "3116",
        "title": "Caterpillar 3116 Engine Parts | Injectors & Overhaul Kits",
        "desc": "High-quality replacement parts for CAT 3116 engines. Fuel injectors, pumps, and cylinder heads available. Reliable global delivery.",
        "content_intro": "Known for its reliability in marine and truck applications, the CAT 3116 requires precision parts. Our aftermarket range ensures OEM-level performance at a fraction of the cost."
    },
    {
        "brand": "Caterpillar",
        "model": "3208",
        "title": "Caterpillar 3208 Marine & Truck Engine Parts",
        "desc": "Find parts for Caterpillar 3208 naturally aspirated and turbo engines. Water pumps, crankshafts, and overhaul kits ready to ship.",
        "content_intro": "The V8 CAT 3208 is a legend. Maintain yours with our premium selection of cooling system components, gaskets, and internal engine parts."
    },
    {
        "brand": "Komatsu",
        "model": "Generic",
        "title": "Komatsu Spare Parts | Excavator & Dozer Components",
        "desc": "Complete range of aftermarket Komatsu parts for PC200, D155, and more. Undercarriage, hydraulics, and engine parts in stock.",
        "content_intro": "From the PC200 excavator to the D375 dozer, we supply high-durability replacement parts for the entire Komatsu lineup. maximize uptime with PTC."
    }
]

def generate_hub(cluster):
    slug = f"{cluster['brand'].lower()}-{cluster['model'].lower().replace(' ', '-')}-parts.html"
    if cluster['model'] == "Generic":
        slug = f"{cluster['brand'].lower()}-spare-parts.html"
        
    url = f"https://partstrading.com/pages/models/{slug}"
    
    body = f"""
    <div class="pt-28 pb-16 bg-white min-h-screen">
        <div class="max-w-7xl mx-auto px-4">
             <!-- Breadcrumb -->
            <nav class="flex mb-8 text-sm text-gray-500">
                <a href="https://partstrading.com/" class="hover:text-yellow-600">Home</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900">{cluster['brand']}</span>
                <span class="mx-2">/</span>
                <span class="text-yellow-600 font-bold">{cluster['model']}</span>
            </nav>
            
            <div class="text-center max-w-3xl mx-auto mb-16">
                <h1 class="text-4xl md:text-6xl font-playfair font-bold text-gray-900 mb-6">{cluster['title']}</h1>
                <p class="text-xl text-gray-600">{cluster['content_intro']}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                    <h3 class="text-2xl font-bold mb-4 font-playfair">Engine Components</h3>
                    <p class="text-gray-600 mb-4">Pistons, Liners, Rings, Bearings, and Gasket Kits.</p>
                    <a href="#contact" class="text-yellow-600 font-bold hover:underline">View Catalog &rarr;</a>
                 </div>
                 <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                    <h3 class="text-2xl font-bold mb-4 font-playfair">Fuel & Cooling</h3>
                    <p class="text-gray-600 mb-4">Injectors, Lift Pumps, Water Pumps, and Oil Coolers.</p>
                    <a href="#contact" class="text-yellow-600 font-bold hover:underline">View Catalog &rarr;</a>
                 </div>
                 <div class="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition">
                    <h3 class="text-2xl font-bold mb-4 font-playfair">Hydraulics & Drive</h3>
                    <p class="text-gray-600 mb-4">Pumps, Final Drives, and Transmission parts.</p>
                    <a href="#contact" class="text-yellow-600 font-bold hover:underline">View Catalog &rarr;</a>
                 </div>
            </div>
            
            <!-- Call to Action -->
            <div class="bg-yellow-500 rounded-2xl p-12 text-center relative overflow-hidden">
                <div class="relative z-10">
                    <h2 class="text-3xl font-bold text-black mb-6">Need Parts for {cluster['brand']} {cluster['model']}?</h2>
                    <p class="text-black/80 mb-8 max-w-2xl mx-auto text-lg">We hold massive stock of fast-moving items. Send us your part numbers for an instant quote.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/971501234567" class="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-900 transition">Chat on WhatsApp</a>
                        <a href="#contact" class="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition">Request Quote</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    """
    
    html = LIVE_HEADER.format(title=cluster['title'], description=cluster['desc'], canonical=url) + body + LIVE_FOOTER
    
    filepath = os.path.join(OUTPUT_DIR, slug)
    with open(filepath, 'w') as f:
        f.write(html)
    print(f"Generated Hub: {slug}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    for cluster in CLUSTERS:
        generate_hub(cluster)

if __name__ == "__main__":
    main()
