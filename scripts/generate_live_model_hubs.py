
import json
import os
import re

# --- CONFIGURATION (Adapted for Live Migration) ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete")
LIVE_REPO_DIR = os.path.join(BASE_DIR, "aayu203-blip.github.io")

# Input paths
DB_PATH = os.path.join(EXPERIMENTS_DIR, "new_partDatabase.js")
TEMPLATE_PATH = os.path.join(EXPERIMENTS_DIR, "pages", "models", "template_model.html")
HEADER_PATH = os.path.join(EXPERIMENTS_DIR, "scripts", "live_header.html")
FOOTER_PATH = os.path.join(EXPERIMENTS_DIR, "scripts", "live_footer.html")

# Output path
OUTPUT_DIR = os.path.join(LIVE_REPO_DIR, "pages", "models")

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

def load_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def extract_body_content(html):
    pattern = r'(<!-- HERO -->.*)(?=<!-- FOOTER -->)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        return match.group(1)
    return "<!-- Content Extraction Failed -->"

def patch_header(header_html, page_url):
    """Fixes Canonical Tags and Anchor Links in the Live Header"""
    
    # 1. Fix Canonical Tag
    fixed_header = re.sub(
        r'<link href="https://partstrading.com/" rel="canonical"/>',
        f'<link href="{page_url}" rel="canonical"/>',
        header_html
    )
    
    # 2. Fix Anchor Links
    replacements = {
        'href="#home"': 'href="https://partstrading.com/#home"',
        'href="#brands"': 'href="https://partstrading.com/#brands"',
        'href="#products"': 'href="https://partstrading.com/#products"',
        'href="#equipment-models"': 'href="https://partstrading.com/#equipment-models"',
        'href="#product-categories"': 'href="https://partstrading.com/#product-categories"',
        'href="#contact"': 'href="https://partstrading.com/#contact"',
        'href="#faq"': 'href="https://partstrading.com/#faq"',
        'href="blog/index.html"': 'href="https://partstrading.com/blog/"'
    }
    
    for old, new in replacements.items():
        fixed_header = fixed_header.replace(old, new)
        
    return fixed_header

def generate_live_hubs():
    print("--- Generating Live Model Hub Pages (Emergency Repair) ---")
    
    db = load_database()
    template_full = load_file(TEMPLATE_PATH)
    live_header_raw = load_file(HEADER_PATH)
    live_footer = load_file(FOOTER_PATH)
    
    template_body = extract_body_content(template_full)
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    for cluster in CLUSTERS:
        print(f"Processing: {cluster['model']} - {cluster['category']}")
        
        inventory = []
        for part in db:
            p_app = part.get("Application", "").strip()
            p_cat = part.get("Category", "").strip()
            
            model_keyword = cluster['model'].split(" ")[1]
            if model_keyword in p_app and cluster['category'] == p_cat:
                inventory.append(part)
        
        if not inventory:
            continue
            
        grid_html = ""
        for item in inventory:
            part_no = item.get("Part No", "N/A")
            desc = item.get("Cleaned Description", "Spare Part").title()
            brand = item.get("Brand", "Generic")
            
            card = f"""
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover-card transition-all duration-300">
                <div class="flex justify-between items-start mb-4">
                    <span class="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-1 rounded">{part_no}</span>
                    <span class="text-xs font-bold text-yellow-600">{brand}</span>
                </div>
                <h3 class="font-bold text-lg text-gray-900 mb-2 leading-tight">{desc}</h3>
                <p class="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{cluster['model']} Compatible</p>
                <a href="https://wa.me/919821037990?text=Quote%20for%20{part_no}%20({cluster['model']})" 
                   class="block w-full text-center bg-gray-900 text-white py-2 rounded font-medium hover:bg-yellow-500 hover:text-black transition-colors">
                    Check Price
                </a>
            </div>
            """
            grid_html += card

        filename = f"{cluster['slug']}.html"
        filepath = os.path.join(OUTPUT_DIR, filename)
        page_url = f"https://partstrading.com/pages/models/{filename}"

        # --- PATCH HEADER ---
        patched_header = patch_header(live_header_raw, page_url)
        
        # Title/Desc Logic
        page_title = f"{cluster['model']} {cluster['category']} Parts | Parts Trading Company"
        page_desc = f"Shop {cluster['model']} {cluster['category']} parts. {len(inventory)}+ items in stock. Ships from Mumbai to Russia, Africa, and Global."
        
        patched_header = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', patched_header)
        patched_header = re.sub(
            r'<meta content=".*?" name="description"/>',
            f'<meta content="{page_desc}" name="description"/>',
            patched_header
        )

        body_content = template_body
        body_content = body_content.replace("{{MODEL_NAME}}", cluster['model'])
        body_content = body_content.replace("{{CATEGORY_NAME}}", cluster['category'])
        body_content = body_content.replace("{{PART_COUNT}}", str(len(inventory)))
        body_content = body_content.replace("{{INVENTORY_ITEMS}}", grid_html)
        
        final_html = patched_header + "\n" + body_content + "\n" + live_footer
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(final_html)
        
        print(f"  > Generated: {filepath}")

if __name__ == "__main__":
    generate_live_hubs()
