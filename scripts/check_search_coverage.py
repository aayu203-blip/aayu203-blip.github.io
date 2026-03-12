import os

BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
PROD_DIR = os.path.join(BASE_DIR, "pages", "products")
PRODUCT_PATHS_FILE = os.path.join(BASE_DIR, "assets", "js", "product-paths.js")

def check_coverage():
    # 1. Get all files in pages/products
    files = {f for f in os.listdir(PROD_DIR) if f.endswith('.html')}
    print(f"Total product files: {len(files)}")

    # 2. Get all paths referenced in product-paths.js
    indexed_paths = set()
    try:
        with open(PRODUCT_PATHS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        import re
        # Match "/pages/products/aftermarket-scania-302082.html"
        matches = re.findall(r'":\s*"([^"]+)"', content)
        for m in matches:
            if '/pages/products/' in m:
                indexed_paths.add(os.path.basename(m))
    except Exception as e:
        print(f"Error reading index: {e}")

    print(f"Total files in index: {len(indexed_paths)}")

    # 3. Find files NOT in index
    unindexed = files - indexed_paths
    print(f"Files NOT in index: {len(unindexed)}")

    if unindexed:
        print("\nExamples of unindexed files:")
        for u in list(unindexed)[:10]:
            print(f"  {u}")

if __name__ == "__main__":
    check_coverage()
