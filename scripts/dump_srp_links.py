"""
Dump all links from SRP Sitemap to find categories
"""

import requests
from bs4 import BeautifulSoup

def dump_links():
    url = "https://srp.com.tr/sitemap"
    print(f"Fetching {url}...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Referer': 'https://srp.com.tr/'
    }
    
    response = requests.get(url, headers=headers, timeout=15)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    links = []
    for a in soup.find_all('a', href=True):
        links.append(a['href'])
        
    # Also check the BRAND page
    url_brand = "https://srp.com.tr/volvo"
    print(f"Fetching {url_brand}...")
    response_brand = requests.get(url_brand, headers=headers, timeout=15)
    soup_brand = BeautifulSoup(response_brand.text, 'html.parser')
    
    for a in soup_brand.find_all('a', href=True):
        links.append(a['href'])

    # Save to file
    with open('srp_all_links_dump.txt', 'w') as f:
        for link in sorted(set(links)):
            f.write(f"{link}\n")
            
    print(f"Dumped {len(set(links))} unique links to srp_all_links_dump.txt")

if __name__ == "__main__":
    dump_links()
