
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
GOD_MODE_DB_PATH = os.path.join(BASE_DIR, "god-mode", "data", "parts-database.json")
OUTPUT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/diagnostics"

# Ensure output directory exists
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# --- TEMPLATE ---
DIAGNOSTIC_HEADER = """<!DOCTYPE html>
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
        .glass-card {{ background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }}
    </style>
</head>
<body class="bg-gray-50 text-gray-900 font-sans antialiased">
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

DIAGNOSTIC_BODY = """
    <div class="pt-32 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div class="max-w-4xl mx-auto px-4">
            <!-- Breadcrumb -->
            <nav class="flex mb-8 text-sm text-gray-500">
                <a href="https://partstrading.com/" class="hover:text-yellow-600">Home</a>
                <span class="mx-2">/</span>
                <a href="https://partstrading.com/diagnostics/" class="hover:text-yellow-600">Diagnostics</a>
                <span class="mx-2">/</span>
                <span class="text-gray-900 font-bold">{brand} Troubleshooting</span>
            </nav>

            <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <!-- Header -->
                <div class="bg-gray-900 px-8 py-10 text-white relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
                    <div class="relative z-10">
                        <span class="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold uppercase tracking-wide mb-4 inline-block">Expert Guide</span>
                        <h1 class="text-3xl md:text-5xl font-playfair font-bold mb-4">{h1}</h1>
                        <p class="text-gray-400 text-lg max-w-2xl">Experiencing issues with your {brand} {part_name}? You're not alone. Our experts analyze common failure symptoms and provide the OEM-quality solution.</p>
                    </div>
                </div>

                <div class="p-8 md:p-12">
                     <!-- Symptoms Section -->
                    <div class="mb-12">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">!</span>
                            Common Symptoms
                        </h2>
                        <div class="grid gap-4">
                            {symptoms_html}
                        </div>
                    </div>

                    <!-- Solution Section -->
                    <div class="bg-green-50 rounded-2xl p-8 border border-green-100">
                        <h2 class="text-2xl font-bold text-green-800 mb-4 flex items-center gap-3">
                             <span class="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                             </span>
                            The Solution: {brand} {part_no}
                        </h2>
                        <p class="text-green-700 mb-6">To resolve these issues permanently, we recommend replacing the component with our high-durability aftermarket part.</p>
                        
                        <div class="bg-white p-6 rounded-xl border border-green-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 class="font-bold text-xl text-gray-900">{product_name}</h3>
                                <div class="text-sm text-gray-500 mt-1">Part Number: <span class="font-mono font-bold text-gray-900">{part_no}</span></div>
                            </div>
                            <div class="flex gap-3">
                                <a href="{product_url}" class="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition">View Product</a>
                                <a href="https://wa.me/971501234567?text=Need%20quote%20for%20{brand}%20{part_no}" class="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition">Get Quote</a>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
"""

DIAGNOSTIC_FOOTER = """
    <footer class="bg-gray-900 text-white pt-16 pb-8">
        <div class="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; 2026 Parts Trading Company. Global Shipping.</p>
        </div>
    </footer>
    <script>AOS.init({duration: 800, once: true});</script>
</body>
</html>
"""

def load_database():
    try:
        with open(GOD_MODE_DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading DB: {e}")
        return []

def generate_symptom_html(symptom_list):
    html = ""
    for i, symptom in enumerate(symptom_list):
        html += f"""
        <div class="bg-red-50 p-6 rounded-xl border-l-4 border-red-500">
            <h3 class="font-bold text-red-900 mb-2">Issue #{i+1}</h3>
            <p class="text-red-800">{symptom}</p>
        </div>
        """
    return html

def main():
    print("--- Phase 6: Diagnostic Neural Network Generation ---")
    data = load_database()
    count = 0
    
    for part in data:
        symptoms_raw = part.get("symptoms_list_raw")
        if not symptoms_raw or len(symptoms_raw) < 10: # Simple validation
            continue
            
        try:
            # Parse symptoms (stored as stringified list or list)
            if isinstance(symptoms_raw, str):
                symptoms = json.loads(symptoms_raw)
            else:
                symptoms = symptoms_raw
                
            if not isinstance(symptoms, list) or len(symptoms) == 0:
                continue
                
            # Data Extraction
            brand = part.get("brand", "Generic").title()
            part_no = part.get("part_number", "Unknown")
            part_name = part.get("product_name", f"{brand} {part_no}")
            
            # Content Generation
            title = f"Troubleshooting {brand} {part_name} | Common Problems & Fixes"
            h1 = f"Common Problems with {brand} {part_name}"
            description = f" experiencing {symptoms[0][:50]}...? Learn how to troubleshoot and fix common {brand} {part_no} failures. Expert guide by PTC."
            slug = f"troubleshoot-{brand.lower()}-{part_no.lower().replace(' ', '-')}.html"
            canonical = f"https://partstrading.com/pages/diagnostics/{slug}"
            product_url = part.get("url", f"/pages/intercept/replacement-for-{brand.lower()}-{part_no.lower()}.html") # Fallback logic
            
            symptoms_html = generate_symptom_html(symptoms)
            
            # Assemble HTML
            full_html = DIAGNOSTIC_HEADER.format(title=title, description=description, canonical=canonical) + \
                        DIAGNOSTIC_BODY.format(
                            brand=brand, 
                            h1=h1, 
                            part_name=part_name, 
                            part_no=part_no, 
                            symptoms_html=symptoms_html,
                            product_name=part_name,
                            product_url=product_url
                        ) + \
                        DIAGNOSTIC_FOOTER
                        
            # Write File
            filepath = os.path.join(OUTPUT_DIR, slug)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(full_html)
                
            count += 1
            if count % 100 == 0:
                print(f"Generated {count} pages...")
                
        except Exception as e:
            # print(f"Skipping {part.get('part_number')}: {e}")
            continue
            
    print(f"COMPLETE: Generated {count} Diagnostic Pages in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
