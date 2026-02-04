"""
Extract category slugs from scraped part pages
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import re
import random

def extract_categories(input_file, sample_size=200):
    with open(input_file, 'r') as f:
        parts = json.load(f)
    
    # Take a sample to avoid hitting all pages
    if len(parts) > sample_size:
        parts = random.sample(parts, sample_size)
        
    print(f"Scanning {len(parts)} parts for categories...")
    
    categories = set()
    
    for i, part in enumerate(parts, 1):
        url = part.get('url')
        if not url:
            continue
            
        try:
            print(f"[{i}/{len(parts)}] Checking {url}...")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find category link
            # Selector: a[href*="/category/"]
            links = soup.find_all('a', href=re.compile(r'/category/'))
            
            found = False
            for link in links:
                href = link.get('href')
                if '/volvo/category/' in href:
                    slug = href.split('/')[-1]
                    categories.add(slug)
                    print(f"  ✅ Found category: {slug}")
                    found = True
            
            if not found:
                print("  ❌ No category found")
                
            time.sleep(0.5)
            
        except Exception as e:
            print(f"  Error: {e}")
            
    return categories

def main():
    input_file = 'srp_scraped_data/volvo_complete_inventory.json'
    categories = extract_categories(input_file)
    
    output_file = 'srp_categories.txt'
    with open(output_file, 'w') as f:
        for cat in sorted(categories):
            f.write(f"{cat}\n")
            
    print(f"\nSaved {len(categories)} categories to {output_file}")
    print("="*40)
    for cat in sorted(categories):
        print(cat)

if __name__ == "__main__":
    main()
