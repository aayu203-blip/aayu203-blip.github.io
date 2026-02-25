
import json
import os
import re

# --- CONFIGURATION ---
BASE_DIR = "/Users/aayush/Downloads/PTC Website/Working Website"
EXPERIMENTS_DIR = os.path.join(BASE_DIR, "EXPERIMENTS", "PTC_Website_Complete")
LIVE_REPO_DIR = os.path.join(BASE_DIR, "aayu203-blip.github.io")

# Input paths
DB_PATH = os.path.join(EXPERIMENTS_DIR, "new_partDatabase.js")
# We use the manually designed prototype as the source template
TEMPLATE_PATH = os.path.join(EXPERIMENTS_DIR, "pages", "intercept", "replacement-for-kramp-731136001.html") 
HEADER_PATH = os.path.join(EXPERIMENTS_DIR, "scripts", "live_header.html")
FOOTER_PATH = os.path.join(EXPERIMENTS_DIR, "scripts", "live_footer.html")

# Output path
OUTPUT_DIR = os.path.join(LIVE_REPO_DIR, "pages", "intercept")

# Safety Limit (Removed for full run, but good to keep in mind)
# LIMIT = 5000 

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
    """Extracts content specific to the intercept page, excluding header/footer"""
    # We want everything from the Urgency Banner to the end of the content sections
    # The template has <!-- URGENCY BANNER --> which is perfect start
    # It ends before <!-- LIVE FOOTER -->
    pattern = r'(<!-- URGENCY BANNER -->.*)(?=<!-- LIVE FOOTER)'
    match = re.search(pattern, html, re.DOTALL)
    if match:
        return match.group(1)
    
    # Fallback if comments are missing/changed
    print("Warning: Regex extraction failed, using fallback slicing.")
    return "<!-- Content Extraction Failed -->"

def clean_filename(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

def determine_brand(alt_num_raw):
    if "dt part" in alt_num_raw.lower():
        return "DT Spare Parts", alt_num_raw.split("-")[-1].strip()
    if "bosch" in alt_num_raw.lower():
        return "Bosch", alt_num_raw.split("-")[-1].strip()
    return "OEM", alt_num_raw.strip()

def patch_header(header_html, page_url):
    """Fixes Canonical Tags and Anchor Links in the Live Header"""
    
    # 1. Fix Canonical Tag
    # Replace existing canonical with the specific page URL
    fixed_header = re.sub(
        r'<link href="https://partstrading.com/" rel="canonical"/>',
        f'<link href="{page_url}" rel="canonical"/>',
        header_html
    )
    
    # 2. Fix Anchor Links (Make them absolute)
    # Map of relative anchors to absolute URLs
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

def generate_pages():
    print("--- Starting Live Intercept Page Generation (Emergency Repair) ---")
    
    # 1. Load Resources
    db = load_database()
    template_full = load_file(TEMPLATE_PATH)
    live_header_raw = load_file(HEADER_PATH)
    live_footer = load_file(FOOTER_PATH)
    
    # 2. Extract Body
    template_body = extract_body_content(template_full)
    
    # 3. Ensure Output Directory
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    count = 0
    
    for part in db:
        # Collect Targets (Same logic as original)
        targets = []
        
        # Alt Part Nos
        for i in range(1, 8):
            key = f"Alt Part No {i}"
            if key in part and part[key] and part[key].strip():
                raw = part[key].strip()
                brand, num = determine_brand(raw)
                targets.append({"brand": brand, "num": num, "type": "Alt"})

        # OEM Part Nos
        if "OEM Part Nos" in part and part["OEM Part Nos"] and part["OEM Part Nos"].strip():
             raws = part["OEM Part Nos"].split(",")
             for raw in raws:
                 brand, num = determine_brand(raw)
                 targets.append({"brand": brand, "num": num, "type": "OEM"})
        
        # Generate Pages
        for target in targets:
            brand_slug = clean_filename(target['brand'])
            num_slug = clean_filename(target['num'])
            
            if len(num_slug) < 4: continue
                
            filename = f"replacement-for-{brand_slug}-{num_slug}.html"
            filepath = os.path.join(OUTPUT_DIR, filename)
            page_url = f"https://partstrading.com/pages/intercept/{filename}"
            
            # --- PATCH HEADER ---
            patched_header = patch_header(live_header_raw, page_url)
            
            # --- UPDATE HEADER TITLE/META ---
            # Define Title/Desc
            page_title = f"Replacement for {target['brand']} {target['num']} | Parts Trading Company"
            page_desc = f"Looking for {target['brand']} {target['num']}? We stock the direct OEM equivalent. Immediate dispatch from Mumbai to Russia, Africa, and Global."
            
            # Regex Replace Title
            patched_header = re.sub(r'<title>.*?</title>', f'<title>{page_title}</title>', patched_header)
            
            # Regex Replace Description
            patched_header = re.sub(
                r'<meta content=".*?" name="description"/>',
                f'<meta content="{page_desc}" name="description"/>',
                patched_header
            )

            # --- PREPARE BODY ---
            content = template_body
            
            # Text Replacements
            content = content.replace("Kramp", target['brand'])
            content = content.replace("731136001", target['num'])
            
            # Content Contextualization
            real_name = part.get("Cleaned Description", "Spare Part").title()
            real_cat = part.get("Category", "Heavy Machinery Parts")
            
            content = content.replace("Hydraulic Seal Kit", real_name)
            content = content.replace("Hydraulic seal kit", real_name.lower())
            content = content.replace("Viton / NBR", real_cat)
            content = content.replace("/ Danfoss", "")
            content = content.replace("This kit is", "This component is")
            
            # --- ASSEMBLE ---
            # Add Spacer div because the header is fixed
            spacer = '<div class="h-24"></div>' 
            
            final_html = patched_header + "\n" + spacer + "\n" + content + "\n" + live_footer
            
            # Write
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(final_html)
            
            # print(f"Generated: {filename}")
            count += 1
            
            # Verify one file to be safe
            if count == 1:
                print(f"Verified First Generation: {filepath}")
                print(f"Canonical set to: {page_url}")

    print(f"--- Completed. Overwritten {count} pages in Live Repo. ---")

if __name__ == "__main__":
    generate_pages()
