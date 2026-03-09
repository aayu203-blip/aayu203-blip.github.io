import os
import glob
from math import ceil

# Configuration
BASE_URL = "https://partstrading.com"
PRODUCT_DIR = "pages/products"
OUTPUT_DIR = "pages/sitemap"
PRODUCTS_PER_PAGE = 2000

def generate_html_sitemap():
    print("Pre-fetching all valid HTML product routes...")
    files = glob.glob(f"{PRODUCT_DIR}/*.html")
    files.sort() # Ensure consistent ordering
    
    if not files:
        print("Error: No product files found!")
        return
        
    print(f"Discovered {len(files)} physical product files.")
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    total_pages = ceil(len(files) / PRODUCTS_PER_PAGE)
    print(f"Generating {total_pages} paginated HTML sitemap hubs...")
    
    for i in range(total_pages):
        page_num = i + 1
        page_filename = f"{OUTPUT_DIR}/index-{page_num}.html"
        if page_num == 1:
            page_filename = f"{OUTPUT_DIR}/index.html"
            
        start_idx = i * PRODUCTS_PER_PAGE
        end_idx = min((i + 1) * PRODUCTS_PER_PAGE, len(files))
        batch = files[start_idx:end_idx]
        
        with open(page_filename, 'w', encoding='utf-8') as f:
            # HTML Header & SEO
            f.write('<!DOCTYPE html>\n')
            f.write('<html lang="en">\n')
            f.write('<head>\n')
            f.write('    <meta charset="UTF-8">\n')
            f.write('    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
            f.write(f'    <title>Global Parts Catalog Sitemap - Page {page_num} | Parts Trading Company</title>\n')
            f.write(f'    <meta name="description" content="Complete directory of genuine and aftermarket heavy equipment spare parts. View catalog page {page_num}.">\n')
            f.write('    <meta name="robots" content="index, follow">\n')
            f.write('    <link rel="stylesheet" href="/assets/css/tailwind.css">\n')
            f.write('</head>\n')
            f.write('<body class="bg-gray-50 text-gray-900 font-sans">\n')
            
            # Simple Header
            f.write('    <header class="bg-gray-900 text-white py-6 shadow-md">\n')
            f.write('        <div class="max-w-7xl mx-auto px-4">\n')
            f.write('            <h1 class="text-3xl font-bold text-yellow-500">Parts Trading Company Index</h1>\n')
            f.write('            <p class="text-gray-300">Complete Master Catalog Directory</p>\n')
            f.write('        </div>\n')
            f.write('    </header>\n')
            
            # Content
            f.write('    <main class="max-w-7xl mx-auto px-4 py-8">\n')
            f.write('        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">\n')
            f.write(f'            <h2 class="text-xl font-bold border-b border-gray-100 pb-4 mb-4">Catalog Section {page_num} ({start_idx + 1} - {end_idx})</h2>\n')
            
            # Grid of links
            f.write('            <ul class="grid grid-cols-1 md:grid-cols-2 text-sm leading-relaxed gap-x-8 gap-y-2">\n')
            
            for filepath in batch:
                # Convert path to clean title
                filename = os.path.basename(filepath)
                part_name = filename.replace('.html', '').replace('-', ' ').upper()
                
                # Relative linking for robust routing
                # e.g. from /pages/sitemap/index.html to /pages/products/foo.html
                # So we link to `../products/foo.html`
                f.write(f'                <li><a href="../products/{filename}" class="text-blue-600 hover:text-blue-800 hover:underline">{part_name}</a></li>\n')
                
            f.write('            </ul>\n')
            f.write('        </div>\n')
            
            # Pagination Controls
            f.write('        <div class="mt-8 flex flex-wrap gap-2 justify-center">\n')
            for p in range(1, total_pages + 1):
                link = "index.html" if p == 1 else f"index-{p}.html"
                active_class = "bg-yellow-500 text-gray-900 font-bold" if p == page_num else "bg-white border text-gray-600 hover:bg-gray-50"
                f.write(f'            <a href="{link}" class="px-3 py-1 rounded {active_class} transition-colors">{p}</a>\n')
            f.write('        </div>\n')
            
            # Back Home
            f.write('        <div class="mt-8 text-center">\n')
            f.write('            <a href="/" class="text-gray-500 hover:text-yellow-600 font-medium">&larr; Back to Homepage</a>\n')
            f.write('        </div>\n')
            
            f.write('    </main>\n')
            f.write('</body>\n')
            f.write('</html>\n')
            
        updated_file = "index.html" if page_num == 1 else f"index-{page_num}.html"
        print(f"Generated {OUTPUT_DIR}/{updated_file}")

    # Inject the HTML sitemap into the footer of index.html
    link_html_sitemap()

def link_html_sitemap():
    print("Linking HTML Sitemap to Homepage Footer...")
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'Global Catalog Directory' not in content:
            # We will softly insert it next to "Quick Links" in the footer
            content = content.replace(
                '<li><a href="#about" class="text-gray-400',
                '<li><a href="/pages/sitemap/" class="text-yellow-500 font-bold hover:text-yellow-400 transition-colors">Global Catalog Directory</a></li>\n                                <li><a href="#about" class="text-gray-400'
            )
            
            with open('index.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("✅ Injected link into index.html footer.")
        else:
            print("ℹ️ Link already exists in index.html.")
            
    except Exception as e:
        print(f"Error injecting link: {e}")

if __name__ == "__main__":
    generate_html_sitemap()
