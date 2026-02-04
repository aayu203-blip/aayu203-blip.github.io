"""
Test if the brand page supports pagination
"""

import requests
from bs4 import BeautifulSoup

def test_pagination():
    base = "https://srp.com.tr/volvo"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    }
    
    for i in range(1, 4):
        url = f"{base}?pg={i}"
        print(f"Testing {url}...")
        try:
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find parts
            parts = set()
            for a in soup.find_all('a', href=True):
                if '/volvo/' in a['href'] and a['href'].count('/') == 4: # /volvo/123456
                     parts.add(a['href'])
            
            print(f"  Page {i}: Found {len(parts)} parts")
            if parts:
                print(f"  Sample: {list(parts)[0]}")
                
        except Exception as e:
            print(f"  Error: {e}")

if __name__ == "__main__":
    test_pagination()
