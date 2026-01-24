import requests
import xml.etree.ElementTree as ET
import time

SITEMAPS = [
    f"https://www.sparepower.co.za/product-sitemap{i}.xml" for i in range(1, 16)
]

def download_sitemaps():
    all_urls = []
    print("🚀 Starting Sitemap Harvest...")
    
    headers = {'User-Agent': 'Mozilla/5.0 (Compatible; SitemapHarvester/1.0)'}

    for url in SITEMAPS:
        print(f"  ⬇️ Fetching {url}...")
        try:
            res = requests.get(url, headers=headers)
            if res.status_code != 200:
                print(f"    ❌ Failed: {res.status_code}")
                continue
            
            # Parse XML
            root = ET.fromstring(res.content)
            # Namespace map usually needed for sitemaps
            ns = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            
            urls = [url_tag.text for url_tag in root.findall('.//sm:loc', ns)]
            print(f"    ✅ Found {len(urls)} URLs")
            all_urls.extend(urls)
            
            time.sleep(0.5)
            
        except Exception as e:
            print(f"    ❌ Error: {e}")

    print(f"🎉 Total Product URLs Found: {len(all_urls)}")
    
    # Save uniqueness just in case
    unique_urls = sorted(list(set(all_urls)))
    print(f"🎉 Unique Product URLs: {len(unique_urls)}")
    
    with open('all_product_urls.txt', 'w') as f:
        for u in unique_urls:
            f.write(u + "\n")

if __name__ == "__main__":
    download_sitemaps()
