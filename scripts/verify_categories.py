"""
Verify SRP category slugs by checking HTTP status
"""

import requests
import time

def verify_categories(candidates):
    print(f"Testing {len(candidates)} candidates...")
    
    valid = []
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
    }
    
    for slug in candidates:
        url = f"https://srp.com.tr/volvo/category/{slug}"
        try:
            response = requests.get(url, headers=headers, timeout=5, allow_redirects=False)
            
            if response.status_code == 200 and "OOPS" not in response.text:
                print(f"✅ VALID: {slug}")
                valid.append(slug)
            else:
                print(f"❌ Invalid: {slug} ({response.status_code})")
                
            time.sleep(0.5)
        except Exception as e:
            print(f"⚠️ Error: {slug} - {e}")
            
    return valid

def main():
    # Generate candidates
    base_terms = [
        "engine", "transmission", "gearbox", "brake", "axle", "suspension",
        "cabin", "body", "electric", "electrical", "hydraulic", "cooling",
        "exhaust", "fuel", "steering", "undercarriage", "filter", "filters",
        "bearing", "bearings", "seal", "seals", "sensor", "sensors",
        "switch", "switches", "pump", "pumps", "valve", "valves",
        "compressor", "clutch", "propeller", "shaft", "mounting",
        "glass", "mirror", "seat", "light", "lighting"
    ]
    
    suffixes = ["", "-system", "-components", "-parts", "-kit", "-set"]
    
    candidates = []
    for term in base_terms:
        for suffix in suffixes:
            candidates.append(f"{term}{suffix}")
            
    # Add known complex ones
    candidates.append("electrical-system-and-instrumentation")
    candidates.append("air-compressor-system")
    candidates.append("clutch-servo-system")
    
    print(f"Generated {len(candidates)} candidates to test")
    
    valid_categories = verify_categories(candidates)
    
    print("\n" + "="*40)
    print(f"Found {len(valid_categories)} valid categories:")
    for cat in valid_categories:
        print(cat)
        
    # Save
    if valid_categories:
        with open('srp_verified_categories.txt', 'w') as f:
            for cat in sorted(valid_categories):
                f.write(f"{cat}\n")

if __name__ == "__main__":
    main()
