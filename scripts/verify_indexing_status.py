import os
import re
from pathlib import Path

def verify_indexing_status(directory):
    """
    Verifies the indexing status of pages by checking for 'noindex' tags.
    Counts indexed vs. non-indexed pages.
    """
    total_pages = 0
    indexed_pages = 0
    noindex_pages = 0
    
    # Patterns for noindex
    noindex_pattern = re.compile(r'<meta\s+name=["\']robots["\']\s+content=["\'].*?noindex.*?["\']', re.IGNORECASE)
    
    print(f"Scanning directory: {directory}")
    print("-" * 50)
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and .git
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith(".html"):
                total_pages += 1
                filepath = os.path.join(root, file)
                
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        
                        if noindex_pattern.search(content):
                            noindex_pages += 1
                            # Optional: Print first few noindex components
                            if noindex_pages <= 5:
                                print(f"[NOINDEX] {os.path.relpath(filepath, directory)}")
                        else:
                            indexed_pages += 1
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

    print("-" * 50)
    print(f"Total HTML Pages: {total_pages}")
    print(f"Indexed Pages: {indexed_pages}")
    print(f"NoIndex Pages: {noindex_pages}")
    print("-" * 50)

if __name__ == "__main__":
    # root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_dir = "/Users/aayush/Downloads/PTC Website/Working Website/EXPERIMENTS/PTC_Website_Complete"
    verify_indexing_status(root_dir)
