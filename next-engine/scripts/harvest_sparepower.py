import requests
from bs4 import BeautifulSoup
import json
import time

SEEDS = [
    "https://www.sparepower.co.za/parts/parts-to-suit-volvo/articulated-dump-truck/",
    "https://www.sparepower.co.za/parts/parts-to-suit-volvo/wheel-loaders/",
    "https://www.sparepower.co.za/parts/parts-to-suit-volvo/excavators/",
    "https://www.sparepower.co.za/parts/parts-to-suit-volvo/motor-graders/",
    "https://www.sparepower.co.za/parts/parts-to-suit-volvo/backhoe-tlb/" 
]

def harvest():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    dataset = []
    
    for category_url in SEEDS:
        print(f"🌍 Scraping Category: {category_url}")
        try:
            res = requests.get(category_url, headers=headers)
            soup = BeautifulSoup(res.text, 'html.parser')
            
            # Find products in grid
            # Flatsome theme usually uses .product-small or .type-product
            products = soup.find_all(class_='type-product')
            
            print(f"  Found {len(products)} products in grid.")
            
            # Limit to 10 per category for speed/safety
            for p in products[:10]:
                try:
                    link_tag = p.find('a', class_='woocommerce-LoopProduct-link')
                    if not link_tag:
                         # Try looking for any link inside
                         link_tag = p.find('a')
                    
                    if not link_tag:
                        continue
                        
                    product_url = link_tag['href']
                    title = p.find(class_='name').get_text(strip=True) if p.find(class_='name') else "Unknown"
                    
                    # Visit Product Page
                    print(f"    Processing: {title}...")
                    p_res = requests.get(product_url, headers=headers)
                    p_soup = BeautifulSoup(p_res.text, 'html.parser')
                    
                    # Extract Details
                    # SKU
                    sku = "N/A"
                    sku_tag = p_soup.find(class_='sku')
                    if sku_tag:
                        sku = sku_tag.get_text(strip=True)
                        
                    # Compatibility (Category/Tags)
                    compatibility = []
                    posted_in = p_soup.find(class_='posted_in')
                    if posted_in:
                        compatibility.append(posted_in.get_text(strip=True))
                    tagged_as = p_soup.find(class_='tagged_as')
                    if tagged_as:
                        compatibility.append(tagged_as.get_text(strip=True))
                        
                    # Description (Short)
                    desc = ""
                    short_desc = p_soup.find(class_='product-short-description')
                    if short_desc:
                        desc = short_desc.get_text(strip=True)
                        
                    record = {
                        'name': title,
                        'part_number': sku, # Often the SKU is the Part Number
                        'url': product_url,
                        'compatibility': " | ".join(compatibility),
                        'description': desc,
                        'source': 'SparePower',
                        # Dimensions/Weight are missing on this site mostly, but we grab if possible
                        # (Not adding complex logic for now as confirmed missing)
                    }
                    dataset.append(record)
                    time.sleep(1) # Be polite
                    
                except Exception as e:
                    print(f"    ❌ Error scraping product: {e}")
                    
        except Exception as e:
            print(f"❌ Error scraping category {category_url}: {e}")
            
    print(f"✅ Harvest Complete. Collected {len(dataset)} items.")
    with open('tier2_dataset.json', 'w') as f:
        json.dump(dataset, f, indent=2)

if __name__ == "__main__":
    harvest()
