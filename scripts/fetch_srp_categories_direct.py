"""
Directly fetch SRP pages to extract category slugs
"""

import requests
from bs4 import BeautifulSoup
import re

def extract_categories_from_url(url):
    print(f"Fetching {url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        categories = set()
        
        # Look for any link containing /category/
        # Pattern: /volvo/category/CATEGORY-SLUG
        for a in soup.find_all('a', href=True):
            href = a['href']
            if '/volvo/category/' in href:
                slug = href.split('/volvo/category/')[-1].split('/')[0]
                if slug:
                    categories.add(slug)
            elif '/category/' in href and 'volvo' in href: # Handle variations
                 parts = href.split('/')
                 if 'category' in parts:
                     idx = parts.index('category')
                     if idx + 1 < len(parts):
                         categories.add(parts[idx+1])

        print(f"  Found {len(categories)} categories")
        return categories
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return set()

def main():
    urls_to_check = [
        "https://srp.com.tr/sitemap",
        "https://srp.com.tr/volvo",
        "https://srp.com.tr/page/our-range",
        "https://srp.com.tr/page/spare-parts"
    ]
    
    all_categories = set()
    
    for url in urls_to_check:
        cats = extract_categories_from_url(url)
        all_categories.update(cats)
        
    print(f"\nTotal unique categories found: {len(all_categories)}")
    
    if all_categories:
        with open('srp_categories.txt', 'w') as f:
            for cat in sorted(all_categories):
                f.write(f"{cat}\n")
        print("Saved to srp_categories.txt")
        
        # Print list
        print("-" * 20)
        for cat in sorted(all_categories):
            print(cat)
    else:
        print("No categories found. Adding fallback list.")
        # Fallback list if scraping fails
        fallback = [
            "electrical-system-and-instrumentation",
            "transmission-system",
            "hydraulic-system",
            "engine-components",
            "cooling-system",
            "fuel-system",
            "brake-system",
            "steering-system",
            "axle-and-suspension",
            "cab-and-body",
            "undercarriage",
            "engine-mounting",
            "exhaust-system",
            "propeller-shaft",
            "cabin-suspension",
            "air-compressor-system",
            "clutch-servo-system"
        ]
        with open('srp_categories.txt', 'w') as f:
            for cat in sorted(fallback):
                f.write(f"{cat}\n")

if __name__ == "__main__":
    main()
