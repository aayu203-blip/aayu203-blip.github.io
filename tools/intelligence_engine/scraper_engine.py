"""
Commercial Intelligence Engine v1.0
Domain: Underground Rock Drifters (Sandvik, Epiroc)

Module 1: Web Scraper (Playwright + BeautifulSoup) for dynamic supplier websites.
Module 2: PDF Extraction Tool (PyPDF2/pdfplumber + Regex) for OEM Service Manuals.
"""

import os
import re
import csv
import json
import time
import random
from bs4 import BeautifulSoup

# Try importing Playwright, fallback if not installed yet
try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    print("Warning: Playwright not installed. Module 1 requires 'pip install playwright' and 'playwright install'")

# Try importing pdfplumber, fallback if not installed yet
try:
    import pdfplumber
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    print("Warning: pdfplumber not installed. Module 2 requires 'pip install pdfplumber'")

# ==========================================
# MODULE 1: The Web Scraper (Competitor Sites)
# ==========================================

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/119.0"
]

def scrape_competitor_site(target_url: str):
    """
    Scrapes a dynamic competitor or supplier site using Playwright and BS4.
    Targets: Part Name, OEM Part Number, Price, and Stock Status.
    """
    if not PLAYWRIGHT_AVAILABLE:
        print("Playwright unavailable. Skipping web scrape.")
        return []

    print(f"[{time.strftime('%H:%M:%S')}] Initializing Web Scraper for: {target_url}")
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()

        try:
            # Go to target, wait for network idle to ensure JS data loads
            page.goto(target_url, wait_until="networkidle", timeout=60000)
            
            # Anti-Bot delay: Random sleep between 2 and 5 seconds
            time.sleep(random.uniform(2.0, 5.0))
            
            # Extract raw DOM HTML
            html = page.content()
            soup = BeautifulSoup(html, 'html.parser')

            # Targeting mock DOM structures for generic ecommerce grids
            products = soup.find_all('div', class_=re.compile(r'product-card|item-container|grid-item', re.I))
            
            for prod in products:
                # 1. Part Name
                name_elem = prod.find(['h2', 'h3', 'a'], class_=re.compile(r'title|name', re.I))
                part_name = name_elem.text.strip() if name_elem else "Unknown Part"

                # 2. OEM Part Number
                sku_elem = prod.find('span', class_=re.compile(r'sku|part-number|oem', re.I))
                oem_number = sku_elem.text.strip() if sku_elem else "N/A"

                # 3. Price
                price_elem = prod.find('span', class_=re.compile(r'price|amount', re.I))
                price_str = price_elem.text.strip() if price_elem else "0.00"
                clean_price = re.sub(r'[^\d.]', '', price_str)
                price = float(clean_price) if clean_price else 0.0

                # 4. Stock Status
                stock_elem = prod.find(class_=re.compile(r'stock|availability', re.I))
                stock_status = stock_elem.text.strip() if stock_elem else "In Stock"

                results.append({
                    "name": part_name,
                    "oem_reference_number": oem_number,
                    "competitor_price": price,
                    "stock_status": stock_status,
                    "source": "Web Scraper"
                })
                
            print(f"Scraped {len(results)} parts from {target_url}")

        except Exception as e:
            print(f"Error scraping {target_url}: {e}")
        finally:
            browser.close()

    return results


# ==========================================
# MODULE 2: The PDF Extraction Tool
# ==========================================

# Regex for Epiroc (e.g. "3115 9170 91" or "3115-9170-91")
REGEX_EPIROC = r'\b(31\d{2}[\s\-]?\d{4}[\s\-]?\d{2})\b'
# Regex for Sandvik (e.g. "BG0055412" or "1549651")
REGEX_SANDVIK = r'\b([A-Z]{2}\d{7}|\d{7})\b'

def extract_manual_data(pdf_directory: str):
    """
    Scans a directory of OEM PDF Manuals and extracts part numbers and descriptions.
    """
    if not PDF_AVAILABLE:
        print("pdfplumber unavailable. Skipping PDF extraction.")
        return []

    print(f"[{time.strftime('%H:%M:%S')}] Initializing PDF Extractor in: {pdf_directory}")
    results = []

    if not os.path.exists(pdf_directory):
        print(f"Directory {pdf_directory} does not exist. Please create it and drop PDFs inside.")
        return results

    pdf_files = [f for f in os.listdir(pdf_directory) if f.lower().endswith('.pdf')]
    
    for pdf_file in pdf_files:
        filepath = os.path.join(pdf_directory, pdf_file)
        print(f"Scanning manual: {pdf_file}...")
        
        try:
            with pdfplumber.open(filepath) as pdf:
                for page_num, page in enumerate(pdf.pages):
                    text = page.extract_text()
                    if not text: continue
                    
                    lines = text.split('\n')
                    for line in lines:
                        # Find Epiroc or Sandvik logic signatures
                        epiroc_match = re.search(REGEX_EPIROC, line)
                        sandvik_match = re.search(REGEX_SANDVIK, line)
                        
                        oem_number = None
                        if epiroc_match:
                            oem_number = epiroc_match.group(1).replace(' ', '').replace('-', '')
                        elif sandvik_match:
                            oem_number = sandvik_match.group(1)
                            
                        if oem_number:
                            # Isolate description from number
                            match_str = epiroc_match.group(0) if epiroc_match else sandvik_match.group(0)
                            description = line.replace(match_str, '').strip()
                            description = re.sub(r'^[\W_]+|[\W_]+$', '', description) # Trim trailing punctuation
                            
                            results.append({
                                "name": description if len(description) > 3 else "Unknown Description",
                                "oem_reference_number": oem_number,
                                "estimated_oem_price": 0.0,
                                "source_manual": pdf_file,
                                "page_found": page_num + 1
                            })
                            
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")
            
    print(f"Extracted {len(results)} OEM parts from PDFs.")
    return results

# ==========================================
# MODULE 3: Exporter Pipeline
# ==========================================

def export_to_csv(data: list, filename: str):
    if not data:
        return
    
    headers = list(data[0].keys())
    
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        writer.writerows(data)
    print(f"✅ Master Export complete: Saved to {filename}")

if __name__ == "__main__":
    print("🚀 Starting PTC Commercial Intelligence Engine")
    master_data = []
    
    # 1. Fire Web Scraper (Mock Target)
    web_data = scrape_competitor_site("https://example-heavy-parts-supplier.com/drifters")
    master_data.extend(web_data)
    
    # 2. Fire PDF Extractor
    pdf_dir = "./oem_manuals"
    if not os.path.exists(pdf_dir):
        os.makedirs(pdf_dir)
        print(f"Created config directory '{pdf_dir}/'. Drop your Sandvik/Epiroc PDF manuals there.")
        
    pdf_data = extract_manual_data(pdf_dir)
    master_data.extend(pdf_data)
    
    # 3. Export to CSV for Bulk DB Import
    if master_data:
        export_to_csv(master_data, "intelligence_export.csv")
    else:
        print("Extraction pipeline completed with 0 results. Check inputs.")
