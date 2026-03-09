import os
import glob
from math import ceil
from datetime import datetime

# Configuration
BASE_URL = "https://partstrading.com"
PRODUCT_DIR = "pages/products"
SITEMAP_PREFIX = "sitemap-products-"
MAX_URLS_PER_SITEMAP = 10000
TODAY = datetime.now().strftime("%Y-%m-%d")

def generate_sitemaps():
    print("Pre-fetching all valid HTML product routes...")
    files = glob.glob(f"{PRODUCT_DIR}/*.html")
    
    if not files:
        print("Error: No product files found!")
        return
        
    print(f"Discovered {len(files)} physical product files.")
    
    total_sitemaps = ceil(len(files) / MAX_URLS_PER_SITEMAP)
    print(f"Splitting across {total_sitemaps} XML Sitemaps...")
    
    for i in range(total_sitemaps):
        sitemap_num = i + 1
        sitemap_filename = f"{SITEMAP_PREFIX}{sitemap_num}.xml"
        
        start_idx = i * MAX_URLS_PER_SITEMAP
        end_idx = min((i + 1) * MAX_URLS_PER_SITEMAP, len(files))
        batch = files[start_idx:end_idx]
        
        with open(sitemap_filename, 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="utf-8"?>\n')
            f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
            
            for filepath in batch:
                url_path = filepath.replace('\\', '/')
                full_url = f"{BASE_URL}/{url_path}"
                
                f.write('  <url>\n')
                f.write(f'    <loc>{full_url}</loc>\n')
                f.write(f'    <lastmod>{TODAY}</lastmod>\n')
                f.write('    <changefreq>weekly</changefreq>\n')
                f.write('    <priority>0.8</priority>\n')
                f.write('  </url>\n')
                
            f.write('</urlset>\n')
            
        print(f"Generated {sitemap_filename} with {len(batch)} URLs.")
        
    generate_sitemap_index(total_sitemaps)

def generate_sitemap_index(total_product_sitemaps):
    print("Generating Master Sitemap Index (sitemap.xml)...")
    
    with open('sitemap.xml', 'w', encoding='utf-8') as index_f:
        index_f.write('<?xml version="1.0" encoding="utf-8"?>\n')
        index_f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        
        # Core sitemaps
        core_sitemaps = ['sitemap-main.xml', 'sitemap-categories.xml', 'sitemap-blog.xml', 'sitemap-landings.xml']
        for smap in core_sitemaps:
            if os.path.exists(smap):
                index_f.write('  <sitemap>\n')
                index_f.write(f'    <loc>{BASE_URL}/{smap}</loc>\n')
                index_f.write(f'    <lastmod>{TODAY}</lastmod>\n')
                index_f.write('  </sitemap>\n')
                
        # Dynamic product sitemaps
        for i in range(total_product_sitemaps):
            sitemap_num = i + 1
            index_f.write('  <sitemap>\n')
            index_f.write(f'    <loc>{BASE_URL}/{SITEMAP_PREFIX}{sitemap_num}.xml</loc>\n')
            index_f.write(f'    <lastmod>{TODAY}</lastmod>\n')
            index_f.write('  </sitemap>\n')
            
        index_f.write('</sitemapindex>\n')
        
    print("✅ Master sitemap.xml regenerated successfully.")

if __name__ == "__main__":
    generate_sitemaps()
