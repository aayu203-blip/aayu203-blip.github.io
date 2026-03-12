import os
import re
import glob

PROD_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io/pages/products"

def clean_title(title):
    # e.g. "707-76-80020 Komatsu Replacement Component — India | Parts Trading Company"
    # -> "707-76-80020 Komatsu Replacement Component"
    if ' — ' in title:
        title = title.split(' — ')[0]
    elif ' | ' in title:
        title = title.split(' | ')[0]
    return title.strip()

def process_files():
    files = glob.glob(os.path.join(PROD_DIR, "*.html"))
    print(f"Processing {len(files)} files...")
    
    changed_count = 0
    
    for fpath in files:
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract Title
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if not title_match:
            continue
            
        full_title = title_match.group(1).strip()
        display_title = clean_title(full_title)
        
        # Extract Part No (assuming it's the first word if it has digits/dashes)
        # title is like "SKU BRAND DESCRIPTION"
        title_parts = display_title.split(' ')
        sku = title_parts[0]
        # Rest of title for the second line of H1
        description = " ".join(title_parts[1:])
        
        # If SKU doesn't look like a SKU, fallback
        if not any(char.isdigit() for char in sku) and len(sku) < 4:
           sku = "PART"
           description = display_title

        # H1 replacement block
        # We target the entire <h1>...</h1> block
        h1_pattern = re.compile(r'<h1[^>]*>.*?</h1>', re.DOTALL)
        
        new_h1 = f"""<h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                    <span class="font-mono text-yellow-500 mr-2 drop-shadow-sm">{sku}</span><br/>
                    {description}
                </h1>"""
        
        new_content = h1_pattern.sub(new_h1, content)
        
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            changed_count += 1
            if changed_count % 1000 == 0:
                print(f"Updated {changed_count} files...")

    print(f"Finished. Total files updated: {changed_count}")

if __name__ == "__main__":
    process_files()
