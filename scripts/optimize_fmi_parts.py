"""
Optimize FMI parts with specific rules and benefits

This script applies the logic from `optimize_features_specs.py` to the FMI parts data,
injecting product-specific benefits into the `technical_specs` field ensuring
they match the "optimized" quality of the rest of the database.

Usage:
    python3 scripts/optimize_fmi_parts.py
"""

import json
from pathlib import Path
import re

# Logic from optimize_features_specs.py
PRODUCT_SPECIFIC_FEATURES = {
    'ring': {
        'intermediate': "Maintains precise valve clearance, Prevents exhaust gas leakage",
        'piston': "Seals combustion chamber, Reduces friction, Controls oil consumption",
        'synchronizer': "Enables smooth gear engagement, Matches shaft speeds",
        'default': "Ensures proper alignment, Reduces friction, Prevents premature wear"
    },
    'valve': {
        'exhaust': "Controls exhaust gas flow, Withstands extreme temps",
        'check': "Prevents reverse flow, Maintains system pressure",
        'relief': "Prevents overpressure damage, Protects seals and hoses",
        'default': "Regulates flow, Maintains optimal pressure"
    },
    'filter': {
        'oil': "Removes contaminants, Extends engine life",
        'fuel': "Traps water/particles, Protects injection system",
        'air': "Filters intake air, Maintains air-fuel mixture",
        'default': "High filtration efficiency, Extended service intervals"
    },
    'gasket': {
        'head': "Seals combustion chamber, Withstands high pressure",
        'default': "Creates reliable seal, Prevents leakage"
    },
    'sensor': {
        'temperature': "Accurate monitoring, Fast response time",
        'pressure': "Real-time pressure monitoring, Critical for safety",
        'default': "Provides accurate data, Essential for diagnostics"
    },
    'pump': "Consistent output pressure, Durable construction",
    'bearing': "Reduces friction, Handles high loads, Precision-ground",
    'seal': "Prevents fluid leakage, Heat-resistant material",
    'hose': "Flexible construction, Pressure-rated, Reinforced design",
    'bolt': "High tensile strength, Corrosion-resistant coating",
    'gear': "Precision machined, Hardened steel for durability, Quiet operation",
    'bushing': "Reduces vibration, Absorb shocks, Long-lasting wear resistance",
    'injector': "Precise fuel metering, Optimizes combustion, Reduces emissions",
    'cylinder': "High-strength alloy, Precision honed, Durable coating"
}

def get_specific_features(product_name, category):
    """Get product-specific features string"""
    product_lower = product_name.lower()
    
    # Check for product type
    for key, value in PRODUCT_SPECIFIC_FEATURES.items():
        if key in product_lower:
            if isinstance(value, dict):
                # Check for specific variants
                for variant, features in value.items():
                    if variant in product_lower:
                        return features
                # Return default for this type
                return value.get('default', "")
            else:
                # Direct string
                return value
    
    # Generic fallback based on category
    if 'engine' in category.lower():
        return "Designed for high-performance engines, OEM quality standards"
    elif 'brake' in category.lower():
        return "Reliable braking performance, Safety critical component"
    else:
        return "Built to exacting specifications, Reliable performance"

def optimize_part(part):
    """Apply optimizations to a single part"""
    specs = part.get('technical_specs', {})
    
    # 1. Inject Key Benefits if not present
    if "Key Benefits" not in specs:
        benefits = get_specific_features(part['product_name'], part['category'])
        if benefits:
             # Insert as the first item if possible (Python 3.7+ preserves insertion order)
            new_specs = {"Key Benefits": benefits}
            new_specs.update(specs)
            part['technical_specs'] = new_specs
            
    # 2. Optimize Application string
    # If application is a list in FMI metadata, ensure it's a clean string in the top level
    if part.get("application") and len(part["application"]) > 100:
         # Truncate if too long for display
         part["application"] = part["application"][:97] + "..."

    # 3. Enhance Product Name for SEO
    # Ensure "Genuine" or "Premium" is implied in description (already done in transformation)
    
    # 4. JSON-LD Enrichment
    # Add 'offers' schema if missing (Price on Request)
    if 'offers' not in part['json_ld']:
        part['json_ld']['offers'] = {
            "@type": "Offer",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "price": "0.00" # Indicates "Contact for Price" often
        }

    return part

def main():
    base_dir = Path("/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete")
    input_file = base_dir / "srp_scraped_data/fmi_parts_transformed.json"
    output_file = input_file # Overwrite with optimized version
    
    print(f"🔧 Optimizing FMI parts in: {input_file}")
    
    with open(input_file, 'r') as f:
        parts = json.load(f)
        
    optimized_count = 0
    for part in parts:
        optimize_part(part)
        optimized_count += 1
        
    # Save back
    with open(output_file, 'w') as f:
        json.dump(parts, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Optimized {optimized_count} parts with specific rules and benefits.")
    
    # Now verify sample
    print("\n📋 Sample Optimized Part Specs:")
    print(json.dumps(parts[0]['technical_specs'], indent=2))

if __name__ == "__main__":
    main()
