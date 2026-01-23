import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import random
import os

# Configuration
INPUT_FILE = 'full_dataset.jsonl' # We will read the SparePower harvest
OUTPUT_FILE = 'enriched_dataset.jsonl'
SRP_BASE_URL = "https://srp.com.tr/volvo/"

USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
]

async def fetch_srp_data(session, part_number):
    # Try cleaning the part number if it has suffix like _2_82 (SparePower specific?)
    # SparePower: "11195079_2_82" -> Real: "11195079"
    clean_pn = part_number.split('_')[0]
    url = f"{SRP_BASE_URL}{clean_pn}"
    
    try:
        async with session.get(url, headers={'User-Agent': random.choice(USER_AGENTS)}) as response:
            if response.status != 200:
                return None
            
            html = await response.text()
            soup = BeautifulSoup(html, 'html.parser')
            
            # Extract Name from Title or OG Tag
            # <meta property="og:title" content="Volvo 11195079 RUBBER SPRING" />
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                full_title = og_title["content"] # "Volvo 11195079 RUBBER SPRING"
                # Clean it: remove "Volvo {PN}" prefix
                name = full_title.replace(f"Volvo {clean_pn}", "").strip()
                return {'srp_name': name, 'srp_url': url}
            
            return None
    except Exception:
        return None

async def process_line(sem, session, line):
    async with sem:
        try:
            record = json.loads(line)
            part_number = record.get('part_number', '')
            
            if not part_number or part_number == "N/A":
                return record # No change
                
            srp_data = await fetch_srp_data(session, part_number)
            
            if srp_data:
                # ENRICHMENT HAPPENS HERE
                record['original_name'] = record['name'] # Keep old name just in case
                record['name'] = srp_data['srp_name'] # Overwrite with better name
                record['srp_url'] = srp_data['srp_url']
                record['source'] = 'SparePower + SRP'
                
            return record
        except Exception:
            return None

async def main():
    concurrency = 10 # Be polite to SRP
    sem = asyncio.Semaphore(concurrency)
    
    tasks = []
    
    # Check if input exists
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Input file {INPUT_FILE} not found. Run mass_harvest first.")
        return

    print("🚀 Starting SRP Enrichment...")
    
    async with aiohttp.ClientSession() as session:
        with open(INPUT_FILE, 'r') as f:
            for line in f:
                if not line.strip(): continue
                task = asyncio.create_task(process_line(sem, session, line))
                tasks.append(task)
        
        results = []
        total = len(tasks)
        done_count = 0
        
        for f in asyncio.as_completed(tasks):
            res = await f
            if res:
                results.append(res)
            
            done_count += 1
            if done_count % 100 == 0:
                print(f"Processed {done_count}/{total}")

    # Write Output
    with open(OUTPUT_FILE, 'w') as f:
        for r in results:
            f.write(json.dumps(r) + "\n")
            
    print(f"✅ Enrichment Complete. Saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
