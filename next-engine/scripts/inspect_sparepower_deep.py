import requests
from bs4 import BeautifulSoup

def inspect_deep():
    # A page we know has products (Tier 2)
    url = "https://www.sparepower.co.za/parts/drifter-parts/to-suit-1132/"
    print(f"🕵️ Deep Inspecting: {url}")
    
    try:
        res = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=15)
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Find product items
        # Based on previous generic scraping, let's look for standard structures
        # We'll print text of links and headers
        
        # Look for typical product containers
        products = soup.find_all(class_='product') # Generic guess
        if not products:
             products = soup.find_all(class_='item')
        if not products:
             # Just look at all links in the main content area
             main = soup.find('main') or soup.find('body')
             links = main.find_all('a')
             products = links # Fallback
             
        print(f"Found {len(products)} potential product elements.")
        
        for i, p in enumerate(products[:10]):
            text = p.get_text(strip=True)
            href = p.get('href') if p.name == 'a' else p.find('a')['href'] if p.find('a') else 'No Link'
            print(f"  [{i}] Text: {text[:100]}... | Link: {href}")
            
    except Exception as e:
        print(f"Deep Check Failed: {e}")

if __name__ == "__main__":
    inspect_deep()
