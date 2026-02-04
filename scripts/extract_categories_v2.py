"""
Extract categories from part pages using robust parsing
"""

import requests
from bs4 import BeautifulSoup
import re
import time

def extract_category(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Referer': 'https://srp.com.tr/volvo'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for category link
        # 1. Direct href search
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/category/' in href:
                slug = href.split('/')[-1]
                print(f"  Found category slug: {slug} (from {url})")
                return slug
                
        # 2. Text search
        # Sometimes it's text "Category: Electrical System"
        
    except Exception as e:
        print(f"  Error {url}: {e}")
        
    return None

def main():
    # Load links from dump
    with open('srp_all_links_dump.txt', 'r') as f:
        links = [line.strip() for line in f if '/volvo/' in line and '/category/' not in line]
        
    print(f"Scanning {len(links)} parts for categories...")
    
    categories = set()
    for link in links:
        if not link.startswith('http'):
            # Fix relative links if any
            continue
            
        slug = extract_category(link)
        if slug:
            categories.add(slug)
        time.sleep(0.5)
        
    print("\n" + "="*40)
    print(f"Found {len(categories)} categories")
    print("="*40)
    for cat in sorted(categories):
        print(cat)
        
    # Append to srp_categories.txt
    if categories:
        current = set()
        try:
            with open('srp_categories.txt', 'r') as f:
                current = set(line.strip() for line in f if line.strip())
        except:
            pass
            
        current.update(categories)
        
        with open('srp_categories.txt', 'w') as f:
            for cat in sorted(current):
                f.write(f"{cat}\n")
        print("Updated srp_categories.txt")

if __name__ == "__main__":
    main()
