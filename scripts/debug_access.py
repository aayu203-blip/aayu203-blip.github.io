"""
Debug access to SRP to find working URLs and headers
"""

import requests
from bs4 import BeautifulSoup

def test_url(name, url):
    print(f"Testing {name}: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://srp.com.tr/',
        'Connection': 'keep-alive'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"  Status: {response.status_code}")
        print(f"  Length: {len(response.text)}")
        
        if "OOPS" in response.text:
            print("  ⚠️ Soft 404 (OOPS page)")
            return False
            
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a')
        print(f"  Links found: {len(links)}")
        
        # Check for specific elements
        parts = soup.find_all('a', href=lambda x: x and '/volvo/' in x)
        print(f"  Volvo part links: {len(parts)}")
        
        return len(parts) > 0
        
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    tests = [
        ("Home", "https://srp.com.tr/"),
        ("Brand Page", "https://srp.com.tr/volvo"),
        ("Category: Electrical", "https://srp.com.tr/volvo/category/electrical-system-and-instrumentation"),
        ("Category: Engine", "https://srp.com.tr/volvo/category/engine"),
        ("Category: Engine Components", "https://srp.com.tr/volvo/category/engine-components"),
        ("Search: Volvo", "https://srp.com.tr/search?keyword=Volvo"),
        ("Search: Empty", "https://srp.com.tr/search?keyword="),
        ("Product: Known", "https://srp.com.tr/volvo/15067533"),
        ("Sitemap", "https://srp.com.tr/sitemap"),
    ]
    
    for name, url in tests:
        test_url(name, url)
        print("-" * 30)

if __name__ == "__main__":
    main()
