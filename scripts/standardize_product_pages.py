import os
import re

BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
PROD_DIR = os.path.join(BASE_DIR, "pages", "products")

# Mapping of brand keywords to hub URLs
BRAND_HUBS = {
    'volvo': '/pages/hubs/brand-volvo.html',
    'komatsu': '/pages/hubs/brand-komatsu.html',
    'cat': '/pages/hubs/brand-cat.html',
    'caterpillar': '/pages/hubs/brand-cat.html',
    'hitachi': '/pages/hubs/brand-hitachi.html',
    'scania': '/pages/hubs/brand-scania.html',
    'jcb': '/jcb-spare-parts-india.html',
    'doosan': '/doosan-spare-parts-india.html',
    'atlas': '/atlas-copco-spare-parts-india.html',
    'liebherr': '/liebherr-spare-parts-india.html',
    'normet': '/normet-spare-parts-india.html',
    'wirtgen': '/wirtgen-spare-parts-india.html',
    'bell': '/bell-equipment-parts.html',
    'terex': '/terex-grove-crane-parts-india.html',
    'grove': '/terex-grove-crane-parts-india.html'
}

def get_hub_for_file(filename):
    filename = filename.lower()
    for brand, hub in BRAND_HUBS.items():
        if brand in filename:
            return hub
    return "https://partstrading.com/#product-categories"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    brand_hub = get_hub_for_file(filename)

    # 1. Remove legacy search scripts (the one containing getProductPageLink)
    # Looking for a script block that contains 'function getProductPageLink'
    script_pattern = re.compile(r'<script>\s*function showSearchResults.*?function getProductPageLink.*?</script>', re.DOTALL)
    new_content = script_pattern.sub('', content)

    # 2. Standardize Related Parts Links
    # Replacing the generic homepage links with brand-specific hub links
    # We look for the Related Parts div and update the first 3 links
    related_parts_pattern = re.compile(r'(<div class="grid grid-cols-2 md:grid-cols-4 gap-4">.*?)(https://partstrading.com/#product-categories)(.*?)', re.DOTALL)
    
    # We replace up to 3 occurrences of the generic link
    def replace_links(match):
        inner = match.group(0)
        return inner.replace('https://partstrading.com/#product-categories', brand_hub)
    
    new_content = related_parts_pattern.sub(replace_links, new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    modified_count = 0
    files = [f for f in os.listdir(PROD_DIR) if f.endswith('.html')]
    total = len(files)
    
    print(f"Standardizing {total} product pages...")
    
    for i, filename in enumerate(files):
        filepath = os.path.join(PROD_DIR, filename)
        if process_file(filepath):
            modified_count += 1
        
        if (i + 1) % 1000 == 0:
            print(f"Processed {i + 1}/{total} files...")

    print(f"Done! Modified {modified_count} files.")

if __name__ == "__main__":
    main()
