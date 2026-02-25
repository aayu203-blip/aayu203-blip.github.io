import os

ROOT_DIR = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
TAILWIND_CDN_MATCH = '<script src="https://cdn.tailwindcss.com"></script>'
TAILWIND_LOCAL_LINK = '<link rel="stylesheet" href="/assets/css/tailwind.css">'

# Directories to exclude from the scan
EXCLUDE_DIRS = {
    'god-mode',
    'next-engine',
    '.git',
    'node_modules',
    'backup',
    'BACKUP_BEFORE_ENRICHMENT'
}

def apply_tailwind_fix():
    updated_count = 0
    scanned_count = 0
    
    print(f"Starting scan in: {ROOT_DIR}")
    
    for root, dirs, files in os.walk(ROOT_DIR):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.')]
        
        for file in files:
            if file.endswith(".html"):
                scanned_count += 1
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for CDN usage (flexible check for src attribute)
                    if "cdn.tailwindcss.com" in content and TAILWIND_LOCAL_LINK not in content:
                        # Replace the specific script tag
                        # We use a slightly more robust replace in case multiple spaces or attributes differ slightly
                        # But mostly the codebase uses the exact string: <script src="https://cdn.tailwindcss.com"></script>
                        
                        if TAILWIND_CDN_MATCH in content:
                            new_content = content.replace(TAILWIND_CDN_MATCH, TAILWIND_LOCAL_LINK)
                            
                            with open(file_path, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                            
                            updated_count += 1
                            print(f"[FIXED] {file_path}")
                        else:
                            # Fallback regex-like replacement if exact match fails but domain exists
                            # For safety, we only do exact match for now to avoid breaking other scripts
                            # But we log it
                            print(f"[WARNING] Found Tailwind CDN but exact tag match failed in: {file_path}")
                            
                except Exception as e:
                    print(f"[ERROR] Could not process {file_path}: {e}")
                    
    print("-" * 50)
    print(f"Total HTML files scanned: {scanned_count}")
    print(f"Files updated with local Tailwind CSS: {updated_count}")
    print("-" * 50)

if __name__ == "__main__":
    apply_tailwind_fix()
