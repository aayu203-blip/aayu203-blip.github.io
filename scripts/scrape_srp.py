"""
SRP.com.tr Volvo Parts Scraper

Scrapes Volvo parts data from srp.com.tr using part numbers.
URL Pattern: https://srp.com.tr/volvo/{PART_NUMBER}

Data Extracted:
- Part Name (e.g., "DRIVE GEAR SET")
- Volvo OE Reference (e.g., "11102474")
- SRP Part Number (e.g., "DGS-02474")
- Weight (e.g., "72 KG")
- Compatible Equipment/Models (e.g., "L220F, L250G")
- Category (e.g., "Transmission System")
- Views count

Usage:
    python scripts/scrape_srp.py --part-numbers 11102474 15067533
    python scripts/scrape_srp.py --input-file part_numbers.txt
    python scripts/scrape_srp.py --category electrical-system-and-instrumentation
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import argparse
from typing import Dict, List, Optional
import re

class SRPScraper:
    def __init__(self, delay: float = 1.0):
        self.base_url = "https://srp.com.tr"
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
    
    def scrape_part(self, part_number: str) -> Optional[Dict]:
        """Scrape data for a single part number"""
        url = f"{self.base_url}/volvo/{part_number}"
        
        try:
            response = self.session.get(url, timeout=10)
            
            # Check for 404
            if "OOPS!!! Page Not Found" in response.text:
                print(f"❌ Part {part_number} not found")
                return None
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract data
            data = {
                'part_number': part_number,
                'url': url,
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }
            
            # Part Name (from h1 or title)
            h1 = soup.find('h1')
            if h1:
                # Extract name from title like "DRIVE GEAR SET DGS-02474 - Compatible with..."
                title_text = h1.get_text(strip=True)
                match = re.match(r'(.+?)\s+[A-Z]+-\d+', title_text)
                if match:
                    data['part_name'] = match.group(1).strip()
                else:
                    data['part_name'] = title_text.split('-')[0].strip()
            
            # Find all text content
            page_text = soup.get_text()
            
            # Volvo OE Reference
            oe_match = re.search(r'Volvo OE Reference[:\s]+(\d+)', page_text)
            if oe_match:
                data['volvo_oe_reference'] = oe_match.group(1)
            
            # SRP Part Number
            srp_match = re.search(r'Part Number[:\s]+([A-Z]+-\d+)', page_text)
            if srp_match:
                data['srp_part_number'] = srp_match.group(1)
            
            # Weight
            weight_match = re.search(r'Weight[:\s]+([\d.]+\s*KG)', page_text, re.IGNORECASE)
            if weight_match:
                data['weight'] = weight_match.group(1)
            
            # Compatible Equipment
            suitable_match = re.search(r'Suitable for[:\s]+(.+?)(?:\n|$)', page_text)
            if suitable_match:
                data['suitable_for'] = suitable_match.group(1).strip()
            
            # Extract model numbers (e.g., L220F, L250G)
            models = re.findall(r'[A-Z]\d{3,4}[A-Z]?', page_text)
            if models:
                data['compatible_models'] = list(set(models))
            
            # Views count
            views_match = re.search(r'(\d+)\s*views?', page_text, re.IGNORECASE)
            if views_match:
                data['views'] = int(views_match.group(1))
            
            print(f"✅ Scraped: {part_number} - {data.get('part_name', 'Unknown')}")
            return data
            
        except requests.RequestException as e:
            print(f"❌ Error scraping {part_number}: {e}")
            return None
        except Exception as e:
            print(f"❌ Parse error for {part_number}: {e}")
            return None
    
    def scrape_category(self, category: str, max_pages: int = 10) -> List[str]:
        """Scrape part numbers from a category page"""
        part_numbers = []
        
        for page in range(1, max_pages + 1):
            url = f"{self.base_url}/volvo/category/{category}?pg={page}"
            
            try:
                response = self.session.get(url, timeout=10)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find all part links (pattern: /volvo/PARTNUMBER)
                links = soup.find_all('a', href=re.compile(r'/volvo/\d+'))
                
                if not links:
                    print(f"No more parts found on page {page}")
                    break
                
                for link in links:
                    href = link.get('href')
                    match = re.search(r'/volvo/(\d+)', href)
                    if match:
                        part_numbers.append(match.group(1))
                
                print(f"Found {len(links)} parts on page {page}")
                time.sleep(self.delay)
                
            except Exception as e:
                print(f"Error scraping category page {page}: {e}")
                break
        
        return list(set(part_numbers))  # Remove duplicates
    
    def scrape_multiple(self, part_numbers: List[str], output_file: str = None) -> List[Dict]:
        """Scrape multiple part numbers"""
        results = []
        
        for i, part_number in enumerate(part_numbers, 1):
            print(f"\n[{i}/{len(part_numbers)}] Scraping {part_number}...")
            
            data = self.scrape_part(part_number)
            if data:
                results.append(data)
            
            # Rate limiting
            if i < len(part_numbers):
                time.sleep(self.delay)
        
        # Save results
        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
            print(f"\n✅ Saved {len(results)} parts to {output_file}")
        
        return results


def main():
    parser = argparse.ArgumentParser(description='Scrape Volvo parts from srp.com.tr')
    parser.add_argument('--part-numbers', nargs='+', help='List of part numbers to scrape')
    parser.add_argument('--input-file', help='File containing part numbers (one per line)')
    parser.add_argument('--category', help='Category slug to scrape (e.g., electrical-system-and-instrumentation)')
    parser.add_argument('--max-pages', type=int, default=10, help='Max category pages to scrape')
    parser.add_argument('--output', default='srp_parts.json', help='Output JSON file')
    parser.add_argument('--delay', type=float, default=1.0, help='Delay between requests (seconds)')
    
    args = parser.parse_args()
    
    scraper = SRPScraper(delay=args.delay)
    
    # Collect part numbers
    part_numbers = []
    
    if args.part_numbers:
        part_numbers.extend(args.part_numbers)
    
    if args.input_file:
        with open(args.input_file, 'r') as f:
            part_numbers.extend([line.strip() for line in f if line.strip()])
    
    if args.category:
        print(f"Discovering parts from category: {args.category}")
        category_parts = scraper.scrape_category(args.category, max_pages=args.max_pages)
        part_numbers.extend(category_parts)
        print(f"Found {len(category_parts)} parts in category")
    
    if not part_numbers:
        print("No part numbers provided. Use --part-numbers, --input-file, or --category")
        return
    
    # Remove duplicates
    part_numbers = list(set(part_numbers))
    print(f"\nTotal parts to scrape: {len(part_numbers)}")
    
    # Scrape
    results = scraper.scrape_multiple(part_numbers, output_file=args.output)
    
    # Summary
    print(f"\n{'='*50}")
    print(f"Scraping Complete!")
    print(f"Total scraped: {len(results)}/{len(part_numbers)}")
    print(f"Success rate: {len(results)/len(part_numbers)*100:.1f}%")
    print(f"Output: {args.output}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
