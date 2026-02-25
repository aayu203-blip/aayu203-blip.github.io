
import json
import os
from collections import defaultdict

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
DB_PATH = os.path.join(BASE_DIR, "god-mode", "data", "parts-database.json")

def load_database():
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading DB: {e}")
        return []

def analyze_opportunities():
    print(f"--- Deep Scanning God Mode Data ---")
    db = load_database()
    print(f"Total Parts: {len(db)}")
    
    brands = defaultdict(int)
    symptoms_count = 0
    cross_ref_count = 0
    tech_specs_count = 0
    categories = defaultdict(int)
    
    # Track cross-refs by brand to see who we can attack
    competitor_refs = defaultdict(int)

    for part in db:
        # Brand Analysis
        b = part.get("brand", "Unknown").title()
        if b == "Cat": b = "Caterpillar"
        brands[b] += 1
        
        # Category Analysis
        c = part.get("category", "Uncategorized")
        if c: categories[c] += 1
        
        # Rich Dta
        if part.get("symptoms_list_raw") and len(part.get("symptoms_list_raw")) > 5:
            symptoms_count += 1
            
        if part.get("cross_reference_oem") and len(part.get("cross_reference_oem")) > 0:
            cross_ref_count += 1
            
        if part.get("technical_specs") and len(part.get("technical_specs")) > 0:
            tech_specs_count += 1

    print("\n--- BRAND DISTRIBUTION ---")
    for b, c in sorted(brands.items(), key=lambda x: x[1], reverse=True):
        print(f"{b}: {c}")

    print("\n--- CONTENT RICHNESS (SEO GOLD) ---")
    print(f"Parts with Symptoms (Diagnostic Pages): {symptoms_count}")
    print(f"Parts with Cross-Refs (Competitor Intercept): {cross_ref_count}")
    print(f"Parts with Technical Specs (Rich Snippets): {tech_specs_count}")
    
    print("\n--- TOP CATEGORIES ---")
    for c, count in sorted(categories.items(), key=lambda x: x[1], reverse=True)[:15]:
        print(f"{c}: {count}")

if __name__ == "__main__":
    analyze_opportunities()
