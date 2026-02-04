"""
Merge transformed FMI parts into main parts database

This script:
1. Backs up the existing database
2. Checks for duplicate part numbers
3. Merges FMI parts into the main database
4. Updates brand counts

Usage:
    python3 scripts/merge_fmi_parts.py
    python3 scripts/merge_fmi_parts.py --dry-run  # Preview without making changes
"""

import json
import shutil
from pathlib import Path
from datetime import datetime
import argparse


def main():
    parser = argparse.ArgumentParser(description='Merge FMI parts into main database')
    parser.add_argument('--dry-run', action='store_true', help='Preview changes without modifying files')
    
    args = parser.parse_args()
    
    # Paths
    base_dir = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete")
    db_file = base_dir / "next-engine/data/parts-database.json"
    transformed_file = base_dir / "srp_scraped_data/fmi_parts_transformed.json"
    backup_file = base_dir / f"next-engine/data/parts-database.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    print("📊 FMI Parts Database Merge")
    print("=" * 60)
    
    # Load existing database
    print(f"\n📂 Loading existing database: {db_file}")
    with open(db_file, 'r') as f:
        existing_db = json.load(f)
    print(f"   Current parts: {len(existing_db)}")
    
    # Load transformed FMI parts
    print(f"\n📂 Loading transformed FMI parts: {transformed_file}")
    with open(transformed_file, 'r') as f:
        fmi_parts = json.load(f)
    print(f"   FMI parts: {len(fmi_parts)}")
    
    # Check for duplicates
    print(f"\n🔍 Checking for duplicate part numbers...")
    existing_part_numbers = {p['part_number'] for p in existing_db if p['brand'] == 'Volvo'}
    fmi_part_numbers = {p['part_number'] for p in fmi_parts}
    duplicates = existing_part_numbers & fmi_part_numbers
    
    if duplicates:
        print(f"   ⚠️  Found {len(duplicates)} duplicate part numbers:")
        for dup in list(duplicates)[:10]:
            print(f"      - {dup}")
        if len(duplicates) > 10:
            print(f"      ... and {len(duplicates) - 10} more")
        
        print(f"\n   Strategy: FMI parts will REPLACE existing duplicates (better data)")
    else:
        print(f"   ✅ No duplicates found")
    
    # Remove duplicates from existing database
    if duplicates:
        print(f"\n🗑️  Removing {len(duplicates)} duplicate parts from existing database...")
        existing_db = [p for p in existing_db if p['part_number'] not in duplicates or p['brand'] != 'Volvo']
        print(f"   Remaining parts: {len(existing_db)}")
    
    # Merge
    print(f"\n🔀 Merging FMI parts...")
    merged_db = existing_db + fmi_parts
    print(f"   Total parts after merge: {len(merged_db)}")
    
    # Statistics
    volvo_count = sum(1 for p in merged_db if p['brand'] == 'Volvo')
    fmi_count = sum(1 for p in merged_db if p.get('data_source') == 'fmi_india')
    
    print(f"\n📈 Statistics:")
    print(f"   Total parts: {len(merged_db)}")
    print(f"   Volvo parts: {volvo_count}")
    print(f"   FMI parts: {fmi_count}")
    print(f"   Other brands: {len(merged_db) - volvo_count}")
    
    if args.dry_run:
        print(f"\n🔍 DRY RUN - No files modified")
        print(f"\n   Would create backup: {backup_file}")
        print(f"   Would update: {db_file}")
        return
    
    # Backup existing database
    print(f"\n💾 Creating backup...")
    shutil.copy2(db_file, backup_file)
    print(f"   Backup saved: {backup_file}")
    
    # Save merged database
    print(f"\n💾 Saving merged database...")
    with open(db_file, 'w') as f:
        json.dump(merged_db, f, indent=2, ensure_ascii=False)
    print(f"   ✅ Saved: {db_file}")
    
    print(f"\n{'='*60}")
    print(f"✅ Merge complete!")
    print(f"{'='*60}")
    print(f"\n📊 Summary:")
    print(f"   Added: {len(fmi_parts)} FMI parts")
    print(f"   Replaced: {len(duplicates)} duplicate parts")
    print(f"   Total Volvo parts: {volvo_count}")
    print(f"   Database size: {len(merged_db)} parts")
    
    print(f"\n⚠️  Next steps:")
    print(f"   1. Update Volvo part count in lib/brands.ts to {volvo_count}")
    print(f"   2. Test search functionality")
    print(f"   3. Verify product pages load correctly")


if __name__ == "__main__":
    main()
