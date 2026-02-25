
import json
import os
import re
from collections import defaultdict

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete")
# NEW DB PATH
DB_PATH = os.path.join(EXPERIMENTS_DIR, "god-mode", "data", "parts-database.json")

def load_database():
    try:
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading DB: {e}")
        return []

def analyze_clusters():
    print(f"--- Analyzing Model Clusters from {os.path.basename(DB_PATH)} ---")
    db = load_database()
    print(f"Loaded {len(db)} parts.")
    
    # Store: brand -> model -> category -> count
    clusters = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    
    target_brands = ["caterpillar", "cat", "komatsu", "hitachi", "kobelco", "volvo", "scania"]
    
    for part in db:
        brand = part.get("brand", "").lower().strip()
        app = part.get("application", "").strip()
        cat = part.get("category", "").strip()
        
        # Normalize CAT
        if brand == "cat": brand = "caterpillar"
        
    # Store: brand -> count
    brand_counts = defaultdict(int)

    for part in db:
        brand = part.get("brand", "").lower().strip()
        app = part.get("application", "").strip()
        cat = part.get("category", "").strip()
        
        # Normalize CAT
        if brand == "cat": brand = "caterpillar"
        
        if brand in target_brands:
            model = app
            
            # Smart Inference for Missing Applications
            if (not model or model == "-") and "technical_specs" in part:
                specs = part["technical_specs"]
                # Try to find model in specs
                candidates = [
                    specs.get("Engine"),
                    specs.get("Compatible Models"),
                    specs.get("Model"),
                    specs.get("Fits"),
                    specs.get("Application")
                ]
                for c in candidates:
                    if c and isinstance(c, str):
                        model = c.strip()
                        break
            
            brand_counts[brand] += 1
            
            if model and model != "-": 
                clusters[brand][model][cat] += 1
            else:
                clusters[brand]["Generic"][cat] += 1

    print("\n--- BRAND SUMMARY ---")
    for b, c in sorted(brand_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"{b.title()}: {c}")
    print("---------------------\n")
                
    # Flatten and Sort
    results = []
    for brand, models in clusters.items():
        for model, categories in models.items():
            for category, count in categories.items():
                results.append({
                    "brand": brand.title(),
                    "model": model,
                    "category": category,
                    "count": count
                })
                
    # Sort by count descending
    results.sort(key=lambda x: x['count'], reverse=True)
    
    print(f"{'BRAND':<15} | {'MODEL':<20} | {'CATEGORY':<30} | {'COUNT':<5}")
    print("-" * 80)
    
    for r in results[:50]:
        print(f"{r['brand']:<15} | {r['model']:<20} | {r['category']:<30} | {r['count']:<5}")

if __name__ == "__main__":
    analyze_clusters()
