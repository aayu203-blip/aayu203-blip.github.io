
import json
import os
import re
from collections import defaultdict

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")

def load_database():
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        return json.loads(json_str)
    return []

def analyze():
    print("--- Analyzing Category Opportunities ---")
    db = load_database()
    
    # Group by Application + Category
    stats = defaultdict(int)
    
    for part in db:
        app = part.get("Application", "Unknown").strip()
        cat = part.get("Category", "Unknown").strip()
        if not app or not cat:
            continue
            
        key = f"{app} > {cat}"
        stats[key] += 1
        
    # Sort by count
    sorted_stats = sorted(stats.items(), key=lambda x: x[1], reverse=True)
    
    print(f"{'Category Cluster':<50} | {'Count':<10}")
    print("-" * 65)
    
    for key, count in sorted_stats[:20]:
        print(f"{key:<50} | {count:<10}")

if __name__ == "__main__":
    analyze()
