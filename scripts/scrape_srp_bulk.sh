#!/bin/bash
# Large Scale SRP Scraping Script
# Scrapes multiple Volvo part categories from srp.com.tr

echo "🚀 Starting Large Scale SRP Scraping"
echo "======================================"

# Define categories to scrape
categories=(
    "electrical-system-and-instrumentation"
    "transmission-system"
    "hydraulic-system"
    "engine-components"
    "cooling-system"
    "fuel-system"
    "brake-system"
    "steering-system"
    "axle-and-suspension"
    "cab-and-body"
)

# Create output directory
mkdir -p srp_scraped_data
cd /Users/aayush/Downloads/PTC\ Website/Working\ Website/EXPERIMENTS/PTC_Website_Complete

total_categories=${#categories[@]}
current=0

for category in "${categories[@]}"; do
    current=$((current + 1))
    echo ""
    echo "[$current/$total_categories] Scraping category: $category"
    echo "----------------------------------------"
    
    python3 scripts/scrape_srp.py \
        --category "$category" \
        --max-pages 50 \
        --output "srp_scraped_data/volvo_${category}.json" \
        --delay 0.8
    
    if [ $? -eq 0 ]; then
        echo "✅ Completed: $category"
    else
        echo "❌ Failed: $category"
    fi
    
    # Brief pause between categories
    echo "Pausing 3 seconds before next category..."
    sleep 3
done

echo ""
echo "======================================"
echo "🎉 Scraping Complete!"
echo "======================================"

# Merge all JSON files
echo "Merging all scraped data..."
python3 - << 'PYTHON_SCRIPT'
import json
import glob
import os

all_parts = []
files = glob.glob('srp_scraped_data/volvo_*.json')

for file in files:
    try:
        with open(file, 'r') as f:
            parts = json.load(f)
            all_parts.extend(parts)
            print(f"✅ Loaded {len(parts)} parts from {os.path.basename(file)}")
    except Exception as e:
        print(f"❌ Error loading {file}: {e}")

# Remove duplicates by part_number
unique_parts = {}
for part in all_parts:
    pn = part.get('part_number')
    if pn and pn not in unique_parts:
        unique_parts[pn] = part

final_parts = list(unique_parts.values())

# Save merged file
with open('srp_scraped_data/volvo_all_parts.json', 'w') as f:
    json.dump(final_parts, f, indent=2)

print(f"\n{'='*50}")
print(f"Total unique parts: {len(final_parts)}")
print(f"Output: srp_scraped_data/volvo_all_parts.json")
print(f"{'='*50}")
PYTHON_SCRIPT

echo ""
echo "📊 Summary:"
ls -lh srp_scraped_data/
