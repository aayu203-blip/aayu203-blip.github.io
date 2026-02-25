
import os
import glob
from datetime import datetime

# --- CONFIGURATION ---
BASE_URL = "https://partstrading.com"
OUTPUT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
PAGES_DIR = os.path.join(OUTPUT_DIR, "pages", "diagnostics")
SITEMAP_PATH = os.path.join(OUTPUT_DIR, "sitemap-diagnostics.xml")

def generate_sitemap():
    print(f"--- Generating Sitemap for Diagnostics ---")
    
    # Header
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">"""

    # Find Files
    files = glob.glob(os.path.join(PAGES_DIR, "*.html"))
    print(f"Found {len(files)} diagnostic pages.")
    
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    for file_path in files:
        filename = os.path.basename(file_path)
        url = f"{BASE_URL}/pages/diagnostics/{filename}"
        
        entry = f"""
  <url>
    <loc>{url}</loc>
    <lastmod>{current_date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""
        xml_content += entry

    # Footer
    xml_content += "\n</urlset>"
    
    # Write
    with open(SITEMAP_PATH, 'w', encoding='utf-8') as f:
        f.write(xml_content)
        
    print(f"Successfully generated sitemap at {SITEMAP_PATH}")

if __name__ == "__main__":
    generate_sitemap()
