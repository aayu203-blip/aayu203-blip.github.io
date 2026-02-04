"""
Transform FMI scraped data to PTC website database format

This script converts the 856 FMI Volvo parts from SRP scrape format
into the PTC website's parts-database.json schema.

Usage:
    python3 scripts/transform_fmi_to_database.py
    python3 scripts/transform_fmi_to_database.py --sample 10  # Test with 10 parts
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Optional
import argparse


# Category mapping from SRP to PTC
CATEGORY_MAPPING = {
    # Transmission & Drivetrain
    'transmission': 'Drivetrain',
    'gear': 'Drivetrain',
    'clutch': 'Drivetrain',
    'shaft': 'Drivetrain',
    'bearing': 'Drivetrain',
    'axle': 'Drivetrain',
    
    # Engine
    'engine': 'Engine Components',
    'piston': 'Engine Components',
    'valve': 'Engine Components',
    'gasket': 'Engine Components',
    'seal': 'Engine Components',
    'turbo': 'Engine Components',
    'injector': 'Engine Components',
    'pump': 'Engine Components',
    
    # Hydraulics
    'hydraulic': 'Hydraulic Systems',
    'cylinder': 'Hydraulic Systems',
    'hose': 'Hydraulic Systems',
    
    # Brakes
    'brake': 'Brake & Steering Systems',
    'disc': 'Brake & Steering Systems',
    
    # Electrical
    'alternator': 'Electrical & Electronics',
    'starter': 'Electrical & Electronics',
    'sensor': 'Electrical & Electronics',
    'switch': 'Electrical & Electronics',
    
    # Filters
    'filter': 'Filtration & Maintenance',
    'oil': 'Filtration & Maintenance',
    
    # Fasteners
    'bolt': 'Fasteners & Hardware',
    'screw': 'Fasteners & Hardware',
    'nut': 'Fasteners & Hardware',
    'washer': 'Fasteners & Hardware',
    'ring': 'Fasteners & Hardware',
}


def infer_category(part_name: str) -> str:
    """Infer PTC category from part name"""
    part_name_lower = part_name.lower()
    
    for keyword, category in CATEGORY_MAPPING.items():
        if keyword in part_name_lower:
            return category
    
    return "General Accessories"


def generate_slug(part_number: str) -> str:
    """Generate URL slug for part"""
    # Clean part number for slug
    clean_number = re.sub(r'[^a-zA-Z0-9-]', '-', part_number.lower())
    return f"volvo-{clean_number}"


def generate_product_name(part_number: str, part_name: str) -> str:
    """Generate product name"""
    # Capitalize part name properly
    name_parts = part_name.split()
    capitalized = ' '.join(word.capitalize() for word in name_parts)
    return f"Volvo {part_number} {capitalized}"


def generate_description(part: Dict) -> str:
    """Generate SEO-friendly description"""
    part_name = part.get('part_name', 'Part')
    part_number = part.get('part_number', '')
    weight = part.get('weight', '')
    models = part.get('compatible_models', [])
    
    desc = f"Genuine Volvo {part_name} {part_number}. "
    
    if weight:
        desc += f"Weight: {weight}. "
    
    if models:
        models_str = ', '.join(models[:5])  # First 5 models
        desc += f"Compatible with: {models_str}. "
    
    desc += "High-quality OEM replacement part. Fast-moving inventory item."
    
    return desc


def create_technical_specs(part: Dict) -> Dict:
    """Create technical specs object"""
    specs = {
        "Part Number": part.get('part_number', ''),
        "Brand": "Volvo",
    }
    
    if part.get('part_name'):
        specs["Part Type"] = part['part_name'].title()
    
    if part.get('weight'):
        specs["Weight"] = part['weight']
    
    if part.get('srp_part_number'):
        specs["SRP Part Number"] = part['srp_part_number']
    
    return specs


def create_json_ld(part: Dict, product_name: str, description: str) -> Dict:
    """Create JSON-LD structured data"""
    json_ld = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product_name,
        "sku": part.get('part_number', ''),
        "mpn": part.get('part_number', ''),
        "brand": {
            "@type": "Brand",
            "name": "Volvo"
        },
        "description": description,
    }
    
    # Add weight if available
    if part.get('weight'):
        try:
            weight_value = float(part['weight'].split()[0])
            json_ld["weight"] = {
                "@type": "QuantitativeValue",
                "value": weight_value,
                "unitCode": "KGM"
            }
        except:
            pass
    
    # Add compatible models
    if part.get('compatible_models'):
        json_ld["isCompatibleWith"] = [
            {
                "@type": "Product",
                "name": f"Volvo {model}"
            }
            for model in part['compatible_models'][:5]
        ]
    
    return json_ld


def transform_part(part: Dict, next_id: int) -> Dict:
    """Transform single FMI part to PTC database format"""
    part_number = part.get('part_number', '')
    part_name = part.get('part_name', 'Part')
    
    # Generate fields
    slug = generate_slug(part_number)
    product_name = generate_product_name(part_number, part_name)
    category = infer_category(part_name)
    description = generate_description(part)
    technical_specs = create_technical_specs(part)
    json_ld = create_json_ld(part, product_name, description)
    
    # Build application string from compatible models
    application = ', '.join(part.get('compatible_models', [])[:10]) if part.get('compatible_models') else ''
    
    # Create transformed part
    transformed = {
        "id": next_id,
        "brand": "Volvo",
        "part_number": part_number,
        "product_name": product_name,
        "category": category,
        "application": application,
        "slug": slug,
        "url": f"/pages/products/{slug}.html",
        "technical_specs": technical_specs,
        "json_ld": json_ld,
        "alternate_part_numbers": [part.get('srp_part_number')] if part.get('srp_part_number') else [],
        "cross_reference_oem": [],
        "data_quality": "good",
        "data_source": "fmi_india",  # Tag for tracking
        "fmi_metadata": {
            "srp_url": part.get('url', ''),
            "scraped_at": part.get('scraped_at', ''),
            "views": part.get('views', 0) if part.get('views') else None
        }
    }
    
    return transformed


def main():
    parser = argparse.ArgumentParser(description='Transform FMI data to PTC database format')
    parser.add_argument('--sample', type=int, help='Transform only N sample parts for testing')
    parser.add_argument('--input', default='srp_scraped_data/fmi_parts_data.json', help='Input FMI JSON file')
    parser.add_argument('--output', default='srp_scraped_data/fmi_parts_transformed.json', help='Output transformed JSON')
    
    args = parser.parse_args()
    
    # Paths
    base_dir = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete")
    input_file = base_dir / args.input
    output_file = base_dir / args.output
    
    # Load FMI data
    print(f"📂 Loading FMI data from: {input_file}")
    with open(input_file, 'r') as f:
        fmi_parts = json.load(f)
    
    # Sample if requested
    if args.sample:
        fmi_parts = fmi_parts[:args.sample]
        print(f"🔬 Processing sample of {args.sample} parts")
    
    print(f"📊 Transforming {len(fmi_parts)} parts...")
    
    # Get next ID from existing database
    db_file = base_dir / "next-engine/data/parts-database.json"
    with open(db_file, 'r') as f:
        existing_db = json.load(f)
    next_id = max(p['id'] for p in existing_db) + 1
    
    # Transform all parts
    transformed_parts = []
    for i, part in enumerate(fmi_parts, 1):
        try:
            transformed = transform_part(part, next_id + i - 1)
            transformed_parts.append(transformed)
            
            if i % 100 == 0:
                print(f"  ✓ Processed {i}/{len(fmi_parts)} parts")
        except Exception as e:
            print(f"  ❌ Error transforming {part.get('part_number', 'unknown')}: {e}")
    
    # Save transformed data
    with open(output_file, 'w') as f:
        json.dump(transformed_parts, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Transformation complete!")
    print(f"📁 Output: {output_file}")
    print(f"📊 Transformed: {len(transformed_parts)}/{len(fmi_parts)} parts")
    
    # Show sample
    if transformed_parts:
        print(f"\n📋 Sample transformed part:")
        print(json.dumps(transformed_parts[0], indent=2))
    
    # Statistics
    categories = {}
    for part in transformed_parts:
        cat = part['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\n📈 Category Distribution:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"   {cat}: {count}")


if __name__ == "__main__":
    main()
