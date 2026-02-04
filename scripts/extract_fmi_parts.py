"""
Extract and scrape all Volvo parts from India - FMI.xlsx

This script:
1. Reads the FMI Excel file containing ~1000 fast-moving Volvo part numbers
2. Extracts and cleans all part numbers (including comma-separated entries)
3. Uses the SRP scraper to fetch detailed data for each part
4. Saves results to JSON with comprehensive metadata

Usage:
    python scripts/extract_fmi_parts.py
"""

import pandas as pd
import json
import os
import sys
from pathlib import Path

# Add scripts directory to path to import scrape_srp
sys.path.insert(0, str(Path(__file__).parent))
from scrape_srp import SRPScraper


def extract_part_numbers_from_excel(excel_path: str) -> list[str]:
    """
    Extract all part numbers from the FMI Excel file.
    
    The file has part numbers in the first column, with some entries
    containing multiple comma-separated part numbers.
    """
    print(f"📂 Reading Excel file: {excel_path}")
    
    # Read Excel file
    df = pd.read_excel(excel_path)
    
    # Get all values from first column (including the header which is also a part number)
    all_values = [str(df.columns[0])]  # Header is a part number
    all_values.extend(df.iloc[:, 0].astype(str).tolist())
    
    # Extract and clean part numbers
    part_numbers = []
    
    for value in all_values:
        if pd.isna(value) or value == 'nan':
            continue
            
        # Handle comma-separated values
        if ',' in value:
            parts = [p.strip() for p in value.split(',')]
            part_numbers.extend(parts)
        else:
            part_numbers.append(value.strip())
    
    # Remove duplicates while preserving order
    seen = set()
    unique_parts = []
    for part in part_numbers:
        if part and part not in seen:
            seen.add(part)
            unique_parts.append(part)
    
    print(f"✅ Extracted {len(unique_parts)} unique part numbers")
    print(f"   (from {len(all_values)} total entries)")
    
    return unique_parts


def main():
    # Paths
    excel_path = "/Users/aayush/Downloads/India - FMI.xlsx"
    output_dir = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete/srp_scraped_data")
    output_dir.mkdir(exist_ok=True)
    
    output_file = output_dir / "fmi_parts_data.json"
    part_numbers_file = output_dir / "fmi_part_numbers.txt"
    
    # Extract part numbers from Excel
    part_numbers = extract_part_numbers_from_excel(excel_path)
    
    # Save part numbers list for reference
    with open(part_numbers_file, 'w') as f:
        f.write('\n'.join(part_numbers))
    print(f"💾 Saved part numbers to: {part_numbers_file}")
    
    # Initialize scraper with 1.5 second delay to be respectful
    print(f"\n🚀 Starting scraper for {len(part_numbers)} parts...")
    print(f"⏱️  Estimated time: ~{len(part_numbers) * 1.5 / 60:.1f} minutes")
    print(f"📊 Progress will be saved to: {output_file}\n")
    
    scraper = SRPScraper(delay=1.5)
    
    # Scrape all parts
    results = scraper.scrape_multiple(part_numbers, output_file=str(output_file))
    
    # Generate summary statistics
    print(f"\n{'='*60}")
    print(f"📊 EXTRACTION SUMMARY")
    print(f"{'='*60}")
    print(f"Total parts in FMI list: {len(part_numbers)}")
    print(f"Successfully scraped: {len(results)}")
    print(f"Not found/failed: {len(part_numbers) - len(results)}")
    print(f"Success rate: {len(results)/len(part_numbers)*100:.1f}%")
    print(f"\n📁 Output files:")
    print(f"   - Part data: {output_file}")
    print(f"   - Part numbers: {part_numbers_file}")
    print(f"{'='*60}")
    
    # Show sample of scraped data
    if results:
        print(f"\n📋 Sample scraped data (first part):")
        print(json.dumps(results[0], indent=2))


if __name__ == "__main__":
    main()
