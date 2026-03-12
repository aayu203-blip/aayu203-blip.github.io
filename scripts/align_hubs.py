import os
import re

BRANDS = {
    'scania': {'name': 'Scania', 'color': 'yellow-400', 'desc': 'Premium Swedish Truck Spares'},
    'volvo': {'name': 'Volvo', 'color': 'yellow-400', 'desc': 'Heavy Duty Construction Spares'},
    'cat': {'name': 'Caterpillar', 'color': 'yellow-500', 'desc': 'Earthmoving & Mining Spares'},
    'komatsu': {'name': 'Komatsu', 'color': 'blue-400', 'desc': 'Excavator & Industrial Spares'},
    'jcb': {'name': 'JCB', 'color': 'yellow-400', 'desc': 'Construction & Agricultural Spares'},
    'hitachi': {'name': 'Hitachi', 'color': 'orange-500', 'desc': 'Mining & Excavator Spares'},
    'kobelco': {'name': 'Kobelco', 'color': 'cyan-500', 'desc': 'High Performance Hydraulics'},
    'epiroc': {'name': 'Epiroc', 'color': 'yellow-400', 'desc': 'Mining & Rock Excavation'},
    'atlas-copco': {'name': 'Atlas Copco', 'color': 'blue-500', 'desc': 'Industrial & Air Spares'},
    'sandvik': {'name': 'Sandvik', 'color': 'yellow-400', 'desc': 'Mining & Construction Spares'},
    'bell': {'name': 'Bell', 'color': 'yellow-600', 'desc': 'Articulated Truck Spares'},
    'liebherr': {'name': 'Liebherr', 'color': 'yellow-500', 'desc': 'Specialized Heavy Spares'},
    'terex': {'name': 'Terex', 'color': 'white', 'desc': 'Material Processing Spares'},
    'normet': {'name': 'Normet', 'color': 'red-500', 'desc': 'Underground Mining Spares'},
    'wirtgen': {'name': 'Wirtgen', 'color': 'blue-600', 'desc': 'Road Construction Spares'}
}

HERO_TEMPLATE = """
    <!-- Premium Brand Hero Section -->
    <div class="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900 pt-20">
        <!-- Dynamic Background Text -->
        <div class="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
            <span class="text-[25vw] font-black text-white uppercase tracking-tighter">{brand_name}</span>
        </div>
        
        <!-- Animated Particles/Lines (Simplified from index) -->
        <div class="absolute inset-0 z-0">
            <div class="absolute top-1/4 left-10 w-32 h-px bg-gradient-to-r from-transparent via-{brand_color}/50 to-transparent animate-pulse"></div>
            <div class="absolute bottom-1/3 right-20 w-48 h-px bg-gradient-to-r from-transparent via-{brand_color}/30 to-transparent animate-pulse" style="animation-delay: 1s"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-{brand_color}/5 rounded-full blur-[120px]"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-{brand_color} uppercase tracking-widest animate-fade-in">
                <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-{brand_color} opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-{brand_color}"></span>
                </span>
                Trusted Since 1956
            </div>
            
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tight">
                {brand_name} <span class="text-{brand_color} block md:inline">Spare Parts</span>
            </h1>
            
            <p class="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Direct access to {brand_desc}. 100% verified compatibility. 
                Same-day dispatch from Mumbai HQ to global mining & construction hubs.
            </p>

            <div class="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/919821037990" class="px-8 py-4 bg-{brand_color} text-gray-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-{brand_color}/20 flex items-center gap-2">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.284l-.569 2.1c-.128.466.316.891.751.722l2.122-.866a5.731 5.731 0 0 0 2.426.526c3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.768-5.766z"/></svg>
                    WhatsApp Quote
                </a>
                <a href="#contact" class="px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
                    Email RFQ
                </a>
            </div>
            
            <!-- Stats -->
            <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10">
                <div class="text-center">
                    <div class="text-2xl font-black text-white">18k+</div>
                    <div class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Parts Online</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-black text-{brand_color}">Ready</div>
                    <div class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">In-Stock Shop</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-black text-white">70y+</div>
                    <div class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Global Legacy</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-black text-{brand_color}">1hr</div>
                    <div class="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Quote Response</div>
                </div>
            </div>
        </div>
    </div>
"""

def align_hub(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine brand
    brand_key = os.path.basename(file_path).replace('brand-', '').replace('.html', '')
    brand_info = BRANDS.get(brand_key, {'name': brand_key.capitalize(), 'color': 'yellow-400', 'desc': 'High Quality Heavy Equipment Spares'})

    # 1. Remove Navigation (handled by ptc-components.js now, but the hub file has a hardcoded nav)
    # Actually, we should keep a placeholder or just let inject() handle it.
    # The hub files have a navigation block from line 95 to 214.
    nav_pattern = re.compile(r'<nav.*?Main Navigation.*?</nav>', re.DOTALL)
    content = nav_pattern.sub('<nav id="ptc-nav-placeholder"></nav>', content)

    # 2. Remove Breadcrumb Navigation
    breadcrumb_pattern = re.compile(r'<!-- Breadcrumb Navigation -->.*?<nav.*?>.*?</nav>', re.DOTALL)
    content = breadcrumb_pattern.sub('', content)

    # 3. Remove Page Header (old title section)
    # It usually starts at <!-- Main Content --> and goes to the search bar
    header_pattern = re.compile(r'<div class="text-center mb-12">.*?<div class="w-24 h-1 bg-yellow-400 mx-auto mt-6 rounded-full"></div>\s*</div>', re.DOTALL)
    content = header_pattern.sub('', content)

    # 4. Inject Premium Hero
    hero_html = HERO_TEMPLATE.format(
        brand_name=brand_info['name'],
        brand_color=brand_info['color'],
        brand_desc=brand_info['desc']
    )
    
    # Insert after Nav placeholder
    content = content.replace('<nav id="ptc-nav-placeholder"></nav>', '<nav id="ptc-nav-placeholder"></nav>\n' + hero_html)

    # 5. Fix Page Background to dark for better transition if needed, 
    # but the hero is dark and the grid is light.
    # We should add a divider.
    content = content.replace('<!-- Products Grid -->', '<div class="py-12 bg-white"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><!-- Products Grid -->')
    # Close the div before </footer> or </body>
    if '</body>' in content:
        content = content.replace('</body>', '</div></div>\n</body>')

    # 6. Ensure Search Bar is inside the white block
    search_bar_pattern = re.compile(r'<!-- Search Bar -->.*?</div>\s*</div>', re.DOTALL)
    match = search_bar_pattern.search(content)
    if match:
        search_html = match.group(0)
        content = content.replace(search_html, '')
        content = content.replace('<!-- Products Grid -->', search_html + '\n<!-- Products Grid -->')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = '/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/hubs'
    files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    print(f"Starting Hub Alignment for {len(files)} files...")
    
    for filename in files:
        file_path = os.path.join(root_dir, filename)
        try:
            align_hub(file_path)
            print(f"Aligned {filename}")
        except Exception as e:
            print(f"Error alignment {filename}: {e}")

    print(f"Finished aligning all hubs.")

if __name__ == "__main__":
    main()
