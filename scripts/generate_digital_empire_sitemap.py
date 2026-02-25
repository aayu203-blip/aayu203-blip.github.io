
import os
import datetime
from xml.etree import ElementTree as ET

# Configuration
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
PAGES_DIR = os.path.join(BASE_DIR, "pages")
SITEMAP_FILENAME = "sitemap-digital-empire.xml"
SITEMAP_PATH = os.path.join(BASE_DIR, SITEMAP_FILENAME)
INDEX_PATH = os.path.join(BASE_DIR, "sitemap.xml")

BASE_URL = "https://partstrading.com"

def generate_url_xml(path, priority):
    """Generates URL XML block"""
    url = f"{BASE_URL}/{path}"
    date = datetime.date.today().isoformat()
    return f"""  <url>
    <loc>{url}</loc>
    <lastmod>{date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
  </url>"""

def scan_files():
    urls = []
    
    # 1. Scan Intercept Pages
    intercept_dir = os.path.join(PAGES_DIR, "intercept")
    if os.path.exists(intercept_dir):
        print(f"Scanning {intercept_dir}...")
        for f in os.listdir(intercept_dir):
            if f.endswith(".html"):
                path = f"pages/intercept/{f}"
                urls.append((path, "0.7"))
    
    # 2. Scan Model Hubs
    models_dir = os.path.join(PAGES_DIR, "models")
    if os.path.exists(models_dir):
        print(f"Scanning {models_dir}...")
        for f in os.listdir(models_dir):
            if f.endswith(".html") and not f.startswith("template"):
                path = f"pages/models/{f}"
                urls.append((path, "0.9"))
                
    return urls

def create_sitemap():
    print("--- Generating Digital Empire Sitemap ---")
    urls = scan_files()
    print(f"Found {len(urls)} pages.")
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for path, priority in urls:
        xml_content += generate_url_xml(path, priority) + "\n"
        
    xml_content += '</urlset>'
    
    with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
        f.write(xml_content)
    print(f"Created: {SITEMAP_PATH}")

def update_index():
    print("--- Updating Sitemap Index ---")
    
    # Check if entry already exists
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    sitemap_url = f"{BASE_URL}/{SITEMAP_FILENAME}"
    
    if sitemap_url in content:
        print("Sitemap already in index.")
        return
        
    # Parse XML to append strictly
    # Because simple string replacement on </sitemapindex> is safer than full parsing which might enforce namespaces awkwardly
    
    new_entry = f"""  <sitemap>
    <loc>{sitemap_url}</loc>
    <lastmod>{datetime.date.today().isoformat()}</lastmod>
  </sitemap>
</sitemapindex>"""
    
    new_content = content.replace("</sitemapindex>", new_entry)
    
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Updated sitemap index.")

if __name__ == "__main__":
    create_sitemap()
    update_index()
