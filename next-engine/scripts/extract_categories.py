import requests
from bs4 import BeautifulSoup
import json

def extract_categories():
    url = "https://www.sparepower.co.za/parts/"
    print(f"🌍 Fetching Categories from: {url}")
    
    headers = {'User-Agent': 'Mozilla/5.0'}
    res = requests.get(url, headers=headers)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    categories = []
    # Inspecting structure based on common Woo/Flatsome themes
    # Usually .product-category a
    
    # Try finding grid items
    rows = soup.find_all(class_='product-category')
    
    if not rows:
        # Fallback: look for any link in the shop-container
        print("⚠️ No .product-category class found. Dumping all links in main...")
        main = soup.find('main')
        if main:
            links = main.find_all('a')
            for l in links:
                href = l.get('href')
                if href and '/category/' in href:
                    name = l.get_text(strip=True)
                    if name:
                        categories.append({'name': name, 'url': href})
    else:
        for row in rows:
            a = row.find('a')
            if a:
                categories.append({
                    'name': row.find(class_='header-title-text').get_text(strip=True) if row.find(class_='header-title-text') else "Unknown",
                    'url': a['href']
                })

    # Deduplicate
    seen = set()
    unique_cats = []
    for c in categories:
        if c['url'] not in seen:
            seen.add(c['url'])
            unique_cats.append(c)
            
    print(f"✅ Found {len(unique_cats)} categories.")
    print(json.dumps(unique_cats, indent=2))
    
    with open('sparepower_categories.json', 'w') as f:
        json.dump(unique_cats, f, indent=2)

if __name__ == "__main__":
    extract_categories()
