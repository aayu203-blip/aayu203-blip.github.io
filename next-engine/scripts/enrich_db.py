#!/usr/bin/env python3
import os
import json
import time
import google.generativeai as genai
from pathlib import Path

# --- CONFIGURATION ---
BASE_DIR = Path(__file__).parent.parent
INPUT_FILE = BASE_DIR / "full_dataset.jsonl"
OUTPUT_FILE = BASE_DIR / "data" / "enriched_specs.json"
MODEL_NAME = 'gemini-2.0-flash'
RPM_LIMIT = 15  # Free tier safe limit
SLEEP_TIME = 60 / RPM_LIMIT

# --- PROMPT ---
PROMPT_TEMPLATE = """
You are a heavy machinery parts expert. 
Enrich the data for this part with technical specifications and a marketing summary.

Part Details:
Brand: {brand}
Part Number: {part_number}
Raw Name: {name}
Raw Description: {description}
Compatibility Context: {compatibility}

INSTRUCTIONS:
1. 'marketing_description': A 50-word professional summary emphasizing quality and fitment.
2. 'technical_specs': A dictionary of specific attributes (e.g., "Weight": "2.5kg", "Material": "Steel", "Thread": "M12"). ESTIMATE standard values if high confidence, otherwise leave generic.
3. 'application': A clean string of the primary machine application (e.g. "Volvo D12 Engine").
4. Return JSON only.

JSON FORMAT:
{{
  "marketing_description": "...",
  "technical_specs": {{ "Key": "Value" }},
  "application": "..."
}}
"""

def load_harvested_data():
    if not INPUT_FILE.exists():
        print(f"Waiting for input file: {INPUT_FILE}")
        return []
    
    products = []
    with open(INPUT_FILE, 'r') as f:
        for line in f:
            if line.strip():
                try:
                    products.append(json.loads(line))
                except:
                    pass
    return products

def load_enriched_db():
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE, 'r') as f:
            return json.load(f)
    return {}

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found.")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(MODEL_NAME)

    print("🤖 Continuous AI Enrichment Engine Starting...")
    
    while True:
        harvested = load_harvested_data()
        enriched_db = load_enriched_db()
        
        # Identify unenriched parts
        # Keying by 'part_number' + 'brand' to be unique
        to_process = []
        for p in harvested:
            key = f"{p.get('brand', 'Generic')}_{p.get('part_number', 'Unknown')}".replace(" ", "_")
            if key not in enriched_db:
                to_process.append((key, p))
        
        if not to_process:
            print("✅ All parts enriched. Sleeping 60s...")
            time.sleep(60)
            continue
            
        print(f"🚀 Found {len(to_process)} new parts to enrich.")
        
        for key, part in to_process:
            print(f"  > Enriching {part.get('part_number')}...", end="", flush=True)
            
            try:
                response = model.generate_content(
                    PROMPT_TEMPLATE.format(
                        brand=part.get('brand', 'Generic'),
                        part_number=part.get('part_number', 'N/A'),
                        name=part.get('name', ''),
                        description=part.get('description', ''),
                        compatibility=part.get('compatibility', '')
                    ),
                    generation_config={"response_mime_type": "application/json"}
                )
                
                result = json.loads(response.text)
                
                # Save to memory
                enriched_db[key] = result
                
                # Persist to disk immediately (append-like behavior via overwrite)
                with open(OUTPUT_FILE, 'w') as f:
                    json.dump(enriched_db, f, indent=2)
                    
                print(" Done.")
                time.sleep(SLEEP_TIME)
                
            except Exception as e:
                print(f" Failed: {e}")
                time.sleep(10) # Backoff on error

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nStopping Enrichment Engine.")
