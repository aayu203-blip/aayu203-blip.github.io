import os
import re

# New Related Parts Template
RELATED_PARTS_HTML = """
    <!-- Related Parts Section -->
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
"""

def polish_file_v3(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Clean up "broken" Related Parts - Use accurate pattern matching
    related_parts_pattern = re.compile(r'<!-- Related Parts -->.*?<div class="grid grid-cols-2 md:grid-cols-4 gap-4">.*?<\/div>\s*<\/div>\s*<\/div>', re.DOTALL)
    content = related_parts_pattern.sub('', content)
    
    # 1b. Also remove any orphaned versions of relevant text
    content = content.replace('Related Parts You May Need', '')

    # 2. Fix WhatsApp Button Visibility & Color (ensure it's not white)
    # Target any wa.me link with white background and replace with green
    white_wa_pattern = re.compile(r'class="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-bold py-3\.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6"\s*href="https:\/\/wa\.me', re.MULTILINE)
    content = white_wa_pattern.sub('class="w-full bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-200/50 mb-4 group"\nhref="https://wa.me', content)

    # 3. Aggressive removal of remaining "chassis" mentions
    content = re.sub(r'<p class="text-xs text-gray-500 mb-4 border-b border-gray-100 pb-4">Always verify fitment with your engine serial number.*?</p>', '', content, flags=re.DOTALL)
    content = re.sub(r'Verification with a chassis number.*?', '', content, flags=re.IGNORECASE)

    # 4. Final Placement of Related Parts - Ensure it's inside <main> at the very end
    if '</main>' in content:
        # Avoid duplicate insertions
        if '<!-- Related Parts Section -->' not in content:
            content = content.replace('</main>', RELATED_PARTS_HTML + '\n    </main>')
    
    # 5. Fix structure where Related Parts might have ended up AFTER </main>
    if '<!-- Related Parts Section -->' in content and content.index('<!-- Related Parts Section -->') > (content.index('</main>') if '</main>' in content else 0):
        # We need to move it inside
        parts_block = re.search(r'<!-- Related Parts Section -->.*?<\/section>', content, re.DOTALL)
        if parts_block:
            block_html = parts_block.group(0)
            content = content.replace(block_html, '')
            content = content.replace('</main>', block_html + '\n    </main>')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    root_dir = '/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/products'
    files = [f for f in os.listdir(root_dir) if f.endswith('.html')]
    
    print(f"Starting polish V3 of {len(files)} files...")
    
    count = 0
    for filename in files:
        file_path = os.path.join(root_dir, filename)
        try:
            polish_file_v3(file_path)
            count += 1
            if count % 1000 == 0:
                print(f"Processed {count} files...")
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"Finished polishing {count} files with V3 polish.")

if __name__ == "__main__":
    main()
