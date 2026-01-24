import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import random
import os

# Configuration
INPUT_FILE = 'all_product_urls.txt'
OUTPUT_FILE = 'full_dataset.jsonl'
CONCURRENCY = 15  # Moderate concurrency to be safe
USER_AGENTS = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
]

async def fetch_product(session, url):
    try:
        async with session.get(url, headers={'User-Agent': random.choice(USER_AGENTS)}) as response:
            if response.status != 200:
                print(f"❌ {response.status} for {url}")
                return None
            return await response.text()
    except Exception as e:
        print(f"⚠️ Error {e} for {url}")
        return None

def parse_product(html, url):
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Name
        name_tag = soup.find('h1', class_='product-title')
        name = name_tag.get_text(strip=True) if name_tag else "Unknown"
        
        # SKU / Part Number
        sku = "N/A"
        sku_tag = soup.find(class_='sku')
        if sku_tag:
            sku = sku_tag.get_text(strip=True)
            
        # Compatibility (Category/Tags/Tables)
        compatibility = []
        posted_in = soup.find(class_='posted_in')
        if posted_in:
            compatibility.append(posted_in.get_text(strip=True))
        tagged_as = soup.find(class_='tagged_as')
        if tagged_as:
            compatibility.append(tagged_as.get_text(strip=True))
            
        # Description
        desc = ""
        short_desc = soup.find(class_='product-short-description')
        if short_desc:
            desc = short_desc.get_text(strip=True)
            
        return {
            'name': name,
            'part_number': sku,
            'url': url,
            'compatibility': " | ".join(compatibility),
            'description': desc,
            'source': 'SparePower'
        }
    except Exception:
        return None

async def worker(queue, session, write_queue):
    while True:
        try:
            url = await queue.get()
            html = await fetch_product(session, url)
            
            if html:
                data = parse_product(html, url)
                if data:
                    await write_queue.put(data)
                    
            queue.task_done()
            await asyncio.sleep(random.uniform(0.1, 0.5))
        except asyncio.CancelledError:
            break
        except Exception:
            queue.task_done()

async def writer(write_queue, output_file):
    print(f"📂 Writer started. Target: {os.path.abspath(output_file)}")
    with open(output_file, 'a') as f:
        while True:
            try:
                data = await write_queue.get()
                f.write(json.dumps(data) + "\n")
                f.flush()
                os.fsync(f.fileno()) # FORCE DISK SYNC
                write_queue.task_done()
            except asyncio.CancelledError:
                break
            except Exception as e:
                print(f"Write error: {e}")

async def main():
    # Read URLs
    with open(INPUT_FILE, 'r') as f:
        urls = [line.strip() for line in f if line.strip()]
        
    print(f"🚀 Starting Mass Harvest of {len(urls)} items with {CONCURRENCY} workers...")
    
    # Resume capability: Count lines in output
    scraped_count = 0
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r') as f:
            scraped_count = sum(1 for line in f)
    
    print(f"⏩ Skipping {scraped_count} already scraped items.")
    urls_to_scrape = urls[scraped_count:]
    
    queue = asyncio.Queue()
    write_queue = asyncio.Queue()
    
    for u in urls_to_scrape:
        queue.put_nowait(u)
        
    async with aiohttp.ClientSession(connector=aiohttp.TCPConnector(ssl=False)) as session:
        # Start Writer
        writer_task = asyncio.create_task(writer(write_queue, OUTPUT_FILE))
        
        # Start Workers
        workers = []
        for _ in range(CONCURRENCY):
            task = asyncio.create_task(worker(queue, session, write_queue))
            workers.append(task)
        
        # Progress Monitoring
        total = len(urls_to_scrape)
        start_size = queue.qsize()
        
        while not queue.empty():
            remaining = queue.qsize()
            done = start_size - remaining
            term_width = 50
            if start_size > 0:
                filled = int(done / start_size * term_width)
            else:
                filled = term_width
            bar = '█' * filled + '-' * (term_width - filled)
            print(f"\r[{bar}] {done}/{start_size} ({done/max(1,start_size)*100:.1f}%) - Written: {scraped_count + done}", end='')
            await asyncio.sleep(2)
            
        await queue.join()
        
        # Signal writer to finish
        await write_queue.join()
        writer_task.cancel()
        for w in workers:
            w.cancel()
                
    print("\n✅ Mass Harvest Complete.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Stopped by user.")
