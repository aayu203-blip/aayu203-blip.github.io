"""
Crawl SRP categories OR search results to discover part numbers
"""

import requests
from bs4 import BeautifulSoup
import time
import re
import os
import argparse

def crawl_url(base_url, name, max_pages=1000, delay=1.0):
    """Crawl a paginated URL and return all part numbers"""
    parts = set()
    page = 1
    consecutive_errors = 0
    
    print(f"Starting crawl for: {name}")
    
    while page <= max_pages:
        # Construct URL based on type
        if '?' in base_url:
            url = f"{base_url}&pg={page}"
        else:
            url = f"{base_url}?pg={page}"
            
        try:
            response = requests.get(url, timeout=15)
            
            # Check for redirect to home or 404
            if response.url == "https://srp.com.tr/" or "OOPS" in response.text:
                print(f"  {name}: Page {page} - Reached end (Redirect/Error)")
                break
                
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all part links
            links = soup.find_all('a', href=re.compile(r'/volvo/\d+'))
            
            if not links:
                print(f"  {name}: No more parts on page {page}")
                break
            
            page_parts = set()
            for link in links:
                match = re.search(r'/volvo/(\d+)', link.get('href'))
                if match:
                    page_parts.add(match.group(1))
            
            parts.update(page_parts)
            print(f"  {name}: Page {page} - Found {len(page_parts)} parts (Total: {len(parts)})")
            
            page += 1
            consecutive_errors = 0
            time.sleep(delay)  # Rate limiting
            
        except Exception as e:
            print(f"  Error on page {page}: {e}")
            consecutive_errors += 1
            if consecutive_errors >= 3:
                print(f"  Stopping {name} due to consecutive errors")
                break
            time.sleep(5)
    
    return parts

def main():
    parser = argparse.ArgumentParser(description='Crawl SRP')
    parser.add_argument('--categories-file', help='File containing category slugs')
    parser.add_argument('--search-query', help='Search query to crawl (e.g. "Volvo")')
    parser.add_argument('--output', default='srp_discovered_all_parts.txt', help='Output file for part numbers')
    parser.add_argument('--delay', type=float, default=0.8, help='Delay between requests')
    parser.add_argument('--max-pages', type=int, default=1000, help='Max pages per crawl')
    
    args = parser.parse_args()
    
    all_parts = set()
    
    # 1. Crawl Search
    if args.search_query:
        search_url = f"https://srp.com.tr/search?keyword={args.search_query}"
        print(f"\nCrawling search: {args.search_query}")
        parts = crawl_url(search_url, f"Search: {args.search_query}", args.max_pages, args.delay)
        all_parts.update(parts)
        
    # 2. Crawl Categories
    if args.categories_file and os.path.exists(args.categories_file):
        with open(args.categories_file, 'r') as f:
            categories = [line.strip() for line in f if line.strip()]
            
        print(f"\nLoaded {len(categories)} categories to crawl.")
        
        for i, category in enumerate(categories, 1):
            print(f"\n[{i}/{len(categories)}] Crawling: {category}")
            url = f"https://srp.com.tr/volvo/category/{category}"
            category_parts = crawl_url(url, category, max_pages=args.max_pages, delay=args.delay)
            all_parts.update(category_parts)
            
            # Intermediate save
            with open(args.output, 'w') as f:
                for part in sorted(all_parts):
                    f.write(f"{part}\n")

    # Final tally
    print("\n" + "="*50)
    print(f"TOTAL UNIQUE PARTS DISCOVERED: {len(all_parts)}")
    print("="*50)
    
    # Save
    with open(args.output, 'w') as f:
        for part in sorted(all_parts):
            f.write(f"{part}\n")
    print(f"Saved to {args.output}")

if __name__ == "__main__":
    main()
