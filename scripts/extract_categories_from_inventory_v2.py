"""
Extract categories from EXISTING INVENTORY by forcing SRP URL construction
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import json
import random

def extract_category(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Referer': 'https://srp.com.tr/volvo',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        # Check for soft 404
        if "OOPS" in response.text or response.status_code == 404:
            return None
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for category link
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/volvo/category/' in href:
                slug = href.split('/volvo/category/')[-1]
                return slug
            elif '/category/' in href and 'volvo' in href:
                 parts = href.split('/')
                 if 'category' in parts:
                     idx = parts.index('category')
                     if idx + 1 < len(parts):
                         return parts[idx+1]
        
        # Fallback: Look for text "Category:"
        # Example: <div class="...">Category: <a href="...">Electrical System</a></div>
        
    except Exception as e:
        print(f"  Error {url}: {e}")
        
    return None

def main():
    input_file = 'god-mode/data/parts-database.json'
    
    with open(input_file, 'r') as f:
        data = json.load(f)
        
    # Filter for Volvo parts
    volvo_parts = [p for p in data if p.get('brand') == 'Volvo']
    
    # Shuffle and take a larger sample
    print(f"Loaded {len(volvo_parts)} Volvo parts. Sampling 200...")
    sample = random.sample(volvo_parts, min(200, len(volvo_parts)))
    
    categories = set()
    found_count = 0
    
    print(f"Scanning...")
    
    valid_parts_count = 0
    
    for i, part in enumerate(sample, 1):
        # FORCE SRP URL construction
        pn = str(part.get('part_number', '')).strip()
        if not pn:
            continue
            
        url = f"https://srp.com.tr/volvo/{pn}"
                
        slug = extract_category(url)
        if slug:
            categories.add(slug)
            found_count += 1
            valid_parts_count += 1
            print(f"[{i}/{len(sample)}] ✅ {pn}: {slug}")
        else:
            # Maybe the part doesn't exist on SRP (it might be from another supplier)
            # print(f"[{i}/{len(sample)}] ❌ {pn}: No category/Not found")
            pass
            
        time.sleep(0.5)
        
    print("\n" + "="*40)
    print(f"Found {len(categories)} unique categories from {valid_parts_count} valid parts")
    print("="*40)
    
    for cat in sorted(categories):
        print(cat)
        
    # Save
    if categories:
        with open('srp_categories.txt', 'w') as f:
            for cat in sorted(categories):
                f.write(f"{cat}\n")
        print("Updated srp_categories.txt")

if __name__ == "__main__":
    main()
