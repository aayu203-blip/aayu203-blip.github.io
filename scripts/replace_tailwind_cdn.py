
import os
import re

def replace_tailwind_cdn(directory):
    # Pattern to find (exact string match is safer for simple script tags)
    cdn_pattern = '<script src="https://cdn.tailwindcss.com"></script>'
    
    # Replacement string - absolute path from root
    local_css = '<link rel="stylesheet" href="/assets/css/tailwind.css">'
    
    count = 0
    checked = 0
    
    print(f"Scanning directory: {directory}")
    print(f"Replacing '{cdn_pattern}' with '{local_css}'")
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and .git
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith(".html"):
                checked += 1
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    if cdn_pattern in content:
                        new_content = content.replace(cdn_pattern, local_css)
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        # print(f"Updated: {path}")
                        count += 1
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    
    print(f"\nSummary:")
    print(f"Files scanned: {checked}")
    print(f"Files updated: {count}")

if __name__ == "__main__":
    # Run from current directory
    replace_tailwind_cdn(".")
