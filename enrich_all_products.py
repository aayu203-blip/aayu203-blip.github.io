#!/usr/bin/env python3
import os
import json
import time
import google.generativeai as genai
from pathlib import Path

# --- CONFIGURATION ---
DATA_FILE = '../partDatabase.js'
OUTPUT_FILE = 'enriched_product_data.json'
MODEL_NAME = 'gemini-2.0-flash'
RPM_LIMIT = 15  # Free tier limit (safe default)
SLEEP_TIME = 60 / RPM_LIMIT  # Seconds to sleep between calls

# --- PROMPT TEMPLATE ---
PROMPT_TEMPLATE = """
You are a technical copywriter for a heavy-duty truck parts supplier (Parts Trading Company).
Write a premium, SEO-friendly product description and feature list for the following part.

Part Details:
- Brand: {brand}
- Part Number: {part_number}
- Name/Description: {description}
- Category: {category}
- Application: {application}

INSTRUCTIONS:
1. Write a 50-60 word 'marketing_description' focusing on durability, OEM quality, and performance. Use professional tone.
2. Write 4 bullet points for 'features'. Focus on materials (e.g., "Heat-treated alloy"), precision ("OEM tolerances"), and reliability.
3. DO NOT GUESS SPECIFIC NUMBERS. If you do not know the exact thread size, weight, or dimensions, DO NOT INVENT THEM.
4. Output specific measurements ONLY if you are 100% certain based on your internal knowledge of this standard part. Otherwise set 'measurements' to null.
5. Return ONLY valid JSON.

JSON FORMAT:
{{
  "description": "...",
  "features": ["...", "...", "...", "..."],
  "application": "...",
  "part_label": "...",
  "measurements": "..." (or null)
}}
"""

def load_products():
    """Reads the JS database file and extracts the JSON-like list."""
    try:
        content = Path(DATA_FILE).read_text(encoding='utf-8')
        # Strip JS variable declaration to parse raw JSON
        json_str = content.split('const partDatabase = ')[1].strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]
        
        data = json.loads(json_str) 
        
        # Handle potential nested list artifact
        if isinstance(data, list) and len(data) == 1 and isinstance(data[0], list):
            print("DEBUG: Unwrapping nested product list.")
            data = data[0]
            
        return data
    except Exception as e:
        print(f"Error reading database: {e}")
        return []

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("❌ Error: GEMINI_API_KEY environment variable not found.")
        print("Please export your key: export GEMINI_API_KEY='your_key_here'")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(MODEL_NAME)

    products = load_products()
    if not products:
        print("No products found to process.")
        return

    print(f"Loaded {len(products)} products.")

    # Load existing data to resume progress
    enriched_data = {}
    if Path(OUTPUT_FILE).exists():
        try:
            with open(OUTPUT_FILE, 'r') as f:
                enriched_data = json.load(f)
                print(f"Resuming... {len(enriched_data)} already enriched.")
        except:
            print("Could not read existing file, starting fresh.")

    # Filter for products not yet processed
    to_process = [p for p in products if p['partNumber'] not in enriched_data]
    print(f"Remaining to process: {len(to_process)}")

    count = 0
    try:
        for p in to_process:
            part_num = p['partNumber']
            brand = p['brand']
            
            # Skip if we already have it (double check)
            if part_num in enriched_data:
                continue

            print(f"[{count+1}/{len(to_process)}] Enriching {brand} {part_num}...", end='', flush=True)

            try:
                response = model.generate_content(
                    PROMPT_TEMPLATE.format(
                        brand=brand,
                        part_number=part_num,
                        description=p['description'],
                        category=p['category'],
                        application=p['application']
                    ),
                    generation_config={"response_mime_type": "application/json"}
                )
                
                # Parse JSON response
                data = json.loads(response.text)
                
                # Add to master dict
                enriched_data[part_num] = data
                print(" ✅")

                # Save every 10 items to be safe
                if count % 10 == 0:
                    with open(OUTPUT_FILE, 'w') as f:
                        json.dump(enriched_data, f, indent=2)

            except Exception as e:
                print(f" ❌ Error: {e}")
                if "429" in str(e):
                    if "FreeTier" in str(e):
                        print("CRITICAL: Still hitting Free Tier limits. Billing might not be active.")
                        time.sleep(10)
                    else:
                        print("Standard rate limit. Sleeping 5s...")
                        time.sleep(5)
                # Don't crash, just skip
            
            count += 1
            time.sleep(SLEEP_TIME) # Respect rate limit

    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        # Final Save
        with open(OUTPUT_FILE, 'w') as f:
            json.dump(enriched_data, f, indent=2)
        print(f"\nSaved {len(enriched_data)} enriched products to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
