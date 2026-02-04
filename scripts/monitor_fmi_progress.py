"""
Monitor the progress of FMI parts scraping

This script reads the output JSON file and shows real-time progress statistics.

Usage:
    python scripts/monitor_fmi_progress.py
"""

import json
from pathlib import Path
import time


def monitor_progress():
    output_file = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/srp_scraped_data/fmi_parts_data.json")
    part_numbers_file = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/srp_scraped_data/fmi_part_numbers.txt")
    
    # Get total count
    with open(part_numbers_file, 'r') as f:
        total_parts = len(f.readlines())
    
    print(f"📊 FMI Parts Scraping Progress Monitor")
    print(f"{'='*60}\n")
    
    if not output_file.exists():
        print("⏳ Scraping not started yet...")
        return
    
    # Read current results
    with open(output_file, 'r') as f:
        results = json.load(f)
    
    scraped_count = len(results)
    progress_pct = (scraped_count / total_parts) * 100
    
    print(f"Total parts to scrape: {total_parts}")
    print(f"Parts scraped so far: {scraped_count}")
    print(f"Progress: {progress_pct:.1f}%")
    print(f"Remaining: {total_parts - scraped_count}")
    
    # Show some statistics
    if results:
        print(f"\n📋 Sample Data:")
        print(f"   Latest part: {results[-1].get('part_number')} - {results[-1].get('part_name', 'N/A')}")
        
        # Count parts with different attributes
        with_weight = sum(1 for r in results if 'weight' in r)
        with_models = sum(1 for r in results if 'compatible_models' in r)
        
        print(f"\n📈 Data Quality:")
        print(f"   Parts with weight info: {with_weight}/{scraped_count} ({with_weight/scraped_count*100:.1f}%)")
        print(f"   Parts with model info: {with_models}/{scraped_count} ({with_models/scraped_count*100:.1f}%)")
    
    print(f"\n{'='*60}")
    
    # Estimate time remaining (assuming 1.5s per part)
    remaining = total_parts - scraped_count
    est_minutes = (remaining * 1.5) / 60
    print(f"⏱️  Estimated time remaining: ~{est_minutes:.1f} minutes")


if __name__ == "__main__":
    monitor_progress()
