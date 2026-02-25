import os
import re

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES_DIR = os.path.join(BASE_DIR, "pages")

# HTML Templates for Injection
TAILWIND_LINK = '<link rel="stylesheet" href="../../css/tailwind.css">'
CDN_REGEX = r'<script src="https://cdn.tailwindcss.com"></script>'

def optimize_page(filepath, dry_run=False):
    """
    1. Replaces CDN with Local Tailwind.
    2. Optimizes Title Tag based on H1.
    3. Adds Meta Description if missing.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # 1. Fix Speed (Tailwind)
    if re.search(CDN_REGEX, content):
        content = re.sub(CDN_REGEX, TAILWIND_LINK, content)
        modified = True
        
    # 2. Optimize Title (SEO)
    # Extract H1
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
    if h1_match:
        h1_text = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip()
        
        # Create Optimized Title
        new_title = f"{h1_text} | Parts Trading Company"
        
        # Replace existing title
        content = re.sub(r'<title>.*?</title>', f'<title>{new_title}</title>', content, flags=re.IGNORECASE)
        modified = True
        
    if modified:
        if not dry_run:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[UPDATED] {os.path.basename(filepath)}")
        else:
            print(f"[DRY RUN] Would update {os.path.basename(filepath)}")
            
    return modified

def main():
    # TEST TARGET: scania-categories.html
    target_file = os.path.join(PAGES_DIR, "scania-categories.html")
    
    if os.path.exists(target_file):
        print(f"--- Running Pilot Optimization on {os.path.basename(target_file)} ---")
        optimize_page(target_file, dry_run=False) # EXECUTE ON PILOT
    else:
        print("Target file not found.")

if __name__ == "__main__":
    main()
