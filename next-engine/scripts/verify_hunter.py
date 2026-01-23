import requests
from bs4 import BeautifulSoup

def verify_hunter():
    # Target: Volvo Category
    url = "https://www.sparepower.co.za/parts/parts-to-suit-volvo/"
    print(f"🕵️ Hunter requesting: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {res.status_code}")
        
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            title = soup.title.string.strip() if soup.title else "No Title"
            print(f"Page Title: {title}")
            
            # Try to find products
            # Inspecting broadly for links that might look like products
            links = soup.find_all('a')
            product_links = [l for l in links if '/parts/' in l.get('href', '')]
            print(f"Found {len(links)} total links.")
            print(f"Found {len(product_links)} links containing '/parts/' (Potential Products).")
            
            if product_links:
                print("Sample Product Link:", product_links[0].get('href'))
                
    except Exception as e:
        print(f"Hunter Failed: {e}")

if __name__ == "__main__":
    verify_hunter()
