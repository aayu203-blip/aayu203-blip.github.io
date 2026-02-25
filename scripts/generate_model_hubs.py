
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(BASE_DIR, "pages", "models")
DB_PATH = os.path.join(BASE_DIR, "new_partDatabase.js")
TEMPLATE_PATH = os.path.join(PAGES_DIR, "template_model.html")

# Target Clusters (Manually Selected from Analysis)
CLUSTERS = [
    {"model": "Scania P410", "category": "Drivetrain", "slug": "scania-p410-drivetrain"},
    {"model": "Scania P410", "category": "Brake & Steering Systems", "slug": "scania-p410-brake-steering"},
    {"model": "Scania G440", "category": "Engine Components", "slug": "scania-g440-engine"},
    {"model": "Scania G440", "category": "Hydraulic Systems", "slug": "scania-g440-hydraulics"},
    {"model": "Volvo FMX480", "category": "Drivetrain", "slug": "volvo-fmx480-drivetrain"},
    {"model": "Volvo FMX480", "category": "Engine Components", "slug": "volvo-fmx480-engine"},
    {"model": "Volvo FMX480", "category": "Fasteners & Hardware", "slug": "volvo-fmx480-fasteners"}
]

def load_database():
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.search(r'const partDatabase = (\[.*\])', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        json_str = re.sub(r',\s*]', ']', json_str)
        json_str = re.sub(r',\s*}', '}', json_str)
        return json.loads(json_str)
    return []

def load_template():
    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as f:
        return f.read()

def generate_hubs():
    print("--- Generating Model Hub Pages ---")
    db = load_database()
    template = load_template()
    
    if not os.path.exists(PAGES_DIR):
        os.makedirs(PAGES_DIR)

    for cluster in CLUSTERS:
        print(f"Processing: {cluster['model']} - {cluster['category']}")
        
        # Filter Inventory
        inventory = []
        for part in db:
            p_app = part.get("Application", "").strip()
            p_cat = part.get("Category", "").strip()
            
            # Simple substring match for Model (e.g. "P410" in "Scania P410/G440")
            # And strict match for Category
            if cluster['model'].split(" ")[1] in p_app and cluster['category'] == p_cat:
                inventory.append(part)
        
        print(f"  > Found {len(inventory)} parts")
        
        if not inventory:
            continue
            
        # Build Grid HTML
        grid_html = ""
        for item in inventory:
            # Safely get fields
            part_no = item.get("Part No", "N/A")
            desc = item.get("Cleaned Description", "Spare Part").title()
            brand = item.get("Brand", "Generic")
            
            # Create a card
            # Using relative link to product page structure (assuming standard structure)
            # Actually, standard structure is /brand/category/partno.html
            # We need to construct that link carefully.
            
            # Normalize brand for URL
            brand_slug = brand.lower().replace(" ", "-")
            if "scania" in brand_slug: brand_slug = "scania" # Simplify for standard structure
            if "volvo" in brand_slug: brand_slug = "volvo"
            
            # Normalize category for URL
            # Note: This is tricky if categories don't match folder names perfectly.
            # Fallback to search query link if we can't be sure? 
            # OR assume flattened structure? 
            # Looking at `scania/engine/1104069.html`, content structure is hierarchical.
            
            # For this pilot, let's link to a "Quote" action or a search query to be safe/lazy
            # OR generate a link to `../../products/part_no` if we have a flat map
            # Let's use a WhatsApp Deep Link for immediate conversion since these are "landing pages"
            
            card = f"""
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-card transition-all duration-300">
                <div class="flex justify-between items-start mb-4">
                    <span class="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-1 rounded">{part_no}</span>
                    <span class="text-xs font-bold text-yellow-600">{brand}</span>
                </div>
                <h3 class="font-bold text-lg text-gray-900 mb-2 leading-tight">{desc}</h3>
                <p class="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{cluster['model']} Compatible</p>
                <a href="https://wa.me/971501234567?text=Quote%20for%20{part_no}%20({cluster['model']})" 
                   class="block w-full text-center bg-gray-900 text-white py-2 rounded font-medium hover:bg-yellow-500 hover:text-black transition-colors">
                    Check Price
                </a>
            </div>
            """
            grid_html += card

        # Inject into Template
        page_content = template
        page_content = page_content.replace("{{MODEL_NAME}}", cluster['model'])
        page_content = page_content.replace("{{CATEGORY_NAME}}", cluster['category'])
        page_content = page_content.replace("{{PART_COUNT}}", str(len(inventory)))
        page_content = page_content.replace("{{INVENTORY_ITEMS}}", grid_html)
        
        # Save
        filename = f"{cluster['slug']}.html"
        filepath = os.path.join(PAGES_DIR, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(page_content)
        
        print(f"  > Generated: {filename}")

if __name__ == "__main__":
    generate_hubs()
