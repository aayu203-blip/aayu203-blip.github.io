import os, json, re

BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
PRODUCT_PATHS_FILE = os.path.join(BASE_DIR, "assets", "js", "product-paths.js")

def load_index():
    try:
        with open(PRODUCT_PATHS_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse logic to extract paths even if JS isn't perfect JSON
        paths = set()
        for line in content.split('\n'):
            # Matches "key": "/path/to/file.html"
            m = re.search(r'":\s*"([^"]+)"', line)
            if m:
                paths.add(m.group(1))
        return paths
    except Exception as e:
        print(f"Error loading index: {e}")
        return set()

def verify():
    paths = load_index()
    if not paths:
        print("No paths found to verify.")
        return

    print(f"Checking {len(paths)} unique paths from index...")
    missing = []
    found_count = 0
    
    for p in paths:
        # Clean path (remove leading slash for OS join)
        rel_p = p.lstrip('/')
        abs_p = os.path.join(BASE_DIR, rel_p)
        
        if os.path.exists(abs_p):
            found_count += 1
        else:
            missing.append(p)
    
    print(f"Summary:")
    print(f"  Total Checked: {len(paths)}")
    print(f"  Valid Files:   {found_count}")
    print(f"  Missing Files: {len(missing)}")
    
    if missing:
        print("\nFirst 20 missing paths:")
        for m in missing[:20]:
            print(f"  [MISSING] {m}")
            
    # Also check if they exist at root /products/ as a guess
    if missing:
        print("\nChecking if missing files exist at root /products/ instead...")
        fixed_guesses = 0
        for m in missing:
            fname = os.path.basename(m)
            root_p = os.path.join(BASE_DIR, "products", fname)
            if os.path.exists(root_p):
                fixed_guesses += 1
        print(f"  Found {fixed_guesses} of these at root /products/ folder.")

if __name__ == "__main__":
    verify()
