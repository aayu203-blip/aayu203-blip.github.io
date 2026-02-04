"""
Strictly verify if brand page pagination returns different parts
"""

import requests
from bs4 import BeautifulSoup

def get_parts(page):
    url = f"https://srp.com.tr/volvo?pg={page}"
    print(f"Fetching page {page}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
    }
    response = requests.get(url, headers=headers, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
    parts = set()
    for a in soup.find_all('a', href=True):
        if '/volvo/' in a['href'] and a['href'].count('/') == 4:
            parts.add(a['href'])
    return parts

def main():
    p1 = get_parts(1)
    p2 = get_parts(2)
    
    print(f"\nPage 1 count: {len(p1)}")
    print(f"Page 2 count: {len(p2)}")
    
    intersection = p1.intersection(p2)
    print(f"Overlap: {len(intersection)}")
    
    if len(intersection) == len(p1) and len(p1) > 0:
        print("❌ PAGINATION FAILED: Content is identical.")
    elif len(intersection) == 0:
        print("✅ PAGINATION WORKING: Content is completely different.")
    else:
        print(f"⚠️ PAGINATION PARTIAL: {len(intersection)} duplicates.")

if __name__ == "__main__":
    main()
