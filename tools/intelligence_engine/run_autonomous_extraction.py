import os
import re
import csv
import time
import random
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright
import pdfplumber

# Configuration
PDF_DIR = "oem_manuals"
OUTPUT_CSV = "master_autonomous_export.csv"
SOURCES_FILE = "target_sources.txt"

# Regex Patterns
REGEX_EPIROC = r'\b(31\d{2}[\s\-]?\d{4}[\s\-]?\d{2})\b'
REGEX_SANDVIK = r'\b([A-Z]{2}\d{7}|\d{7})\b'
REGEX_MODELS = r'\b(COP[\s\-]?\d{4}[A-Z]*|HL[\s\-]?\d{4}[A-Z]*|DX\d{3})\b'

def load_sources():
    if not os.path.exists(SOURCES_FILE):
        return ["https://www.epiroc.com/en-us/parts-and-services/rock-drilling-tools"]
    with open(SOURCES_FILE, 'r') as f:
        return [line.strip() for line in f if line.strip() and not line.startswith('#')]

def generate_intelligent_queries(csv_path):
    """V7: Analyze current CSV and generate new search queries for Bing."""
    queries = ["Sandvik HLX5 spare parts pdf", "Epiroc COP manual pdf"] # Defaults
    if not os.path.exists(csv_path): return queries
    
    try:
        with open(csv_path, 'r') as f:
            reader = csv.DictReader(f)
            data = list(reader)
            if len(data) > 0:
                # Find most common prefixes or names
                names = [row['name'].split()[0] for row in data if row['name']]
                if names:
                    most_common = max(set(names), key=names.count)
                    queries.append(f"{most_common} rock drill parts manual filetype:pdf")
    except: pass
    return list(set(queries))

def search_discovery_v7(context, queries, downloaded_files):
    """V7: Advanced Search discovery via Bing."""
    for q in queries[:2]:
        print(f"\n🌍 Autonomous Web Research: Querying '{q}'")
        page = context.new_page()
        try:
            page.goto(f"https://www.bing.com/search?q={q.replace(' ', '+')}", timeout=15000)
            time.sleep(3)
            # Find PDF links
            pdfs = page.query_selector_all('a[href$=".pdf"]')
            for a in pdfs[:3]:
                url = a.get_attribute('href')
                if url: process_pdf_link(page, url, downloaded_files)
        except: pass
        finally: page.close()

def direct_scan_v7(context, targets, downloaded_files):
    for url in targets:
        print(f"\n🕵️ Scanning Surface: '{url}'")
        page = context.new_page()
        try:
            page.goto(url, timeout=30000, wait_until="domcontentloaded")
            time.sleep(3)
            # PDF Extraction
            links = page.query_selector_all('a[href$=".pdf"]')
            for a in links[:2]:
                process_pdf_link(page, urljoin(url, a.get_attribute('href')), downloaded_files)
        except: pass
        finally: page.close()

def process_pdf_link(page, url, downloaded_files):
    if not url or not url.startswith('http') or "scribd.com" in url: return
    safe_name = re.sub(r'[^a-zA-Z0-9_\-]', '_', url.split('/')[-1].split('?')[0])
    if not safe_name.endswith('.pdf'): safe_name += '.pdf'
    filepath = os.path.join(PDF_DIR, safe_name)
    if os.path.exists(filepath):
        if filepath not in downloaded_files: downloaded_files.append(filepath)
        return
    print(f"     ⬇️ Pulling: {safe_name[:40]}...")
    try:
        with page.expect_download(timeout=15000) as download_info:
            page.goto(url)
        download = download_info.value
        download.save_as(filepath)
        downloaded_files.append(filepath)
        print(f"        ✅ Saved: {safe_name}")
    except: pass

def extract_intelligent_data(pdf_files):
    print(f"\n⚙️ V7 Core Extraction on {len(pdf_files)} manuals...")
    all_results = []
    for filepath in pdf_files:
        filename = os.path.basename(filepath)
        try:
            with pdfplumber.open(filepath) as pdf:
                for page_num in range(min(len(pdf.pages), 100)):
                    page = pdf.pages[page_num]
                    text = page.extract_text(x_tolerance=2, y_tolerance=2)
                    if not text: continue
                    lines = text.split('\n')
                    for i, line in enumerate(lines):
                        match = re.search(REGEX_EPIROC, line) or re.search(REGEX_SANDVIK, line)
                        if match:
                            oem_val = match.group(0)
                            name = line.replace(oem_val, '').strip()
                            if len(name) < 4 and i > 0: name = lines[i-1].strip()
                            name = re.sub(r'^[\W_]+|[\W_]+$', '', name)
                            if len(name) > 3 and not name.replace(' ', '').isdigit():
                                all_results.append({"name": name[:200], "oem_reference_number": oem_val.replace(' ', '').replace('-', ''), "source": filename})
        except: pass
    return all_results

def export_v7(data):
    if not data: return
    print(f"\n💾 Updating Master Intelligence CSV ({len(data)} parts)...")
    headers = ["name", "oem_reference_number", "source"]
    file_exists = os.path.exists(OUTPUT_CSV)
    with open(OUTPUT_CSV, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        if not file_exists: writer.writeheader()
        writer.writerows(data)
    print("✅ Master Repository Synced.")

if __name__ == "__main__":
    print("🚀 Intelligence Engine V7: Autonomous Expansion Active")
    targets = load_sources()
    queries = generate_intelligent_queries(OUTPUT_CSV)
    existing_pdfs = [os.path.join(PDF_DIR, f) for f in os.listdir(PDF_DIR) if f.endswith('.pdf')] if os.path.exists(PDF_DIR) else []
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", accept_downloads=True)
        
        # 1. Surface Scanning
        direct_scan_v7(context, targets, existing_pdfs)
        # 2. Web Research
        search_discovery_v7(context, queries, existing_pdfs)
        
        browser.close()
    
    # Process only new files
    new_pdfs = [p for p in existing_pdfs if p not in existing_pdfs] # This logic needs fix
    # Logic Fix: existing_pdfs was actually used to store all_pdfs
    all_pdfs = existing_pdfs 
    new_pdfs = [p for p in all_pdfs if p not in ( [os.path.join(PDF_DIR, f) for f in os.listdir(PDF_DIR) if f.endswith('.pdf')] if not os.path.exists(PDF_DIR) else [] )] # Simplify
    
    # Actually just process what is in the folder that isn't in CSV yet (or just process all and de-duplicate)
    extracted = extract_intelligent_data(all_pdfs)
    # Filter out duplicates before export or use a master set
    export_v7(extracted)
