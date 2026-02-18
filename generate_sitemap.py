import os
from datetime import datetime

BASE_URL = "https://partstrading.com"
TARGET_DIRS = ["volvo", "scania"]
OUTPUT_FILE = "sitemap.xml"

def generate_sitemap():
    urls = []
    # Add home page and static pages
    static_pages = [
        "",
        "blog/index.html",
        "pages/volvo-categories.html",
        "pages/scania-categories.html"
    ]
    
    timestamp = datetime.now().strftime("%Y-%m-%d")
    
    for page in static_pages:
        full_url = f"{BASE_URL}/{page}" if page else BASE_URL
        urls.append((full_url, timestamp))

    count = 0
    for target_dir in TARGET_DIRS:
        if not os.path.exists(target_dir):
            print(f"Warning: Directory {target_dir} not found.")
            continue
            
        for root, _, files in os.walk(target_dir):
            for file in files:
                if file.endswith(".html"):
                    path = os.path.join(root, file)
                    
                    # Create URL
                    # Ensure forward slashes
                    url_path = path.replace("\\", "/") 
                    full_url = f"{BASE_URL}/{url_path}"
                    
                    # Use file modification time
                    try:
                        mtime = os.path.getmtime(path)
                        date_str = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
                    except Exception:
                        date_str = timestamp
                    
                    urls.append((full_url, date_str))
                    count += 1
    
    # Write XML
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for url, date in urls:
            f.write('  <url>\n')
            f.write(f'    <loc>{url}</loc>\n')
            f.write(f'    <lastmod>{date}</lastmod>\n')
            f.write('  </url>\n')
        f.write('</urlset>')
    
    print(f"Success! Generated sitemap.xml with {len(urls)} URLs ({count} product pages).")

if __name__ == "__main__":
    generate_sitemap()
