import requests
from bs4 import BeautifulSoup

def discover_brands():
    url = "https://www.sparepower.co.za/parts/"
    print(f"🗺️  Discovering brands at: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Look for links containing 'suits' or 'parts-to-suit' or just under the parts path
        links = soup.find_all('a', href=True)
        
        found_brands = []
        for l in links:
            href = l['href']
            text = l.text.strip()
            if '/parts/' in href and len(href) > 8: # Filter out just /parts/
                print(f"  Found: {text} -> {href}")
                found_brands.append(href)
                
    except Exception as e:
        print(f"Discovery Failed: {e}")

if __name__ == "__main__":
    discover_brands()
