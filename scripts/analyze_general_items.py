
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/aayu203-blip.github.io"
LIVE_DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")

def load_js_db(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
        if match:
            json_str = match.group(1)
            # Fix trailing commas
            json_str = re.sub(r',\s*]', ']', json_str)
            json_str = re.sub(r',\s*}', '}', json_str)
            return json.loads(json_str)
    except Exception as e:
        print(f"Error loading JS DB: {e}")
    return []

def analyze_general():
    print("--- Analyzing 'General Accessories' Items ---")
    db = load_js_db(LIVE_DB_PATH)
    
    general_items = []
    
    for part in db:
        cat = part.get("Category", "").strip()
        if not cat or cat.lower() in ["general accessories", "uncategorized", "general", "accessories"]:
            desc = part.get("Cleaned Description", "").strip()
            if desc:
                general_items.append(desc)
                
    print(f"Found {len(general_items)} items in General/Uncategorized.")
    
    print("\n--- SAMPLE ITEMS (Top 50) ---")
    for item in general_items[:50]:
        print(f"- {item}")
        
    # Frequency Analysis for Keywords
    words = {}
    for item in general_items:
        for w in item.lower().split():
            if len(w) > 3:
                words[w] = words.get(w, 0) + 1
                
    print("\n--- TOP KEYWORDS ---")
    for w, c in sorted(words.items(), key=lambda x: x[1], reverse=True)[:20]:
        print(f"{w}: {c}")

if __name__ == "__main__":
    analyze_general()
