import os
from datetime import datetime
import math

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
BASE_URL = "https://partstrading.com"

EXCLUDE_DIRS = ['.git', 'node_modules', 'scripts', 'god-mode', 'pages_backup', 'BACKUP', 'backup', 'styles', 'assets', 'images']
IGNORE_FILES = ['404.html', 'template.html', 'live_footer.html', 'live_header.html']

def generate_sitemap_xml(urls):
    xml_content = '<?xml version="1.0" encoding="utf-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    today = datetime.now().strftime('%Y-%m-%d')
    for url in urls:
        priority = "0.8"
        if url == BASE_URL + "/":
            priority = "1.0"
        elif "/products/" in url or "/local/" in url:
            priority = "0.9"
        elif "/pages/" in url:
            priority = "0.7"
            
        xml_content += f'  <url>\n'
        xml_content += f'    <loc>{url}</loc>\n'
        xml_content += f'    <lastmod>{today}</lastmod>\n'
        xml_content += f'    <changefreq>weekly</changefreq>\n'
        xml_content += f'    <priority>{priority}</priority>\n'
        xml_content += f'  </url>\n'
        
    xml_content += '</urlset>'
    return xml_content

def generate_sitemap_index(sitemaps):
    xml_content = '<?xml version="1.0" encoding="utf-8"?>\n'
    xml_content += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    today = datetime.now().strftime('%Y-%m-%d')
    for sitemap in sitemaps:
        xml_content += f'  <sitemap>\n'
        xml_content += f'    <loc>{BASE_URL}/{sitemap}</loc>\n'
        xml_content += f'    <lastmod>{today}</lastmod>\n'
        xml_content += f'  </sitemap>\n'
        
    xml_content += '</sitemapindex>'
    return xml_content

def main():
    print("Scanning for all HTML files...")
    all_urls = []
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Exclude directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and not any(excl in d for excl in EXCLUDE_DIRS) and d not in EXCLUDE_DIRS]
        
        for file in files:
            if file.endswith('.html') and file not in IGNORE_FILES:
                filepath = os.path.join(root, file)
                # Convert to URL
                rel_path = os.path.relpath(filepath, ROOT_DIR)
                
                # Replace backslashes for Windows just in case
                rel_path = rel_path.replace("\\", "/")
                
                if rel_path == "index.html":
                    url = BASE_URL + "/"
                else:
                    url = BASE_URL + "/" + rel_path
                    
                all_urls.append(url)
                
    print(f"Found {len(all_urls)} total URLs.")
    
    # Categorize URLs
    categories = {
        'main': [],
        'localized_es': [],
        'localized_fr': [],
        'localized_pt': [],
        'localized_ru': [],
        'localized_ar': [],
        'localized_zh': [],
        'localized_cn': [],
        'localized_hi': [],
        'localized_id': [],
        'legacy_products': [],
        'diagnostic': [],
        'intercept': [],
        'other': []
    }
    
    for url in all_urls:
        if "/es/" in url: categories['localized_es'].append(url)
        elif "/fr/" in url: categories['localized_fr'].append(url)
        elif "/pt/" in url: categories['localized_pt'].append(url)
        elif "/ru/" in url: categories['localized_ru'].append(url)
        elif "/ar/" in url: categories['localized_ar'].append(url)
        elif "/zh/" in url: categories['localized_zh'].append(url)
        elif "/cn/" in url: categories['localized_cn'].append(url)
        elif "/hi/" in url: categories['localized_hi'].append(url)
        elif "/id/" in url: categories['localized_id'].append(url)
        elif "/volvo/braking/" in url or "/scania/" in url or "/komatsu/" in url or "/caterpillar/" in url or "/hitachi/" in url or "/kobelco/" in url:
            # Check if it's not a localized page (which is caught above)
            categories['legacy_products'].append(url)
        elif "/diagnostic/" in url: categories['diagnostic'].append(url)
        elif "/intercept/" in url: categories['intercept'].append(url)
        else: categories['main'].append(url)
        
    sitemap_files = []
    
    # Process each category
    for cat_name, urls in categories.items():
        if not urls: continue
        
        # Max URLs per sitemap is 50,000, but let's chunk at 10,000 to be safe and fast
        chunk_size = 10000
        num_chunks = math.ceil(len(urls) / chunk_size)
        
        for i in range(num_chunks):
            chunk_urls = urls[i*chunk_size : (i+1)*chunk_size]
            
            sitemap_name = f"sitemap-{cat_name}.xml" if num_chunks == 1 else f"sitemap-{cat_name}-{i+1}.xml"
            
            xml_content = generate_sitemap_xml(chunk_urls)
            with open(os.path.join(ROOT_DIR, sitemap_name), 'w', encoding='utf-8') as f:
                f.write(xml_content)
                
            sitemap_files.append(sitemap_name)
            print(f"Generated {sitemap_name} with {len(chunk_urls)} URLs.")
    
    # Generate main index
    index_content = generate_sitemap_index(sitemap_files)
    with open(os.path.join(ROOT_DIR, "sitemap_index.xml"), 'w', encoding='utf-8') as f:
        f.write(index_content)
        
    print(f"Successfully generated sitemap_index.xml linking to {len(sitemap_files)} sub-sitemaps.")

if __name__ == "__main__":
    main()
