import requests
from bs4 import BeautifulSoup
import json
import time
import random

def mine_srp():
    # Load Targets
    try:
        with open('data/targets_snapshot.json', 'r') as f:
            targets = json.load(f)
    except FileNotFoundError:
        print("No targets found. Run harvester first.")
        return

    print(f"⛏️  Starting Miner for {len(targets)} parts...")
    
    mined_data = []
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    # We'll try just the first 5 for the test run to be fast
    for part_id in targets[:5]: 
        print(f"  🔍 Searching for: {part_id}")
        
        # Try search URL
        # The verify script showed input name='keyword'
        search_url = f"https://srp.com.tr/page/spare-parts?keyword={part_id}"
        
        try:
            res = requests.get(search_url, headers=headers, timeout=15)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, 'html.parser')
                
                # Check results
                # We need to find where results are listed.
                # Usually a list or grid.
                # I'll look for any link that looks like a product detail page
                # or assumes the first result is it.
                
                # Let's verify if we found anything
                if "No results" in res.text:
                    print("    ❌ No data found.")
                    continue
                    
                # Naive extraction: Get all text from card-like elements
                # This is a "blind" miner - we just want to see if we get DATA.
                # In a real run, we'd target specific classes.
                
                # Look for product Items
                items = soup.find_all(class_='product-item') # Common class
                if not items:
                    items = soup.find_all(class_='item')
                
                if items:
                    print(f"    ✅ Found {len(items)} matches.")
                    first_match = items[0]
                    
                    data = {
                        "id": part_id,
                        "raw_html": str(first_match)[:500], # Save snippet for inspection
                        "text": first_match.get_text(strip=True)[:200]
                    }
                    mined_data.append(data)
                else:
                    # Fallback: maybe the page IS the product page?
                    # Unlikely for a search result.
                    print("    ⚠️  Results page loaded but no items found (needs selector tuning).")
                    
            else:
                print(f"    ⚠️  Status {res.status_code}")
                
        except Exception as e:
            print(f"    ⚠️  Error: {e}")
            
        time.sleep(1)
        
    # Save
    with open('data/mined_data.json', 'w') as f:
        json.dump(mined_data, f, indent=2)
    print("Miner finished.")

if __name__ == "__main__":
    mine_srp()
