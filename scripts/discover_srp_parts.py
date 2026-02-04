"""
SRP Part Discovery Strategy
Discovers ALL Volvo parts on srp.com.tr beyond our existing inventory

Strategies:
1. Sitemap XML parsing
2. Sequential number testing
3. Search result pagination
4. Related parts crawling
"""

import requests
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET
import json
import time
import re
from typing import Set, List

class SRPDiscovery:
    def __init__(self):
        self.base_url = "https://srp.com.tr"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.discovered_parts = set()
    
    def strategy_1_sitemap(self) -> Set[str]:
        """Parse sitemap.xml for all Volvo part URLs"""
        print("Strategy 1: Parsing sitemap.xml...")
        
        try:
            # Try sitemap.xml
            response = self.session.get(f"{self.base_url}/sitemap.xml", timeout=10)
            
            # Parse XML
            root = ET.fromstring(response.content)
            
            # Extract all Volvo part URLs
            parts = set()
            for url in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
                url_text = url.text
                if '/volvo/' in url_text and url_text.count('/') == 4:
                    # Extract part number from URL
                    match = re.search(r'/volvo/(\d+)', url_text)
                    if match:
                        parts.add(match.group(1))
            
            print(f"✅ Found {len(parts)} parts in sitemap")
            return parts
            
        except Exception as e:
            print(f"❌ Sitemap parsing failed: {e}")
            return set()
    
    def strategy_2_sequential_testing(self, ranges: List[tuple]) -> Set[str]:
        """Test sequential part numbers in common ranges"""
        print("\nStrategy 2: Sequential number testing...")
        
        parts = set()
        
        for start, end in ranges:
            print(f"Testing range {start}-{end}...")
            
            for num in range(start, end + 1):
                part_num = str(num)
                url = f"{self.base_url}/volvo/{part_num}"
                
                try:
                    response = self.session.get(url, timeout=5)
                    
                    if "OOPS!!! Page Not Found" not in response.text:
                        parts.add(part_num)
                        print(f"  ✅ Found: {part_num}")
                    
                    time.sleep(0.3)  # Rate limiting
                    
                except Exception as e:
                    continue
            
            print(f"  Range complete: {len(parts)} parts found")
        
        print(f"✅ Sequential testing found {len(parts)} parts")
        return parts
    
    def strategy_3_search_pagination(self, query: str = "") -> Set[str]:
        """Paginate through search results"""
        print(f"\nStrategy 3: Search pagination (query: '{query}')...")
        
        parts = set()
        page = 1
        
        while page <= 100:  # Max 100 pages
            try:
                url = f"{self.base_url}/search/?q={query}&page={page}"
                response = self.session.get(url, timeout=10)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find all Volvo part links
                links = soup.find_all('a', href=re.compile(r'/volvo/\d+'))
                
                if not links:
                    break
                
                for link in links:
                    match = re.search(r'/volvo/(\d+)', link.get('href'))
                    if match:
                        parts.add(match.group(1))
                
                print(f"  Page {page}: {len(links)} parts")
                page += 1
                time.sleep(0.5)
                
            except Exception as e:
                print(f"  Error on page {page}: {e}")
                break
        
        print(f"✅ Search found {len(parts)} parts")
        return parts
    
    def strategy_4_related_parts_crawl(self, seed_parts: List[str], max_depth: int = 3) -> Set[str]:
        """Crawl related parts from seed parts"""
        print(f"\nStrategy 4: Related parts crawling (depth: {max_depth})...")
        
        discovered = set(seed_parts)
        to_crawl = list(seed_parts)
        depth = 0
        
        while to_crawl and depth < max_depth:
            current_batch = to_crawl[:50]  # Process 50 at a time
            to_crawl = to_crawl[50:]
            
            print(f"  Depth {depth + 1}: Crawling {len(current_batch)} parts...")
            
            for part_num in current_batch:
                try:
                    url = f"{self.base_url}/volvo/{part_num}"
                    response = self.session.get(url, timeout=10)
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Find related part links
                    related_links = soup.find_all('a', href=re.compile(r'/volvo/\d+'))
                    
                    for link in related_links:
                        match = re.search(r'/volvo/(\d+)', link.get('href'))
                        if match:
                            new_part = match.group(1)
                            if new_part not in discovered:
                                discovered.add(new_part)
                                to_crawl.append(new_part)
                    
                    time.sleep(0.5)
                    
                except Exception as e:
                    continue
            
            depth += 1
            print(f"  Depth {depth} complete: {len(discovered)} total parts")
        
        print(f"✅ Crawling found {len(discovered)} parts")
        return discovered
    
    def strategy_5_brand_page_scrape(self) -> Set[str]:
        """Scrape all parts from /volvo/ brand page"""
        print("\nStrategy 5: Brand page scraping...")
        
        parts = set()
        
        try:
            url = f"{self.base_url}/volvo/"
            response = self.session.get(url, timeout=10)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all part links
            links = soup.find_all('a', href=re.compile(r'/volvo/\d+'))
            
            for link in links:
                match = re.search(r'/volvo/(\d+)', link.get('href'))
                if match:
                    parts.add(match.group(1))
            
            print(f"✅ Brand page found {len(parts)} parts")
            return parts
            
        except Exception as e:
            print(f"❌ Brand page scraping failed: {e}")
            return set()
    
    def discover_all(self, existing_parts: List[str] = None) -> Set[str]:
        """Run all discovery strategies"""
        print("="*60)
        print("SRP PART DISCOVERY - ALL STRATEGIES")
        print("="*60)
        
        all_parts = set()
        
        # Strategy 1: Sitemap
        sitemap_parts = self.strategy_1_sitemap()
        all_parts.update(sitemap_parts)
        
        # Strategy 2: Sequential testing (common ranges)
        # Based on observed part numbers: 1000000-2000000, 10000000-25000000, 80000000-90000000
        sequential_parts = self.strategy_2_sequential_testing([
            (1000000, 1010000),    # Test 10k numbers
            (20000000, 20010000),  # Test 10k numbers
            (84000000, 84010000),  # Test 10k numbers
        ])
        all_parts.update(sequential_parts)
        
        # Strategy 3: Search pagination
        search_parts = self.strategy_3_search_pagination("")
        all_parts.update(search_parts)
        
        # Strategy 4: Related parts crawl (if we have existing parts)
        if existing_parts:
            seed = existing_parts[:100]  # Use first 100 as seeds
            crawl_parts = self.strategy_4_related_parts_crawl(seed, max_depth=2)
            all_parts.update(crawl_parts)
        
        # Strategy 5: Brand page
        brand_parts = self.strategy_5_brand_page_scrape()
        all_parts.update(brand_parts)
        
        print("\n" + "="*60)
        print(f"TOTAL UNIQUE PARTS DISCOVERED: {len(all_parts)}")
        print("="*60)
        
        return all_parts
    
    def save_discovered_parts(self, parts: Set[str], filename: str):
        """Save discovered part numbers to file"""
        parts_list = sorted(list(parts))
        
        with open(filename, 'w') as f:
            for part in parts_list:
                f.write(f"{part}\n")
        
        print(f"\n✅ Saved {len(parts_list)} part numbers to {filename}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Discover all Volvo parts on SRP')
    parser.add_argument('--existing-parts', help='File with existing part numbers')
    parser.add_argument('--output', default='srp_discovered_parts.txt', help='Output file')
    parser.add_argument('--strategy', choices=['sitemap', 'sequential', 'search', 'crawl', 'brand', 'all'], 
                       default='all', help='Discovery strategy to use')
    
    args = parser.parse_args()
    
    discovery = SRPDiscovery()
    
    # Load existing parts if provided
    existing_parts = []
    if args.existing_parts:
        with open(args.existing_parts, 'r') as f:
            existing_parts = [line.strip() for line in f if line.strip()]
    
    # Run selected strategy
    if args.strategy == 'all':
        discovered = discovery.discover_all(existing_parts)
    elif args.strategy == 'sitemap':
        discovered = discovery.strategy_1_sitemap()
    elif args.strategy == 'sequential':
        discovered = discovery.strategy_2_sequential_testing([
            (1000000, 1100000),
            (20000000, 21000000),
            (84000000, 85000000),
        ])
    elif args.strategy == 'search':
        discovered = discovery.strategy_3_search_pagination("")
    elif args.strategy == 'crawl':
        discovered = discovery.strategy_4_related_parts_crawl(existing_parts[:100], max_depth=3)
    elif args.strategy == 'brand':
        discovered = discovery.strategy_5_brand_page_scrape()
    
    # Save results
    discovery.save_discovered_parts(discovered, args.output)
    
    # Show stats
    if existing_parts:
        new_parts = discovered - set(existing_parts)
        print(f"\nNew parts found: {len(new_parts)}")
        print(f"Already in inventory: {len(discovered & set(existing_parts))}")


if __name__ == "__main__":
    main()
