import os
import re

# New Related Parts Template with Clear Isolation & V6 Marker
RELATED_PARTS_HTML = """
    <!-- Related Parts Section Isolated V6 -->
    <div style="clear: both; width: 100%; display: block;">
        <section class="mt-16 pt-12 border-t border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center uppercase tracking-wider">Equipment Families You May Need</h2>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <a href="https://partstrading.com/pages/hubs/brand-scania.html" class="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 text-center">
                    <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Engine Components</h3>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400 mt-2 font-bold">Pistons, Liners, Gaskets</p>
                </a>
                <a href="https://partstrading.com/#product-categories" class="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 text-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Hydraulics</h3>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400 mt-2 font-bold">Pumps, Seals, Valves</p>
                </a>
                <a href="https://partstrading.com/#product-categories" class="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 text-center">
                    <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Undercarriage</h3>
                    <p class="text-[10px] uppercase tracking-widest text-gray-400 mt-2 font-bold">Tracks, Rollers, Sprockets</p>
                </a>
                <a href="https://partstrading.com/search.html" class="group bg-yellow-400 p-6 rounded-2xl border border-yellow-300 hover:bg-yellow-500 hover:shadow-xl transition-all duration-300 text-center">
                    <div class="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>
                    </div>
                    <h3 class="font-bold text-gray-900">Explore Catalog</h3>
                    <p class="text-[10px] uppercase tracking-widest text-gray-800 mt-2 font-bold">18,000+ Parts Online</p>
                </a>
            </div>
        </section>
    </div>
"""

def polish_file_v6(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. NUKE ALL NAVIGATION AND FOOTER TAGS (Except the body structure)
    # We remove anything between <nav and </nav>
    content = re.sub(r'<nav[^>]*>.*?<\/nav>', '', content, flags=re.DOTALL)
    
    # We remove anything between <footer and </footer>
    content = re.sub(r'<footer[^>]*>.*?<\/footer>', '', content, flags=re.DOTALL)

    # 2. NUKE LEGACY DIV BLOCKS
    # Social Share Section
    content = re.sub(r'<!-- Social Share Section -->.*?<\/div>\s*<\/div>\s*<\/div>', '', content, flags=re.DOTALL)
    # Exit CTA Modal
    content = re.sub(r'<!-- Exit CTA Modal -->.*?<\/div>\s*<\/div>\s*<\/div>', '', content, flags=re.DOTALL)
    # Legacy Related Parts
    content = re.sub(r'<!-- Related Parts Section Isolated.*?>.*?<\/div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- Related Parts Section -->.*?<\/section>', '', content, flags=re.DOTALL)

    # 3. EXTRA AGGRESSIVE FRAGMENT CLEANUP
    mess_pattern = re.compile(r'<h3 class="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">Engine Components<\/h3>.*?<\/section>', re.DOTALL)
    content = mess_pattern.sub('', content)

    # 4. Standardize WhatsApp Buttons with Extreme Visibility Overrides
    wa_btn_pattern = re.compile(r'<a[^>]*href="https:\/\/wa\.me[^>]*>(.*?)<\/a>', re.DOTALL)
    def fix_wa_btn_v6(match):
        full_tag = match.group(0)
        
        # Build the premium green button with absolute inline enforcement
        url_match = re.search(r'href="(https:\/\/wa\.me\/[^"]+)"', full_tag)
        url = url_match.group(1) if url_match else "https://wa.me/919821037990"
        
        return f"""<a href="{url}" 
               style="background-color: #25D366 !important; color: white !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 12px !important; visibility: visible !important; opacity: 1 !important;"
               class="ptc-wa-btn w-full hover:bg-[#1da851] font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-200/50 mb-4 group">
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.384 0 12.031c0 2.126.552 4.195 1.6 6.009L.46 24l6.115-1.602c1.761.942 3.75 1.439 5.807 1.439 6.646 0 12.031-5.383 12.031-12.031C24.413 5.386 19.031 0 12.031 0zm.006 21.666c-1.801 0-3.565-.483-5.115-1.4l-.367-.217-3.801.996.996-3.705L3.5 16.92A9.873 9.873 0 0 1 2.128 12.03C2.128 6.556 6.551 2.133 12.033 2.133A9.88 9.88 0 0 1 21.91 12.034c0 5.472-4.423 9.895-9.878 9.895z" fill-rule="evenodd" clip-rule="evenodd"/></svg>
                Quote via WhatsApp
            </a>"""

    content = wa_btn_pattern.sub(fix_wa_btn_v6, content)

    # 5. Cache Busting (v1.5)
    content = re.sub(r'ptc-components\.js(\?v=[\d\.]+)?', 'ptc-components.js?v=1.5', content)

    # 6. Re-inject Isolated Related Parts Section if missing
    if '</main>' in content:
        if '<!-- Related Parts Section Isolated V6 -->' not in content:
            content = content.replace('</main>', RELATED_PARTS_HTML + '\n    </main>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = '/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/products'
    # Test on a few files first or specifically reported ones
    targets = [
        os.path.join(root_dir, 'aftermarket-scania-302082.html'),
        os.path.join(root_dir, 'aftermarket-scania-323790.html')
    ]
    for target in targets:
        if os.path.exists(target):
            print(f"Polishing target file (V6 Aggressive): {target}")
            polish_file_v6(target)

    files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    print(f"Starting aggressive polish V6 of {len(files)} files...")
    count = 0
    for filename in files:
        file_path = os.path.join(root_dir, filename)
        try:
            polish_file_v6(file_path)
            count += 1
            if count % 2000 == 0:
                print(f"Processed {count} files...")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Finished polishing {count} files with V6 (No Legacy) polish.")

if __name__ == "__main__":
    main()
